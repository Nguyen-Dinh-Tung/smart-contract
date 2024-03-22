// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Erc721Mock is ERC721, Ownable{
    constructor(address initialOwner)Ownable(initialOwner) ERC721("Erc721Mock" , "E7M"){}
    

    function safeMint(address to ,uint256 tokenId)public onlyOwner() {
        _safeMint(to, tokenId);
    }
}