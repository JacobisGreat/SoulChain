import { ethers } from "hardhat";

async function main() {
  const timeoutInSeconds = 60 * 60 * 24 * 30; // 30 days

  const SoulChain = await ethers.getContractFactory("SoulChain");
  const soulChain = await SoulChain.deploy(timeoutInSeconds);

  await soulChain.waitForDeployment();

  const address = await soulChain.getAddress();
  console.log(`✅ SoulChain deployed at: ${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exitCode = 1;
}); 