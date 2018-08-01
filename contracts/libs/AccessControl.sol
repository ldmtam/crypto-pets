pragma solidity ^0.4.18;

contract AccessControl {
    address public admin;
    address public operator;
    
    bool public paused = false;
    
    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }
    
    modifier onlyOperator {
        require(msg.sender == operator);
        _;
    }
    
    modifier onlyCLevel {
        require(msg.sender == admin || msg.sender == operator);
        _;
    }
    
    function setAdmin(address _newAdmin) public onlyAdmin {
        admin = _newAdmin;
    }
    
    function setOperator(address _newOperator) public onlyAdmin {
        operator = _newOperator;
    }
    
    modifier whenNotPaused {
        require(!paused);
        _;
    }
    
    modifier whenPaused {
        require(paused);
        _;
    }
    
    function pause() public onlyAdmin whenNotPaused {
        paused = true;
    }
    
    function unpause() public onlyAdmin whenPaused {
        paused = false;
    }
}