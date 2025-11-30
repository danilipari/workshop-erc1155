import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    console.error("PRIVATE_KEY not found in .env");
    process.exit(1);
  }

  const wallet = new ethers.Wallet("0x" + privateKey);
  console.log("Your wallet address:", wallet.address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
