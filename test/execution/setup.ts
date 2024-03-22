import { ethers } from "hardhat";
import { accounts } from "../base";

export const setUpTest = async () => {
  const { owner, john, franky, usop } = await accounts();

  const erc1155Mock = await (
    await ethers.getContractFactory("Erc1155Mock")
  ).deploy(owner);
  const erc20Mock = await (
    await ethers.getContractFactory("Erc20Mock")
  ).deploy(owner);
  const erc721Mock = await (
    await ethers.getContractFactory("Erc721Mock")
  ).deploy(owner);
  const execution = await (
    await ethers.getContractFactory("Exucution")
  ).deploy(owner);
    
  return {
    execution,
    erc20Mock,
    erc721Mock,
    erc1155Mock,
    owner,
    john,
    franky,
    usop,
  };
};
