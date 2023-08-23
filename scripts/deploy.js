// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const NAME = "ETH Daddy"
  const SYMBOL = "ETHD"

  //Deploying the contract
  const ETHDaddy = await ethers.getContractFactory("ETHDaddy");
  const ethDaddy = await ETHDaddy.deploy(NAME, SYMBOL);
  await ethDaddy.deployed();

  console.log(`Contract Address: ${ethDaddy.address}`)

  //Listing Domains
  const domainsNames = ["jack.eth", "raahim.eth", "henry.eth", "cobalt.eth", "oxy.eth", "uranium.eth"]
  const prices = [tokens(10), tokens(25), tokens(15), tokens(2.5), tokens(3), tokens(1)]

  //Listing All Domains
  for(let i =0; i < domainsNames.length; i++){
    let transaction = await ethDaddy.connect(deployer).list(domainsNames[i], prices[i])
    await transaction.wait();

    console.log(`Listed domains `)

  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
