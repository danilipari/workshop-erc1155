import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const uri =
    "ipfs://bafybeihkoviema7g3gxyt6la7vd5ho32ictqbilu3wnlo3rs7ewhnp7lly/"; // placeholder URI
  const maxSupply = 1000;
  const SimpleERC1155 = await ethers.getContractFactory("SimpleERC1155");
  const contract = await SimpleERC1155.deploy(uri, maxSupply);
  await contract.waitForDeployment();
  console.log("Deployed to:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
