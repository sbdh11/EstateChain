const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyToken", function () {
  let PropertyToken;
  let propertyToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    PropertyToken = await ethers.getContractFactory("PropertyToken");
    propertyToken = await PropertyToken.deploy();
    await propertyToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await propertyToken.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await propertyToken.name()).to.equal("EstateChain Property Token");
      expect(await propertyToken.symbol()).to.equal("EPT");
    });
  });
}); 