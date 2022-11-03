const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { getAddress } = require("ethers/lib/utils");

describe("Refill contract", function () {
  it("Send canto and refill contract should wrap and send to unitroller", async function () {
    const [owner] = await ethers.getSigners();

    // deploy
    const WCanto = await ethers.getContractFactory("WETH");
    const Refill = await ethers.getContractFactory("Refill");

    const wcanto = await WCanto.deploy("wcanto", "WCANTO");
    const refill = await Refill.deploy(wcanto.address);

    // get initial wcanto balance of account
    const unitrollerBalance = await wcanto.balanceOf(getAddress("0x2c3f6919cc25Cd7559dbA05bAbad838D4A603fbd"));
    expect(unitrollerBalance).to.equal(0);

    // send canto to contract
    const transactionHash = await owner.sendTransaction({
        to: refill.address,
        value: ethers.utils.parseEther("300000.0"),
    });

    // check canto balance of contract
    const refillBalance = await refill.getBalance();
    expect(refillBalance).to.equal(ethers.utils.parseEther("300000.0"));

    // check wcanto balance of contract, should be 0
    const refillWCANTOBalance = await wcanto.balanceOf(refill.address);
    expect(refillWCANTOBalance).to.equal(0);

    // call wrap send function
    const wrapSend = await refill.wrapSend();

    // check that no canto remains
    const refillBalance2 = await refill.getBalance();
    expect(refillBalance2).to.equal(ethers.utils.parseEther("0.0"));

    // check wcanto balance of unitroller, should be 300,000
    const unitrollerWCANTOBalance = await wcanto.balanceOf(getAddress("0x2c3f6919cc25Cd7559dbA05bAbad838D4A603fbd"));
    expect(unitrollerWCANTOBalance).to.equal(ethers.utils.parseEther("300000.0"));
  });
});