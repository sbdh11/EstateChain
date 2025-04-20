// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PropertyValuation is Ownable, ReentrancyGuard {
    struct Valuation {
        uint256 propertyId;
        uint256 timestamp;
        uint256 value;
        string location;
        uint256 squareFootage;
        uint256 bedrooms;
        uint256 bathrooms;
        uint256 yearBuilt;
        string propertyType;
        bool isVerified;
        address appraiser;
        string[] features;
    }

    struct MarketData {
        uint256 averagePrice;
        uint256 pricePerSquareFoot;
        uint256 daysOnMarket;
        uint256 totalListings;
        uint256 timestamp;
    }

    mapping(uint256 => Valuation[]) public propertyValuations;
    mapping(string => MarketData) public marketDataByLocation;
    mapping(address => bool) public approvedAppraisers;
    mapping(uint256 => uint256) public latestValuationIndex;

    event ValuationCreated(uint256 indexed propertyId, uint256 value, address appraiser);
    event MarketDataUpdated(string location, uint256 averagePrice, uint256 timestamp);
    event AppraiserAdded(address indexed appraiser);
    event AppraiserRemoved(address indexed appraiser);
    event ValuationVerified(uint256 indexed propertyId, uint256 valuationIndex);

    modifier onlyAppraiser() {
        require(approvedAppraisers[msg.sender], "Caller is not an approved appraiser");
        _;
    }

    constructor() {
        approvedAppraisers[msg.sender] = true;
    }

    function createValuation(
        uint256 propertyId,
        uint256 value,
        string memory location,
        uint256 squareFootage,
        uint256 bedrooms,
        uint256 bathrooms,
        uint256 yearBuilt,
        string memory propertyType,
        string[] memory features
    ) external onlyAppraiser {
        Valuation memory newValuation = Valuation({
            propertyId: propertyId,
            timestamp: block.timestamp,
            value: value,
            location: location,
            squareFootage: squareFootage,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            yearBuilt: yearBuilt,
            propertyType: propertyType,
            isVerified: false,
            appraiser: msg.sender,
            features: features
        });

        propertyValuations[propertyId].push(newValuation);
        latestValuationIndex[propertyId] = propertyValuations[propertyId].length - 1;

        emit ValuationCreated(propertyId, value, msg.sender);
    }

    function updateMarketData(
        string memory location,
        uint256 averagePrice,
        uint256 pricePerSquareFoot,
        uint256 daysOnMarket,
        uint256 totalListings
    ) external onlyOwner {
        marketDataByLocation[location] = MarketData({
            averagePrice: averagePrice,
            pricePerSquareFoot: pricePerSquareFoot,
            daysOnMarket: daysOnMarket,
            totalListings: totalListings,
            timestamp: block.timestamp
        });

        emit MarketDataUpdated(location, averagePrice, block.timestamp);
    }

    function verifyValuation(uint256 propertyId, uint256 valuationIndex) external onlyOwner {
        require(valuationIndex < propertyValuations[propertyId].length, "Invalid valuation index");
        propertyValuations[propertyId][valuationIndex].isVerified = true;
        emit ValuationVerified(propertyId, valuationIndex);
    }

    function addAppraiser(address appraiser) external onlyOwner {
        require(appraiser != address(0), "Invalid appraiser address");
        require(!approvedAppraisers[appraiser], "Appraiser already approved");
        approvedAppraisers[appraiser] = true;
        emit AppraiserAdded(appraiser);
    }

    function removeAppraiser(address appraiser) external onlyOwner {
        require(approvedAppraisers[appraiser], "Appraiser not approved");
        approvedAppraisers[appraiser] = false;
        emit AppraiserRemoved(appraiser);
    }

    function getValuationHistory(uint256 propertyId) external view returns (Valuation[] memory) {
        return propertyValuations[propertyId];
    }

    function getMarketData(string memory location) external view returns (MarketData memory) {
        return marketDataByLocation[location];
    }

    function getLatestValuation(uint256 propertyId) external view returns (Valuation memory) {
        require(propertyValuations[propertyId].length > 0, "No valuations found");
        return propertyValuations[propertyId][latestValuationIndex[propertyId]];
    }

    function estimatePropertyValue(
        string memory location,
        uint256 squareFootage,
        uint256 bedrooms,
        uint256 bathrooms,
        uint256 yearBuilt,
        string memory propertyType
    ) external view returns (uint256) {
        MarketData memory marketData = marketDataByLocation[location];
        require(marketData.timestamp > 0, "No market data available for location");

        // Basic valuation calculation based on market data and property features
        uint256 baseValue = squareFootage * marketData.pricePerSquareFoot;
        
        // Adjust for number of bedrooms and bathrooms
        uint256 roomValue = (bedrooms + bathrooms) * (marketData.averagePrice / 20);
        
        // Age adjustment (newer properties are worth more)
        uint256 age = block.timestamp / 365 days - yearBuilt;
        uint256 ageAdjustment = age * (marketData.averagePrice / 100);
        
        // Property type adjustment (simplified)
        uint256 typeAdjustment = keccak256(bytes(propertyType)) == keccak256(bytes("luxury")) ? 
            marketData.averagePrice / 5 : 0;

        return baseValue + roomValue + typeAdjustment - ageAdjustment;
    }
} 