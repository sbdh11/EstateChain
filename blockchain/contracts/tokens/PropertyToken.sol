// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PropertyToken is ERC721URIStorage, Ownable, ReentrancyGuard {
    struct Property {
        string name;
        string location;
        uint256 value;
        uint256 totalShares;
        uint256 availableShares;
        bool isActive;
        address[] shareholders;
        mapping(address => uint256) shareBalances;
    }

    mapping(uint256 => Property) public properties;
    mapping(string => bool) public propertyExists;
    uint256 private _tokenIdCounter;

    event PropertyCreated(uint256 indexed tokenId, string name, string location, uint256 value);
    event SharesPurchased(uint256 indexed tokenId, address indexed buyer, uint256 shares);
    event SharesSold(uint256 indexed tokenId, address indexed seller, uint256 shares);
    event PropertyUpdated(uint256 indexed tokenId, uint256 newValue);

    constructor() ERC721("EstateChain Property Token", "EPT") {}

    function createProperty(
        string memory name,
        string memory location,
        uint256 value,
        uint256 totalShares,
        string memory tokenURI
    ) external onlyOwner {
        require(!propertyExists[location], "Property at this location already exists");
        require(totalShares > 0, "Total shares must be greater than 0");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        Property storage newProperty = properties[tokenId];
        newProperty.name = name;
        newProperty.location = location;
        newProperty.value = value;
        newProperty.totalShares = totalShares;
        newProperty.availableShares = totalShares;
        newProperty.isActive = true;

        propertyExists[location] = true;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit PropertyCreated(tokenId, name, location, value);
    }

    function purchaseShares(uint256 tokenId, uint256 shares) external payable nonReentrant {
        Property storage property = properties[tokenId];
        require(property.isActive, "Property is not active");
        require(shares <= property.availableShares, "Not enough shares available");
        
        uint256 sharePrice = (property.value * shares) / property.totalShares;
        require(msg.value >= sharePrice, "Insufficient payment");

        property.availableShares -= shares;
        property.shareBalances[msg.sender] += shares;
        
        if (!isShareHolder(tokenId, msg.sender)) {
            property.shareholders.push(msg.sender);
        }

        emit SharesPurchased(tokenId, msg.sender, shares);
    }

    function sellShares(uint256 tokenId, uint256 shares) external nonReentrant {
        Property storage property = properties[tokenId];
        require(property.isActive, "Property is not active");
        require(property.shareBalances[msg.sender] >= shares, "Not enough shares owned");

        uint256 sharePrice = (property.value * shares) / property.totalShares;
        property.shareBalances[msg.sender] -= shares;
        property.availableShares += shares;

        if (property.shareBalances[msg.sender] == 0) {
            removeShareHolder(tokenId, msg.sender);
        }

        payable(msg.sender).transfer(sharePrice);
        emit SharesSold(tokenId, msg.sender, shares);
    }

    function updatePropertyValue(uint256 tokenId, uint256 newValue) external onlyOwner {
        Property storage property = properties[tokenId];
        require(property.isActive, "Property is not active");
        property.value = newValue;
        emit PropertyUpdated(tokenId, newValue);
    }

    function isShareHolder(uint256 tokenId, address account) public view returns (bool) {
        Property storage property = properties[tokenId];
        for (uint i = 0; i < property.shareholders.length; i++) {
            if (property.shareholders[i] == account) {
                return true;
            }
        }
        return false;
    }

    function removeShareHolder(uint256 tokenId, address account) internal {
        Property storage property = properties[tokenId];
        for (uint i = 0; i < property.shareholders.length; i++) {
            if (property.shareholders[i] == account) {
                property.shareholders[i] = property.shareholders[property.shareholders.length - 1];
                property.shareholders.pop();
                break;
            }
        }
    }

    function getShareBalance(uint256 tokenId, address account) external view returns (uint256) {
        return properties[tokenId].shareBalances[account];
    }

    function getShareholders(uint256 tokenId) external view returns (address[] memory) {
        return properties[tokenId].shareholders;
    }
} 