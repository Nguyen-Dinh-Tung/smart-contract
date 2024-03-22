import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {
  Erc1155Mock,
  Erc20Mock,
  Erc721Mock,
  Exucution,
} from "../../typechain-types";
import { ethers } from "hardhat";
import { setUpTest } from "./setup";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Test Excution", () => {
  let execution: Exucution;

  let erc20Mock: Erc20Mock;

  let erc721Mock: Erc721Mock;

  let erc1155Mock: Erc1155Mock;

  let owner: HardhatEthersSigner,
    john: HardhatEthersSigner,
    franky: HardhatEthersSigner,
    usop: HardhatEthersSigner;

  before(async () => {
    ({
      execution,
      erc20Mock,
      erc721Mock,
      erc1155Mock,
      owner,
      john,
      franky,
      usop,
    } = await setUpTest());
  });
  // it("Should passing case whiteListed ", async () => {
  //   const { execution, owner, addr1, addr2 } = await loadFixture(
  //     deployTokenFixture
  //   );

  // await execution.unWhiteList(addr1.address);
  // expect(await execution.getWhiteListValue(addr1.address)).to.be.eq(false);

  // await execution.whiteList(addr1.address);
  // expect(await execution.getWhiteListValue(addr1.address)).to.be.eq(true);
  // });

  // it("Should passing case whiteListed", async () => {
  //   const { execution, owner, addr1, addr2 } = await loadFixture(
  //     deployTokenFixture
  //   );
  // });

  it("Transfer erc721", async () => {
    const tokenId = BigInt(1);
    await erc721Mock.safeMint(owner.address, tokenId);
    await execution.connect(owner).whiteList(owner.address);
    await execution.connect(owner).grantApproval();

    await erc721Mock
      .connect(owner)
      .setApprovalForAll(execution.target.toString(), true);
    await erc721Mock.connect(john).setApprovalForAll(john.address, true);
    await erc721Mock.connect(owner).approve(owner.address, tokenId);

    await execution
      .connect(owner)
      .transferERC721(
        erc721Mock.target.toString(),
        owner.address,
        john.address,
        tokenId
      );

    expect(await erc721Mock.balanceOf(john.address)).to.be.eq(tokenId);
  });

  it("Should throw error Contract is not approve to make transfers", async () => {
    const tokenId = BigInt(2);
    await erc721Mock.safeMint(owner.address, tokenId);
    await execution.connect(owner).grantApproval();

    await erc721Mock
      .connect(owner)
      .setApprovalForAll(execution.target.toString(), true);
    await erc721Mock.connect(john).setApprovalForAll(john.address, true);
    await erc721Mock.connect(owner).approve(owner.address, tokenId);

    expect(
      await execution
        .connect(owner)
        .transferERC721(
          erc721Mock.target.toString(),
          owner.address,
          john.address,
          tokenId
        )
    ).to.revertedWith("Contract is not approve to make transfers");
  });

  it("Transfer erc1155", async () => {
    const tokenId = BigInt(3);
    const amount = BigInt(1);
    const data = new TextEncoder().encode("123");

    await erc1155Mock.connect(owner).mint(owner.address, tokenId, amount, data);

    await erc1155Mock
      .connect(owner)
      .setApprovalForAll(execution.target.toString(), true);

    await execution
      .connect(owner)
      .transferERC1155(
        erc1155Mock.target.toString(),
        owner.address,
        franky.address,
        tokenId,
        amount
      );

    expect(await erc1155Mock.balanceOf(franky.address, tokenId)).to.be.eq(1);
  });

  it("Transfer erc20", async () => {
    const weth = BigInt(10 ^ 18);
    await erc20Mock.connect(owner).mint(owner.address, weth);
    await erc20Mock
      .connect(owner)
      .allowance(owner.address, execution.target.toString());
    await erc20Mock.connect(owner).approve(execution.target.toString(), weth);

    await execution
      .connect(owner)
      .transferERC20(
        erc20Mock.target.toString(),
        owner.address,
        usop.address,
        weth
      );

    expect(await erc20Mock.balanceOf(usop)).to.be.changeEtherBalance(
      usop,
      weth
    );
  });
});
