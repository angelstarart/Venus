// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftContract is ERC721URIStorage, Ownable {
    // Counter for token IDs
    uint256 private _nextTokenId;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Mapping for royalties info
    mapping(uint256 => uint256) private _royaltyPercentages;

    constructor(string memory name, string memory symbol, string memory baseTokenURI) 
    ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }
    
    function mintNFT(address recipient, string memory tokenURI, uint256 royaltyPercentage) 
        public
        returns (uint256) 
    {
        require(royaltyPercentage <= 10, "Royalty percentage cannot exceed 10%");
        
        uint256 newItemId = _nextTokenId++;
        
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _royaltyPercentages[newItemId] = royaltyPercentage;
        
        return newItemId;
    }
    
    function getRoyaltyPercentage(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Royalty query for nonexistent token");
        return _royaltyPercentages[tokenId];
    }
    
    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
