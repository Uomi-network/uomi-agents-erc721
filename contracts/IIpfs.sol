// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IIPFSStorage {
    // ============ Functions ============
    /// @notice Pins an agent's CID to IPFS
    /// @param _cid The IPFS CID to pin
    /// @param _nftId The ID of the NFT that the caller must own
    /// @dev Caller must be the owner of the NFT with ID _nftId
    function pinAgent(string memory _cid, uint256 _nftId) external;

    /// @notice Pins a file to IPFS for a specified duration
    /// @param _cid The IPFS CID to pin
    /// @param _durationInBlocks The duration in blocks to pin the file
    /// @dev Minimum duration is 28800 blocks (24h)
    /// @dev Requires payment of pricePerBlock * _durationInBlocks
    function pinFile(string memory _cid, uint256 _durationInBlocks) external payable;

}