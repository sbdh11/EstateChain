// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title Escrow
 * @dev Contract for handling real estate transactions with escrow functionality
 */
contract Escrow is ReentrancyGuard, Ownable {
    // State variables
    address public immutable nftAddress;
    address payable public immutable seller;
    address public immutable inspector;
    address public immutable lender;

    // Mappings
    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;
    mapping(uint256 => bool) public isFinalized;
    mapping(uint256 => PropertyDetails) public propertyDetails;

    // Structs
    struct PropertyDetails {
        string name;
        string location;
        uint256 squareFootage;
        uint256 bedrooms;
        uint256 bathrooms;
        uint256 yearBuilt;
        bool isActive;
    }

    // Events
    event PropertyListed(uint256 indexed nftID, address indexed seller, uint256 price);
    event EarnestDeposited(uint256 indexed nftID, address indexed buyer, uint256 amount);
    event InspectionUpdated(uint256 indexed nftID, bool passed);
    event SaleApproved(uint256 indexed nftID, address indexed approver);
    event SaleFinalized(uint256 indexed nftID, address indexed buyer, address indexed seller, uint256 price);
    event SaleCancelled(uint256 indexed nftID, address indexed refundedTo, uint256 amount);
    event PropertyDetailsUpdated(uint256 indexed nftID, string name, string location);

    // Modifiers
    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can call this method");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this method");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }

    modifier propertyExists(uint256 _nftID) {
        require(IERC721(nftAddress).ownerOf(_nftID) != address(0), "Property does not exist");
        _;
    }

    modifier notFinalized(uint256 _nftID) {
        require(!isFinalized[_nftID], "Property sale already finalized");
        _;
    }

    /**
     * @dev Constructor to set up the escrow contract
     */
    constructor(
        address _nftAddress,
        address payable _seller,
        address _inspector,
        address _lender
    ) {
        require(_nftAddress != address(0), "Invalid NFT address");
        require(_seller != address(0), "Invalid seller address");
        require(_inspector != address(0), "Invalid inspector address");
        require(_lender != address(0), "Invalid lender address");

        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    /**
     * @dev List a property for sale
     */
    function list(
        uint256 _nftID,
        address _buyer,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        string memory _name,
        string memory _location,
        uint256 _squareFootage,
        uint256 _bedrooms,
        uint256 _bathrooms,
        uint256 _yearBuilt
    ) public payable onlySeller propertyExists(_nftID) notFinalized(_nftID) {
        require(_purchasePrice > 0, "Price must be greater than 0");
        require(_escrowAmount > 0, "Escrow amount must be greater than 0");
        require(_escrowAmount <= _purchasePrice, "Escrow amount cannot exceed price");
        require(!isListed[_nftID], "Property already listed");

        // Transfer NFT from seller to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;

        propertyDetails[_nftID] = PropertyDetails({
            name: _name,
            location: _location,
            squareFootage: _squareFootage,
            bedrooms: _bedrooms,
            bathrooms: _bathrooms,
            yearBuilt: _yearBuilt,
            isActive: true
        });

        emit PropertyListed(_nftID, msg.sender, _purchasePrice);
        emit PropertyDetailsUpdated(_nftID, _name, _location);
    }

    /**
     * @dev Deposit earnest money for a property
     */
    function depositEarnest(uint256 _nftID) public payable 
        propertyExists(_nftID) 
        notFinalized(_nftID) 
        onlyBuyer(_nftID) 
    {
        require(isListed[_nftID], "Property not listed");
        require(!approval[_nftID][msg.sender], "Buyer already approved");
        require(msg.value >= escrowAmount[_nftID], "Insufficient earnest amount");

        emit EarnestDeposited(_nftID, msg.sender, msg.value);
    }

    /**
     * @dev Update the inspection status of a property
     */
    function updateInspectionStatus(uint256 _nftID, bool _passed) 
        public 
        onlyInspector 
        propertyExists(_nftID) 
        notFinalized(_nftID) 
    {
        require(isListed[_nftID], "Property not listed");
        inspectionPassed[_nftID] = _passed;
        emit InspectionUpdated(_nftID, _passed);
    }

    /**
     * @dev Approve the sale of a property
     */
    function approveSale(uint256 _nftID) 
        public 
        propertyExists(_nftID) 
        notFinalized(_nftID) 
    {
        require(isListed[_nftID], "Property not listed");
        require(
            msg.sender == buyer[_nftID] ||
            msg.sender == seller ||
            msg.sender == lender,
            "Not authorized to approve sale"
        );
        require(!approval[_nftID][msg.sender], "Already approved by this address");

        approval[_nftID][msg.sender] = true;
        emit SaleApproved(_nftID, msg.sender);
    }

    /**
     * @dev Finalize the sale of a property
     */
    function finalizeSale(uint256 _nftID) 
        public 
        nonReentrant 
        propertyExists(_nftID) 
        notFinalized(_nftID) 
    {
        require(isListed[_nftID], "Property not listed");
        require(inspectionPassed[_nftID], "Inspection not passed");
        require(approval[_nftID][buyer[_nftID]], "Buyer has not approved");
        require(approval[_nftID][seller], "Seller has not approved");
        require(approval[_nftID][lender], "Lender has not approved");
        require(address(this).balance >= purchasePrice[_nftID], "Insufficient funds for sale");

        isListed[_nftID] = false;
        isFinalized[_nftID] = true;

        // Transfer funds to seller
        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success, "Failed to send funds to seller");

        // Transfer NFT to buyer
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);

        emit SaleFinalized(_nftID, buyer[_nftID], seller, purchasePrice[_nftID]);
    }

    /**
     * @dev Cancel the sale of a property
     */
    function cancelSale(uint256 _nftID) 
        public 
        nonReentrant 
        propertyExists(_nftID) 
        notFinalized(_nftID) 
    {
        require(isListed[_nftID], "Property not listed");
        require(
            msg.sender == buyer[_nftID] || 
            msg.sender == seller || 
            msg.sender == inspector,
            "Not authorized to cancel sale"
        );

        isListed[_nftID] = false;
        address payable refundAddress = payable(inspectionPassed[_nftID] ? seller : buyer[_nftID]);
        uint256 balance = address(this).balance;

        // Return NFT to seller
        IERC721(nftAddress).transferFrom(address(this), seller, _nftID);

        // Refund earnest money
        if (balance > 0) {
            (bool success, ) = refundAddress.call{value: balance}("");
            require(success, "Failed to refund");
            emit SaleCancelled(_nftID, refundAddress, balance);
        }
    }

    /**
     * @dev Get property details
     */
    function getPropertyDetails(uint256 _nftID) 
        public 
        view 
        propertyExists(_nftID) 
        returns (PropertyDetails memory) 
    {
        return propertyDetails[_nftID];
    }

    /**
     * @dev Check if all parties have approved the sale
     */
    function isFullyApproved(uint256 _nftID) public view returns (bool) {
        return approval[_nftID][buyer[_nftID]] &&
               approval[_nftID][seller] &&
               approval[_nftID][lender];
    }

    /**
     * @dev Get the contract balance
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {}
}
