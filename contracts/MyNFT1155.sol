// SPDX-License-Identifier: UNLICENSED

/**
 * @title The implement of Mint NFT using ERC-1155 on Ethereum Network
 * @author M. Benjamin (IntelCore0103)
 * @notice The explanation is like this:
 * 
 *  help                => https://www.seaflux.tech/blogs/erc1155-nft-minting-on-remix
 *  ERC1155.sol         => This module provides the standard abstract methods for ERC1155 smart contracts.
 *  Ownable.sol         => This module provides a modifier named onlyOwner which, when added with a function, restricts it from calling by anyone else except the owner.
 *  ERC1155Burnable.sol => This module is an extension of the ERC1155 contract, which add the ability to destroy an NFT by the owner.
 *  IERC20.sol          => This module provides the standard abstract methods for ERC20 smart contract.
 */

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract MyNFT1155 is ERC1155, Ownable, ERC1155Burnable {
    uint256 public mintPrice = 0.001 ether;                                                                 // The price of the NFT
    string public name = "Seaflux NFT";                                                                     // The name which will be displayed on Opensea
    uint256 public maxSupply = 10000;                                                                         // The total number of NFTs that can be minted.
    uint256 internal totalMinted;                                                                           // The total number of NFTs that are minted.

    constructor() Ownable(msg.sender) ERC1155("https://ipfs.io/ipfs/QmRyFNM4yS2Le6FHMb8KoFq7276NBNPZd5Hc5VmnukUoWT") {
        totalMinted = 0;
        mintPrice = 0.002 ether;
    }

    function mint(uint256 numOfNFTs) external payable {
        require(totalMinted + numOfNFTs < maxSupply,"Minting would exceed max supply");
        require(mintPrice * numOfNFTs <= msg.value,"Not enough MATIC sent");
        require(numOfNFTs <= 10,"Only up to 10 NFTs can be minted");
        _mint(msg.sender, 1, numOfNFTs, "");
        totalMinted += numOfNFTs;
    }

    function getTotalSupply() external view returns (uint256) {
        return maxSupply;
    }

    function getMinted() external view returns (uint256) {
        return totalMinted;
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0);
        uint256 contractBalance = address(this).balance;
        payable(_msgSender()).transfer(contractBalance);
    }
}