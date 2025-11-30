import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS_SEPOLIA = "0x8e43E1a60190B04966720e03BCB3e4d6bda405e1";
const CONTRACT_ADDRESS_LOCAL = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const [signer] = await ethers.getSigners();

  // Read network from command line args or use default
  const network = process.env.HARDHAT_NETWORK || "hardhat";
  const contractAddress =
    network === "sepolia" ? CONTRACT_ADDRESS_SEPOLIA : CONTRACT_ADDRESS_LOCAL;

  console.log(`Minting on network: ${network}`);
  console.log(`Contract address: ${contractAddress}`);

  const contract = await ethers.getContractAt(
    "SimpleERC1155",
    contractAddress,
    signer
  );

  const amount = 10;
  const tx = await contract.mint(signer.address, amount);
  await tx.wait();
  console.log(`Minted ${amount} tokens to ${signer.address}`);
  console.log(`Transaction hash: ${tx.hash}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
