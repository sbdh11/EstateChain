export const PropertyTokenABI = [
  // ERC721 standard functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function tokenByIndex(uint256 index) view returns (uint256)",
  
  // PropertyToken specific functions
  "function createProperty(string name, string location, uint256 value, uint256 totalShares, string tokenURI) external",
  "function purchaseShares(uint256 tokenId, uint256 shares) external payable",
  "function sellShares(uint256 tokenId, uint256 shares) external",
  "function updatePropertyValue(uint256 tokenId, uint256 newValue) external",
  "function isShareHolder(uint256 tokenId, address account) external view returns (bool)",
  "function getShareBalance(uint256 tokenId, address account) external view returns (uint256)",
  "function getShareholders(uint256 tokenId) external view returns (address[])",
  "function properties(uint256 tokenId) external view returns (string name, string location, uint256 value, uint256 totalShares, uint256 availableShares, bool isActive)",
  
  // Events
  "event PropertyCreated(uint256 indexed tokenId, string name, string location, uint256 value)",
  "event SharesPurchased(uint256 indexed tokenId, address indexed buyer, uint256 shares)",
  "event SharesSold(uint256 indexed tokenId, address indexed seller, uint256 shares)",
  "event PropertyUpdated(uint256 indexed tokenId, uint256 newValue)"
];

export const PropertyValuationABI = [
  // PropertyValuation functions
  "function createValuation(uint256 propertyId, uint256 value, string location, uint256 squareFootage, uint256 bedrooms, uint256 bathrooms, uint256 yearBuilt, string propertyType, string[] features) external",
  "function updateMarketData(string location, uint256 averagePrice, uint256 pricePerSquareFoot, uint256 daysOnMarket, uint256 totalListings) external",
  "function verifyValuation(uint256 propertyId, uint256 valuationIndex) external",
  "function addAppraiser(address appraiser) external",
  "function removeAppraiser(address appraiser) external",
  "function getValuationHistory(uint256 propertyId) external view returns (tuple(uint256, uint256, uint256, string, uint256, uint256, uint256, uint256, string, bool, address, string[])[])",
  "function getMarketData(string location) external view returns (tuple(uint256, uint256, uint256, uint256, uint256))",
  "function getLatestValuation(uint256 propertyId) external view returns (tuple(uint256, uint256, uint256, string, uint256, uint256, uint256, uint256, string, bool, address, string[]))",
  "function estimatePropertyValue(string location, uint256 squareFootage, uint256 bedrooms, uint256 bathrooms, uint256 yearBuilt, string propertyType) external view returns (uint256)",
  
  // Events
  "event ValuationCreated(uint256 indexed propertyId, uint256 value, address appraiser)",
  "event MarketDataUpdated(string location, uint256 averagePrice, uint256 timestamp)",
  "event AppraiserAdded(address indexed appraiser)",
  "event AppraiserRemoved(address indexed appraiser)",
  "event ValuationVerified(uint256 indexed propertyId, uint256 valuationIndex)"
];

export const RentalManagementABI = [
  // RentalManagement functions
  "function createRental(uint256 propertyId, address tenant, uint256 rent, uint256 deposit, uint256 duration) external",
  "function payRent(uint256 propertyId) external payable",
  "function terminateRental(uint256 propertyId) external",
  "function getLandlordProperties(address landlord) external view returns (uint256[])",
  "function getTenantRentals(address tenant) external view returns (uint256[])",
  "function rentals(uint256 propertyId) external view returns (uint256, address, address, uint256, uint256, uint256, uint256, bool)",
  
  // Events
  "event RentalCreated(uint256 indexed propertyId, address indexed landlord, address indexed tenant, uint256 rent)",
  "event RentalPaymentMade(uint256 indexed propertyId, address indexed tenant, uint256 amount)",
  "event RentalTerminated(uint256 indexed propertyId, address indexed landlord, address indexed tenant)"
]; 