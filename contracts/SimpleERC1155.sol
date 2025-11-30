// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleERC1155
 * @dev Minimal ERC‑1155 contract for a workshop exercise.
 *      Only one token type (ID 1) can be minted by the owner.
 */
contract SimpleERC1155 is ERC1155, Ownable {
    uint256 public constant TOKEN_ID = 1;
    uint256 public totalMinted;
    uint256 public immutable maxSupply;

    constructor(string memory uri_, uint256 maxSupply_) ERC1155(uri_) Ownable(msg.sender) {
        maxSupply = maxSupply_;
    }

    /**
     * @dev Mint a specific amount of the single token.
     * Only the contract owner can call this function.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalMinted + amount <= maxSupply, "Exceeds max supply");
        _mint(to, TOKEN_ID, amount, "");
        totalMinted += amount;
    }
}
