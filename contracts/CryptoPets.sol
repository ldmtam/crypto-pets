pragma solidity ^0.4.18;

import "./libs/AccessControl.sol";
import "./libs/SafeMath.sol";
import "./libs/AddressUtils.sol";
import "./erc721/ERC721Basic.sol";
import "./erc721/ERC721Receiver.sol";

contract CryptoPets is AccessControl, ERC721Basic {
    using SafeMath for uint256;
    using AddressUtils for address;
    // Equals to `bytes4(keccak256("onERC721Received(address,uint256,bytes)"))`
    bytes4 constant ERC721_RECEIVED = 0xf0b9e5ba;
    
    event TokenCreated(address indexed owner, uint256 id, string name, string dna, uint256 blockNumber);
    event PetNameChanged(address indexed owner, uint256 tokenId, string oldName, string newName, uint256 blockNumber);

    // mapping from token ID to owner.
    mapping (uint256 => address) internal tokenOwner;
    
    // mapping from token ID to approved address.
    mapping (uint256 => address) internal tokenApprovals;
    
    // mapping from address to number of owned token.
    mapping (address => uint256) internal ownedTokensCount;

    // mapping from address to array of owned token.        
    //mapping (address => uint256[]) internal ownedTokensList;
    
    modifier canTransfer(uint256 _tokenId) {
        require(isApprovedOrOwner(msg.sender, _tokenId));
        _;
    }
    
    struct Pet {
        string name;
        string dna;
    }
    
    // keep all pets
    Pet[] internal pets;

    
    /// @dev create a new Pet token by admin or operator
    function createToken(address _owner, string _name, string _dna) public onlyCLevel {
        require (_owner != address(0));
        
        _createToken(_owner, _name, _dna);
    }
    
    function payForToken(string _name, string _dna) public payable {
        require(msg.value >= 0.05 ether);
        
        _createToken(msg.sender, _name, _dna);
    }
    
    function _createToken(address _owner, string _name, string _dna) internal {
        Pet memory pet = Pet({
            name: _name,
            dna: _dna
        });
        
        uint256 newTokenId = pets.push(pet) - 1;
        tokenOwner[newTokenId] = _owner;
        ownedTokensCount[_owner] = ownedTokensCount[_owner].add(1);
        
        emit TokenCreated(_owner, newTokenId, _name, _dna, block.number);
    }

    function changePetName(uint256 _tokenId, string _newName) public {
        require (ownerOf(_tokenId) == msg.sender);
        
        Pet storage pet = pets[_tokenId];
        string memory oldName = pet.name;
        pet.name = _newName;

        emit PetNameChanged(msg.sender, _tokenId, oldName, _newName, block.number);
    }
    
    function getToken(uint256 _tokenId) public view returns
    (
        address _owner, 
        string _name, 
        string _dna
    ) {
        _owner = tokenOwner[_tokenId];
        _name = pets[_tokenId].name;
        _dna = pets[_tokenId].dna;
    }
    
    /// @dev return number of token `_owner` owned.
    function balanceOf(address _owner) public view returns (uint256) {
        return ownedTokensCount[_owner];
    }
    
    /// @dev return token's owner.
    function ownerOf(uint256 _tokenId) public view returns (address) {
        return tokenOwner[_tokenId];
    }
    
    function getApproved(uint256 _tokenId) public view returns (address) {
        return tokenApprovals[_tokenId];
    }
    
    function approve(address _to, uint256 _tokenId) public {
        require(_to != address(0));
        require(ownerOf(_tokenId) == msg.sender);
        require(_to != ownerOf(_tokenId));
        
        tokenApprovals[_tokenId] = _to;
        emit Approval(ownerOf(_tokenId), _to, _tokenId);
    }
    
    function isApprovedOrOwner(address _spender, uint256 _tokenId) internal view returns (bool) {
        address owner = ownerOf(_tokenId);
        return _spender == owner || _spender == tokenApprovals[_tokenId];
    }
     
    /// @dev transfer `_tokenId` from `_from` to `_to`.
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public canTransfer(_tokenId) {
        require(address(_from) != address(0));
        require(address(_to) != address(0));
    
        if(_to.isContract() == true && ERC721Receiver(_to).onERC721Received(_from, _tokenId, "") != ERC721_RECEIVED) {
            revert();
        }
    
        clearApproval(_from, _tokenId);
        removeTokenFrom(_from, _tokenId);
        addTokenTo(_to, _tokenId);
        
        emit Transfer(_from, _to, _tokenId);
    }
    
    function clearApproval(address _owner, uint256 _tokenId) internal {
        require(ownerOf(_tokenId) == _owner);
        
        if (tokenApprovals[_tokenId] != address(0)) {
            tokenApprovals[_tokenId] = address(0);
            emit Approval(_owner, address(0), _tokenId);
        }
    }
    
    function removeTokenFrom(address _from, uint256 _tokenId) internal {
        require(ownerOf(_tokenId) == _from);
        ownedTokensCount[_from] = ownedTokensCount[_from].sub(1);
        tokenOwner[_tokenId] = address(0);
    }
    
    function addTokenTo(address _to, uint256 _tokenId) internal {
        require(tokenOwner[_tokenId] == address(0));
        tokenOwner[_tokenId] = _to;
        ownedTokensCount[_to] = ownedTokensCount[_to].add(1);
    }
}