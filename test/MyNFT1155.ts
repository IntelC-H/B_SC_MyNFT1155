/**
 * @Contract address: https://sepolia.etherscan.io/address/0xd82d450C9fA9b3684B0F226FB3891B88B6b3B805#code
 */

import hre from 'hardhat'
import { ethers, Signer } from 'ethers'
import { expect } from 'chai'
import { MyNFT1155 } from '../typechain/contracts'

describe('MyNFT1155', function () {
  let owner: Signer
  let addr1: Signer
  let addr2: Signer
  let MyNFTContract: MyNFT1155

  before(async function () {
    [owner, addr1, addr2] =  await hre.ethers.getSigners()
    const NFTContract = await hre.ethers.getContractFactory('MyNFT1155', owner)
    MyNFTContract = await NFTContract.deploy()
    await MyNFTContract.waitForDeployment()
  })

  it("[ ] Should have correct name and mint price:", async function () {
    expect(await MyNFTContract.name()).to.equal("Seaflux NFT")
    expect(await MyNFTContract.mintPrice()).to.equal(ethers.parseEther("0.002"))
  })

  it("[ ] Should not mint more than max supply", async function () {
    await expect(MyNFTContract.connect(addr1).mint(10001, { value: ethers.parseEther("20") }))
      .to.be.revertedWith("Minting would exceed max supply")
  })

  it("[ ] Should not mint more than 10 NFTs at a time", async function () {
    await expect(MyNFTContract.connect(addr1).mint(11, { value: ethers.parseEther("0.022") }))
      .to.be.revertedWith("Only up to 10 NFTs can be minted")
  })

  it("[ ] Should mint NFTs correctly", async function () {
    await MyNFTContract.connect(addr1).mint(5, { value: ethers.parseEther("0.01") })
    expect(await MyNFTContract.getMinted()).to.equal(0)
  })

  it("[ ] Should withdraw funds correctly", async function () {
    await MyNFTContract.connect(addr1).mint(1, { value: ethers.parseEther("0.01") })
    console.log(await MyNFTContract.getMinted())
    const initialBalance = await owner.provider?.getBalance(owner)
    console.log('initialBalance: ', initialBalance)
    await MyNFTContract.connect(owner).withdraw()
    const finalBalance = await owner.provider?.getBalance(owner)
    console.log('finalBalance: ', finalBalance)
    expect(finalBalance).to.be.gt(initialBalance)
  })
})