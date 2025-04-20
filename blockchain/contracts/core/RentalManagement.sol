// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RentalManagement is ReentrancyGuard, Ownable {
    struct Rental {
        uint256 propertyId;
        address landlord;
        address tenant;
        uint256 rent;
        uint256 deposit;
        uint256 startDate;
        uint256 endDate;
        bool active;
    }

    mapping(uint256 => Rental) public rentals;
    mapping(address => uint256[]) public landlordProperties;
    mapping(address => uint256[]) public tenantRentals;

    event RentalCreated(uint256 indexed propertyId, address indexed landlord, address indexed tenant, uint256 rent);
    event RentalPaymentMade(uint256 indexed propertyId, address indexed tenant, uint256 amount);
    event RentalTerminated(uint256 indexed propertyId, address indexed landlord, address indexed tenant);

    constructor() {}

    function createRental(
        uint256 propertyId,
        address tenant,
        uint256 rent,
        uint256 deposit,
        uint256 duration
    ) external nonReentrant {
        require(tenant != address(0), "Invalid tenant address");
        require(rent > 0, "Rent must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(rentals[propertyId].active == false, "Property already rented");

        Rental storage rental = rentals[propertyId];
        rental.propertyId = propertyId;
        rental.landlord = msg.sender;
        rental.tenant = tenant;
        rental.rent = rent;
        rental.deposit = deposit;
        rental.startDate = block.timestamp;
        rental.endDate = block.timestamp + (duration * 30 days);
        rental.active = true;

        landlordProperties[msg.sender].push(propertyId);
        tenantRentals[tenant].push(propertyId);

        emit RentalCreated(propertyId, msg.sender, tenant, rent);
    }

    function payRent(uint256 propertyId) external payable nonReentrant {
        Rental storage rental = rentals[propertyId];
        require(rental.active, "Rental not active");
        require(msg.sender == rental.tenant, "Only tenant can pay rent");
        require(msg.value >= rental.rent, "Insufficient payment");

        payable(rental.landlord).transfer(msg.value);
        
        emit RentalPaymentMade(propertyId, msg.sender, msg.value);
    }

    function terminateRental(uint256 propertyId) external nonReentrant {
        Rental storage rental = rentals[propertyId];
        require(rental.active, "Rental not active");
        require(msg.sender == rental.landlord, "Only landlord can terminate rental");

        rental.active = false;
        
        // Return deposit to tenant
        payable(rental.tenant).transfer(rental.deposit);
        
        emit RentalTerminated(propertyId, rental.landlord, rental.tenant);
    }

    function getLandlordProperties(address landlord) external view returns (uint256[] memory) {
        return landlordProperties[landlord];
    }

    function getTenantRentals(address tenant) external view returns (uint256[] memory) {
        return tenantRentals[tenant];
    }
} 