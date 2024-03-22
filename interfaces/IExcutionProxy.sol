// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IExcutionProxy {
   function transferERC20(address token , address from , address to , uint256 amount ) payable external;
   function transferERC721(address token , address from , address to , uint256 tokenId )payable external;
   function transferERC1155(address token , address from , address to , uint256 tokenId , uint256 amount )payable external;
}