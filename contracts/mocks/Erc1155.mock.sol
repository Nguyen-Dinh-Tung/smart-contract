// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Erc1155Mock is ERC1155  , Ownable {

    constructor(address initialOwner)Ownable(initialOwner) ERC1155(""){}

    function mint(address to , uint256 id , uint256 amount , bytes memory data)public onlyOwner() {
        _mint(to, id, amount, data);
    }

}