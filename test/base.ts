import { ethers } from "hardhat";

export const accounts = async () => {
  const [owner, john, franky, usop] = await ethers.getSigners();
  return { owner, john, franky, usop };
};
