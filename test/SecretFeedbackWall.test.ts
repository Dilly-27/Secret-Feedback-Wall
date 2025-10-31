import { expect } from "chai";
import { ethers } from "hardhat";

describe("SecretFeedbackWall", function () {
  it("Should deploy with correct admin address", async function () {
    const [owner] = await ethers.getSigners();
    
    const SecretFeedbackWall = await ethers.getContractFactory("SecretFeedbackWall");
    const feedbackWall = await SecretFeedbackWall.deploy(owner.address);
    
    expect(await feedbackWall.ADMIN()).to.equal(owner.address);
  });

  it("Should allow submitting encrypted messages", async function () {
    const [owner] = await ethers.getSigners();
    
    const SecretFeedbackWall = await ethers.getContractFactory("SecretFeedbackWall");
    const feedbackWall = await SecretFeedbackWall.deploy(owner.address);
    
    const encryptedMessage = [
      ethers.hexlify(ethers.randomBytes(32)),
      ethers.hexlify(ethers.randomBytes(32)),
    ];
    
    await feedbackWall.submitFeedback(encryptedMessage);
    
    expect(await feedbackWall.getMessageCount()).to.equal(1);
  });

  it("Should retrieve all messages", async function () {
    const [owner] = await ethers.getSigners();
    
    const SecretFeedbackWall = await ethers.getContractFactory("SecretFeedbackWall");
    const feedbackWall = await SecretFeedbackWall.deploy(owner.address);
    
    const message1 = [ethers.hexlify(ethers.randomBytes(32))];
    const message2 = [ethers.hexlify(ethers.randomBytes(32))];
    
    await feedbackWall.submitFeedback(message1);
    await feedbackWall.submitFeedback(message2);
    
    const messages = await feedbackWall.getMessages();
    expect(messages.length).to.equal(2);
  });

  it("Should identify admin correctly", async function () {
    const [owner, other] = await ethers.getSigners();
    
    const SecretFeedbackWall = await ethers.getContractFactory("SecretFeedbackWall");
    const feedbackWall = await SecretFeedbackWall.deploy(owner.address);
    
    expect(await feedbackWall.isAdmin(owner.address)).to.be.true;
    expect(await feedbackWall.isAdmin(other.address)).to.be.false;
  });
});
