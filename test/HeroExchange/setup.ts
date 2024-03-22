import { ethers } from "hardhat";
import { accounts } from "../base";

export const setUpTest = async () => {
  const { owner, john, franky, usop } = await accounts();
  const heroExchange = await (
    await ethers.getContractFactory("HeroExchange")
  ).deploy(owner);
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
    owner,
    john,
    franky,
    usop,
    heroExchange,
    erc721Mock,
    execution,
    erc20Mock,
    erc1155Mock,
  };
};
