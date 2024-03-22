import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
  Erc1155Mock,
  Erc20Mock,
  Erc721Mock,
  Exucution,
  HeroExchange,
} from "../../typechain-types";
import { setUpTest } from "./setup";
import {
  FeeStruct,
  OrderStruct,
} from "../../typechain-types/contracts/HeroExchange";
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";

describe("Test hero exchange", () => {
  let heroExchange: HeroExchange;
  let execution: Exucution;
  let erc721Mock: Erc721Mock;
  let erc1155Mock: Erc1155Mock;
  let erc20Mock: Erc20Mock;

  let owner: HardhatEthersSigner,
    john: HardhatEthersSigner,
    franky: HardhatEthersSigner,
    usop: HardhatEthersSigner;

  let erc721MockAddress: AddressLike;
  let erc1155MocKAddress: AddressLike;
  let executionAddress: AddressLike;
  let erc20MockAddress: AddressLike;
  let heroExchangeAddress: AddressLike;

  const token1155Id = BigInt(10);
  const supply1155 = BigInt(10);
  const asset1155Amount = BigInt(10);

  const token721Id = BigInt(1);
  const asset721Amount = BigInt(100);
  before(async () => {
    ({
      heroExchange,
      franky,
      john,
      owner,
      usop,
      erc721Mock,
      execution,
      erc1155Mock,
      erc20Mock,
    } = await setUpTest());
    erc721MockAddress = erc721Mock.target.toString() as AddressLike;
    executionAddress = execution.target.toString() as AddressLike;
    erc20MockAddress = erc20Mock.target.toString() as AddressLike;
    erc1155MocKAddress = erc1155Mock.target.toString() as AddressLike;
    heroExchangeAddress = heroExchange.target.toString() as AddressLike;
  });

  it("Set execution", async () => {
    await heroExchange.connect(owner).setExecution(executionAddress);

    const actualExecutionProxy = await heroExchange
      .connect(owner)
      .executionProxy();

    expect(actualExecutionProxy).to.equal(executionAddress);
  });

  it("White list user", async () => {
    await execution.connect(owner).whiteList(heroExchange.target.toString());
    await execution.connect(owner).grantApproval();
    await execution.connect(usop).grantApproval();
  });

  it("Should throw error ownerable", async () => {
    await heroExchange
      .connect(owner)
      .updateWhiteListToken(
        [
          owner.address,
          erc1155MocKAddress,
          erc721MockAddress,
          erc20MockAddress,
        ],
        [john.address]
      );

    expect(
      await heroExchange.connect(owner).whiteTokens(owner.address)
    ).to.be.eq(true);

    expect(
      await heroExchange.connect(owner).whiteTokens(john.address)
    ).to.be.equal(false);
  });

  it("Set fee", async () => {
    const newRate = 10;
    await heroExchange.connect(owner).setFee(newRate);
    expect(await heroExchange.connect(owner).feeRate()).to.eq(newRate);
  });

  it("accept token erc721 , erc1155", async () => {
    await heroExchange
      .connect(owner)
      .updateWhiteListToken([erc721MockAddress], []);

    expect(
      await heroExchange.connect(owner).whiteTokens(erc721MockAddress)
    ).to.be.eq(true);
  });

  it("Should mint success", async () => {
    const tokenId = BigInt(1);
    await erc721Mock.safeMint(owner.address, tokenId);
    expect(await erc721Mock.balanceOf(owner.address)).to.be.eq(tokenId);
  });

  it("Mint erc20 success", async () => {
    await erc20Mock.connect(owner).mint(usop.address, BigInt(2000000));
  });

  it("Should order success erc721", async () => {
    await erc721Mock.connect(owner).setApprovalForAll(executionAddress, true);

    const fee: FeeStruct = {
      bps: 5,
      receiver: owner.address,
    };

    await erc20Mock.connect(usop).approve(executionAddress, 100);

    const newOrder: OrderStruct = {
      assetAmount: 1,
      assetIdentifier: token721Id,
      payAmount: asset721Amount,
      payToken: erc20MockAddress,
      owner: owner.address,
      maker: usop.address,
      assetType: 0,
      fees: [fee],
      orderData: stringToBytes(""),
      orderType: 0,
      assetToken: erc721Mock.target.toString(),
      endTime: new Date().getTime() + 1000000000,
      startTime: new Date().getTime() + 900000000,
    };

    await heroExchange.connect(owner).execute(newOrder);

    expect(await erc20Mock.connect(owner).balanceOf(owner.address)).to.be.eq(
      asset721Amount
    );

    expect(await erc721Mock.connect(usop).balanceOf(usop.address)).to.be.eq(
      token721Id
    );
  });

  it("Mint erc1155 success", async () => {
    await erc1155Mock
      .connect(owner)
      .mint(owner.address, token1155Id, supply1155, stringToBytes("anyone"));

    expect(
      await erc1155Mock.connect(owner).balanceOf(owner.address, token1155Id)
    ).to.be.eq(supply1155);
  });

  it("Should order erc1155", async () => {
    await erc1155Mock.connect(owner).setApprovalForAll(executionAddress, true);

    console.log(await erc20Mock.connect(owner).balanceOf(owner.address));

    await erc20Mock.connect(usop).approve(executionAddress, 100);
    const fee: FeeStruct = {
      bps: 5,
      receiver: owner.address,
    };
    const assetAmount = BigInt(3);
    const newOrder: OrderStruct = {
      assetAmount: assetAmount,
      assetIdentifier: token1155Id,
      payAmount: asset1155Amount * assetAmount,
      payToken: erc20MockAddress,
      owner: owner.address,
      maker: usop.address,
      assetType: 1,
      fees: [fee],
      orderData: stringToBytes(""),
      orderType: 0,
      assetToken: erc1155MocKAddress,
      endTime: new Date().getTime() + 1000000000,
      startTime: new Date().getTime() + 900000000,
    };

    await heroExchange.connect(owner).execute(newOrder);

    expect(
      await erc1155Mock.connect(owner).balanceOf(usop.address, token1155Id)
    ).to.be.eq(assetAmount);

    expect(await erc20Mock.connect(owner).balanceOf(owner)).to.be.eq(
      asset1155Amount * assetAmount + asset721Amount
    );
  });
});
function stringToBytes(input: string) {
  const encoder = new TextEncoder();
  return encoder.encode(input);
}
