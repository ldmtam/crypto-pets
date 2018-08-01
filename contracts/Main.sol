pragma solidity ^0.4.18;

import "./CryptoPets.sol";

contract Main is CryptoPets {

    function Main(address _admin, address _operator) public {
        admin = _admin;
        operator = _operator;
    }

    struct SellingToken {
        uint256 tokenId;
        uint256 price;
        bool isSold;
        address seller;
    }

    SellingToken[] public sellingTokens;
    mapping (address => uint256) public sellingTokenOwner;
    mapping (uint256 => uint256) internal indexPosition;

    uint256 public minPrice = 0.05 ether;
    
    event SellToken(address indexed _seller, uint256 _tokenId, uint256 _price, uint256 _blockNumber);
    event BuyToken(address indexed _buyer, address indexed _seller, uint256 _tokenId, uint256 _price, uint256 _blockNumber);
    event CancelOrder(address indexed _seller, uint256 _tokenId, uint256 _blockNumber);

    function onERC721Received(address _from, uint256 _tokenId, bytes _data) public returns(bytes4) {
        return ERC721_RECEIVED;
    }

    function sellToken(uint256 _tokenId, uint256 _price) public canTransfer(_tokenId) {
        require(_price >= minPrice);

        safeTransferFrom(msg.sender, address(this), _tokenId);

        SellingToken memory token = SellingToken({
            tokenId: _tokenId,
            price: _price,
            isSold: false,
            seller: msg.sender
        });

        uint256 index = sellingTokens.push(token) - 1;
        indexPosition[_tokenId] = index;
        sellingTokenOwner[msg.sender] = sellingTokenOwner[msg.sender].add(1);

        emit SellToken(msg.sender, _tokenId, _price, block.number);
    }

    function buyToken(uint256 _tokenId) public payable {
        uint256 index = indexPosition[_tokenId];
        address seller = sellingTokens[index].seller;
        uint256 price = sellingTokens[index].price;

        require(msg.value >= price);

        this.safeTransferFrom(address(this), msg.sender, _tokenId);

        seller.transfer(price);
        sellingTokens[index].isSold = true;
        sellingTokenOwner[seller] = sellingTokenOwner[seller].sub(1);

        if (msg.value > price) {
            uint256 change = msg.value - price;
            
            msg.sender.transfer(change);
        }

        emit BuyToken(msg.sender, seller, _tokenId, price, block.number);
    }

    function cancelOrder(uint256 _tokenId) public {
        uint256 index = indexPosition[_tokenId];
        address seller = sellingTokens[index].seller;
        uint256 price = sellingTokens[index].price;

        require(msg.sender == seller);

        this.safeTransferFrom(address(this), msg.sender, _tokenId);

        delete sellingTokens[indexPosition[_tokenId]];
        delete indexPosition[_tokenId];
        sellingTokenOwner[msg.sender] = sellingTokenOwner[msg.sender].sub(1);

        emit CancelOrder(msg.sender, _tokenId, block.number);
    }

    function getPriceByTokenId(uint256 _tokenId) public view returns (uint256) {
        uint256 index = indexPosition[_tokenId];
        return sellingTokens[index].price;
    }

    function getSellingStatusByTokenId(uint256 _tokenId) public view returns (bool) {
        uint256 index = indexPosition[_tokenId];
        return sellingTokens[index].isSold;
    }

    function getSellerAddressByTokenId(uint256 _tokenId) public view returns (address) {
        uint256 index = indexPosition[_tokenId];
        return sellingTokens[index].seller;
    }

    function getListOfTokenBySeller(address _seller) public view returns (uint256[]) {
        uint256[] memory temp = new uint256[](sellingTokenOwner[_seller]);
        uint256 count = 0;

        for (uint256 i = 0; i < sellingTokens.length; i++) {
            if (sellingTokens[i].seller == _seller) {
                temp[count] = i;
                count = count.add(1);
            }
        }

        return temp;
    }

}