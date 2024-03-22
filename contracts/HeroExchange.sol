// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "../interfaces/IExcutionProxy.sol";
import "../libs/OrderStruct.sol";
import "../libs/OrderEnum.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract HeroExchange is Ownable {

    constructor(address initial) Ownable(initial) {

    }

    mapping(address => bool) public whiteTokens ; 
    mapping (bytes32 => bool) public cancelledOrFilled;
    uint256 public feeRate ;
    address public feeRecipient ;
    uint256 public constant INVERSE_BASIS_POINT  = 10_000 ;

    IExcutionProxy public executionProxy ;

    event WhiteTokens(address [] whiteList , address [] blackList) ;
    event Execute(Order);

    function setExecution(IExcutionProxy executionAddress)external onlyOwner() {
        require(address(executionAddress) != address(0) , "Execution can not zero address");
        executionProxy = executionAddress;
    }

    function updateWhiteListToken
    (address [] calldata whiteList , address [] calldata blackList)
    external onlyOwner() 
    {
        for (uint256 index = 0; index < whiteList.length; index++) {
            whiteTokens[whiteList[index]] = true ;
        }

        for (uint256 index = 0; index < blackList.length; index++) {
            whiteTokens[blackList[index]] = false ;
        }
    }

    function setFee(uint256 newRate) external onlyOwner() {
        feeRate = newRate ;
    }

    function execute(Order calldata order)
    external payable{
        _payment(
        order.payToken,order.maker ,
        order.owner, order.payAmount, 
        order.fees);
        
        _transferAsset(
        order.assetType, order.assetToken, 
        order.owner, order.maker, order.assetIdentifier, 
        order.assetAmount);
    }

    function _payment(
        address token , address from , 
        address to , uint256 amount, 
        Fee[]calldata fees)
    internal 
    {
        require(_whiteListToken(token) , "Invalid payment token");
        uint256 paid = 0;
        for (uint256 index = 0; index < fees.length; index++) {
            uint256 fee = (amount * fees[index].bps) / INVERSE_BASIS_POINT ;
            _payTo(token, from, fees[index].receiver, fee);
            paid += fee ;
        }

        if(feeRate > 0){
            uint256 fee = (amount * feeRate) / INVERSE_BASIS_POINT;
            _payTo(token, from, feeRecipient, fee);
        }

        require(paid <= amount , "Fee more than pay amount");

        _payTo(token, from, to, amount - paid);
    }

    function _payTo(address token , address from , address to , uint256 amount) internal {
        if(amount == 0){
            return;
        }

        if(token == address(0)){
            require(to != address(0) , "Transfer to zero address");
            (bool success ,) = payable(to).call{value : amount}("") ;
            require(success , "Navite transfer failed");
        }else{
        executionProxy.transferERC20(token, from, to, amount);
        }
    }


    function _transferAsset(AssetTypes typeAsset ,address token , address from , address to ,uint256 tokenId, uint256 amount)internal {
        if(AssetTypes.ERC721 == typeAsset){
            executionProxy.transferERC721(token, from, to, tokenId);
        }else{
            executionProxy.transferERC1155(token, from, to, tokenId, amount);
        }
    }

    function _whiteListToken(address token) internal view returns(bool) {
        return whiteTokens[token] ;
    }
}