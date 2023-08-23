// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
    uint256 public maxSupply;
    uint256 public totalSupply;
    address public owner;

    //Domain Model
    struct Domain{
        string name;
        uint256 cost;
        bool isOwned;
    }

    mapping(uint256 => Domain) domains;

    //Constructor Function
    constructor(string memory _name, string memory _symbol) 
        ERC721(_name, _symbol){
            owner = msg.sender;
    }

    //Modifiers
    modifier onlyOwner{
        require(msg.sender == owner, "Only owner can perform this operation!");
        _;
    }

    //List a domain
    function list(string memory _domainName, uint256 _cost) public onlyOwner{
        maxSupply++;
        domains[maxSupply] = Domain(_domainName, _cost, false);
    }

    //Get DOmains
    function getDomains(uint256 _id) public view returns(Domain memory){
        return domains[_id];
    }

    //Minting NFTs
    function mint(uint256 _id)public payable {
        require(_id != 0, "ID cannot be set to zero");
        require(_id <= maxSupply, "Incorrect value for ID.");
        require(domains[_id].isOwned == false, "Domain is already owned by someone.");
        require(msg.value == domains[_id].cost, "Insufficient funds");

        domains[_id].isOwned = true;
        totalSupply++;
        _safeMint(msg.sender, _id);
    }

    //Getting Balance
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    //Withdraw funds locked in contract
    function withdraw() public onlyOwner{
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
