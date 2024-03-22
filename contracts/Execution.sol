// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../interfaces/IExcutionProxy.sol" ;


contract Exucution is IExcutionProxy , Ownable {

    mapping(address => bool) public whiteListed ;
    mapping(address => bool) public revokedApproval ;

    event RevokeApproval(address indexed user) ;
    event GrantApproval(address indexed user) ;

    event WhiteListed(address indexed user) ;
    event UnWhiteListed(address indexed user) ;

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyWhiteListed(){
        require(whiteListed[msg.sender] , "Contract is not approve to make transfers");
        _;
    }

    function whiteList(address user) external onlyOwner() {
        whiteListed[user] = true;
    }

    function unWhiteList(address user) external onlyOwner() {
        whiteListed[user] = false;
    }


    function grantApproval() external {
        revokedApproval[msg.sender] = true ;
    }

    function revokeApproval() external  {
        revokedApproval[msg.sender] = false ;
        emit RevokeApproval(msg.sender);
    }


    function transferERC1155(address token , address from , address to , uint256 tokenId , uint256 amount )external payable onlyWhiteListed(){
        IERC1155(token).safeTransferFrom(from, to, tokenId, amount, "");
    }

    function transferERC721(address token , address from , address to , uint256 tokenId )external payable onlyWhiteListed(){
        IERC721(token).safeTransferFrom(from, to, tokenId);
    }

    function transferERC20(address token , address from , address to , uint256 amount)external payable onlyWhiteListed{
        IERC20(token).transferFrom(from, to, amount);
    }
}