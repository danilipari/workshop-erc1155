import { ethers } from "hardhat";
import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";
import { SimpleERC1155 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SimpleERC1155", function () {
  let contract: SimpleERC1155;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const uri = "ipfs://test/";
  const maxSupply = 1000;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const SimpleERC1155Factory = await ethers.getContractFactory("SimpleERC1155");
    contract = await SimpleERC1155Factory.deploy(uri, maxSupply);
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the right max supply", async function () {
      expect(await contract.maxSupply()).to.equal(maxSupply);
    });

    it("Should start with zero minted", async function () {
      expect(await contract.totalMinted()).to.equal(0n);
    });

    it("Should set the correct TOKEN_ID", async function () {
      expect(await contract.TOKEN_ID()).to.equal(1n);
    });
  });

  describe("Minting", function () {
    it("Should mint tokens to user", async function () {
      await contract.mint(user1.address, 50);
      expect(await contract.balanceOf(user1.address, 1)).to.equal(50n);
      expect(await contract.totalMinted()).to.equal(50n);
    });

    it("Should mint multiple times", async function () {
      await contract.mint(user1.address, 50);
      await contract.mint(user1.address, 30);
      expect(await contract.balanceOf(user1.address, 1)).to.equal(80n);
      expect(await contract.totalMinted()).to.equal(80n);
    });

    it("Should mint to different users", async function () {
      await contract.mint(user1.address, 50);
      await contract.mint(user2.address, 30);
      expect(await contract.balanceOf(user1.address, 1)).to.equal(50n);
      expect(await contract.balanceOf(user2.address, 1)).to.equal(30n);
      expect(await contract.totalMinted()).to.equal(80n);
    });

    it("Should mint up to max supply", async function () {
      await contract.mint(user1.address, maxSupply);
      expect(await contract.totalMinted()).to.equal(maxSupply);
    });

    it("Should fail when exceeding max supply", async function () {
      await contract.mint(user1.address, 500);
      await expect(
        contract.mint(user1.address, 501)
      ).to.be.revertedWith("Exceeds max supply");
    });

    it("Should fail when minting exactly over max supply", async function () {
      await contract.mint(user1.address, maxSupply);
      await expect(
        contract.mint(user1.address, 1)
      ).to.be.revertedWith("Exceeds max supply");
    });

    it("Should fail when non-owner tries to mint", async function () {
      await expect(
        contract.connect(user1).mint(user2.address, 10)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      await contract.mint(user1.address, 100);
    });

    it("Should allow user to transfer their tokens", async function () {
      await contract.connect(user1).safeTransferFrom(
        user1.address,
        user2.address,
        1,
        50,
        "0x"
      );
      expect(await contract.balanceOf(user1.address, 1)).to.equal(50n);
      expect(await contract.balanceOf(user2.address, 1)).to.equal(50n);
    });

    it("Should fail when transferring more than balance", async function () {
      await expect(
        contract.connect(user1).safeTransferFrom(
          user1.address,
          user2.address,
          1,
          101,
          "0x"
        )
      ).to.be.revertedWithCustomError(contract, "ERC1155InsufficientBalance");
    });
  });

  describe("Batch Operations", function () {
    it("Should support batch balance check", async function () {
      await contract.mint(user1.address, 50);
      await contract.mint(user2.address, 30);

      const balances = await contract.balanceOfBatch(
        [user1.address, user2.address],
        [1, 1]
      );
      expect(balances[0]).to.equal(50n);
      expect(balances[1]).to.equal(30n);
    });
  });

  describe("URI", function () {
    it("Should return the correct URI", async function () {
      const tokenUri = await contract.uri(1);
      expect(tokenUri).to.equal(uri);
    });
  });
});
