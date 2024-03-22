// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Erc20Mock is ERC20 , Ownable {

    constructor(address initialOwner)Ownable(initialOwner) ERC20("ERC20Mock" , "E2M"){}

    function mint(address user , uint256 amount) external onlyOwner() {
        _mint(user, amount);
    }
}