// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "./OrderEnum.sol" ;

struct Fee {
    uint16 bps ;
    address receiver ;
}

struct Order{
    address maker;
    address owner;
    
    OrderType orderType ;
    AssetTypes assetType ;

    address assetToken ;
    address payToken ;
    uint256 assetIdentifier ;
    uint256 assetAmount ;
    uint256 payAmount ;


    uint256 endTime ; 
    uint256 startTime ; 

    Fee[] fees ;
    bytes orderData ;
}