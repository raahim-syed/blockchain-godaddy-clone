const { expect } = require("chai")
const { beforeEach } = require("mocha")

//Converts numbers to smart contract readable code: Converts to wei
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("ETHDaddy", () => {
  //Globals
  let ethDaddy, deployer, owner1; 

  const NAME = "ETH DADDY"
  const SYMBOL = "ETHD"

  //Code that runs before applying each test =================================
  beforeEach(async () => {
    //Getting owner/deployer address
    [deployer, owner1] = await ethers.getSigners();  

    // console.log(deployer, owner1)

    //Get Smart Contract
    const ETHDaddy = await ethers.getContractFactory("ETHDaddy")

    //Deploying to blockchain
    ethDaddy = await ETHDaddy.deploy("ETH DADDY", "ETHD")

    //Listing A Domain
    const transaction = await ethDaddy.connect(deployer).list("jack.eth", tokens(10))
    await transaction.wait()
  })

  //Basic Deployment Test ===================================================
  describe("Deployment", () => {
    it("has a name",async () => {
      //Running the test: (Getting state variable)
      let result = await ethDaddy.name()
      expect(result).to.equals(NAME)
    })
  
    it("has a symbol", async () => {
          //Running the test: (Getting state variable)
          let result = await ethDaddy.symbol()
          expect(result).to.equals(SYMBOL)
    })
    it("Returns max supply", async () => {
      const maxSupply = await ethDaddy.maxSupply();
      // console.log(maxSupply)
      expect(maxSupply).to.equals(1)
    })
    // it("Returns total supply", async () => {
    //   const total = await ethDaddy.totalSupply();
    //   console.log(totalSupply)
    //   expect(totalSupply).to.equals(0)
    // })
  })

  //Tests on domain ==========================================================
  describe("Domain", () => {
    it("Searches for specific domain", async () => {
      //Checkkng domain names from mapping
      domain = await ethDaddy.getDomains(1)
      // console.log(domain)
      expect(domain.name).to.equals("jack.eth")
    })
  })

  //Minting Domains ==================================================================
  describe("Minting Domain", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether")

    beforeEach(async () => {
      //Switching user and making a transaction
      const transaction = await ethDaddy.connect(owner1).mint(ID, { value: AMOUNT});
      await transaction.wait();
    })

    it("Minting a NFT", async() => {
      //ownerOF function is inherited from ERC721 
      const owner = await ethDaddy.ownerOf(ID);
      expect(owner).to.equals(owner1.address);
    })

    it("Updates Contract Balance", async () => {
      const balance = await ethDaddy.getBalance();
      expect(balance).to.equals(AMOUNT);
    })

    it("Updates Domain Status", async () => {
      const domain = await ethDaddy.getDomains(1);
      expect(domain.isOwned).to.equals(true);
    })

    // it("Returns total supply", async () => {
    //   const total = await ethDaddy.totalSupply();
    //   console.log(totalSupply)
    //   expect(totalSupply).to.equals(1)
    // })
  })


  describe("Withdrawing Funds" , () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await ethDaddy.connect(owner1).mint(ID, {value: AMOUNT});
      await transaction.wait();

      transaction = await ethDaddy.connect(deployer).withdraw();
      await transaction.wait();
    })

    it("Updates Owner Balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    })

    it("Updates  contract balance", async () => {
      const contractBalance = await ethDaddy.getBalance();
      expect(contractBalance).to.equals(0)
    })
  })
})
