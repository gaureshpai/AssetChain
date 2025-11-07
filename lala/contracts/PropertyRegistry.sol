// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Fractionalizer.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract PropertyRegistry is ERC721, Ownable {
    using Strings for uint256;
    uint256 private _propertyCount;
    uint256 private _requestCount;

    struct Property {
        uint256 id;
        string name;
        string partnershipAgreementUrl;
        string maintenanceAgreementUrl;
        string rentAgreementUrl;
        string imageUrl;
        bool isFractionalized;
    }

    struct Owner {
        address ownerAddress;
        uint256 percentage; // percentage in basis points (1% = 100, 100% = 10000)
    }

    struct PropertyRequest {
        uint256 id;
        string name;
        string partnershipAgreementUrl;
        string maintenanceAgreementUrl;
        string rentAgreementUrl;
        string imageUrl;
        address requester;
        Owner[] owners;
        uint8 status; // 0 = Pending, 1 = Approved, 2 = Rejected
        uint256 propertyId; // Set when approved
    }

    mapping(uint256 => Property) private properties;
    mapping(uint256 => PropertyRequest) private requests;
    mapping(uint256 => Owner[]) private propertyOwners;

    Fractionalizer public fractionalizer;

    event PropertyRegistered(uint256 indexed propertyId, string name, address indexed owner);
    event PropertyFractionalized(uint256 indexed propertyId, address fractionalContract);
    event PropertyRequestCreated(uint256 indexed requestId, string name, address indexed requester);
    event PropertyRequestApproved(uint256 indexed requestId, uint256 indexed propertyId);
    event PropertyRequestRejected(uint256 indexed requestId);

    constructor() ERC721("RealEstateNFT", "RENT") Ownable(msg.sender) {
    }

    function setFractionalizerAddress(address _fractionalizerAddress) external onlyOwner {
        require(address(fractionalizer) == address(0), "Fractionalizer address already set");
        fractionalizer = Fractionalizer(_fractionalizerAddress);
    }

    // Create a property request (anyone can submit)
    function createPropertyRequest(
        string memory _name,
        string memory _partnershipAgreementUrl,
        string memory _maintenanceAgreementUrl,
        string memory _rentAgreementUrl,
        string memory _imageUrl,
        address[] memory _ownerAddresses,
        uint256[] memory _percentages
    ) external {
        require(bytes(_name).length > 0, "Name required");
        require(_ownerAddresses.length > 0, "At least one owner required");
        require(_ownerAddresses.length == _percentages.length, "Owners and percentages length mismatch");
        
        // Validate total percentage equals 10000 (100%)
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < _percentages.length; i++) {
            require(_ownerAddresses[i] != address(0), "Invalid owner address");
            require(_percentages[i] > 0, "Percentage must be greater than 0");
            totalPercentage += _percentages[i];
        }
        require(totalPercentage == 10000, "Total percentage must equal 100%");

        _requestCount++;
        uint256 newRequestId = _requestCount;

        PropertyRequest storage newRequest = requests[newRequestId];
        newRequest.id = newRequestId;
        newRequest.name = _name;
        newRequest.partnershipAgreementUrl = _partnershipAgreementUrl;
        newRequest.maintenanceAgreementUrl = _maintenanceAgreementUrl;
        newRequest.rentAgreementUrl = _rentAgreementUrl;
        newRequest.imageUrl = _imageUrl;
        newRequest.requester = msg.sender;
        newRequest.status = 0; // Pending
        newRequest.propertyId = 0;

        // Add owners
        for (uint256 i = 0; i < _ownerAddresses.length; i++) {
            newRequest.owners.push(Owner({
                ownerAddress: _ownerAddresses[i],
                percentage: _percentages[i]
            }));
        }

        emit PropertyRequestCreated(newRequestId, _name, msg.sender);
    }

    // Get a specific request
    function getRequest(uint256 _requestId) external view returns (
        uint256 id,
        string memory name,
        string memory partnershipAgreementUrl,
        string memory maintenanceAgreementUrl,
        string memory rentAgreementUrl,
        string memory imageUrl,
        address requester,
        uint8 status,
        uint256 propertyId
    ) {
        require(_requestId > 0 && _requestId <= _requestCount, "Invalid request ID");
        PropertyRequest storage req = requests[_requestId];
        return (
            req.id,
            req.name,
            req.partnershipAgreementUrl,
            req.maintenanceAgreementUrl,
            req.rentAgreementUrl,
            req.imageUrl,
            req.requester,
            req.status,
            req.propertyId
        );
    }

    // Get request owners
    function getRequestOwners(uint256 _requestId) external view returns (
        address[] memory ownerAddresses,
        uint256[] memory percentages
    ) {
        require(_requestId > 0 && _requestId <= _requestCount, "Invalid request ID");
        PropertyRequest storage req = requests[_requestId];
        uint256 ownerCount = req.owners.length;
        
        ownerAddresses = new address[](ownerCount);
        percentages = new uint256[](ownerCount);
        
        for (uint256 i = 0; i < ownerCount; i++) {
            ownerAddresses[i] = req.owners[i].ownerAddress;
            percentages[i] = req.owners[i].percentage;
        }
        
        return (ownerAddresses, percentages);
    }

    // Get total request count
    function requestCount() external view returns (uint256) {
        return _requestCount;
    }

    // Approve request and create property with fractional ownership
    function approveRequest(uint256 _requestId) external {
        require(_requestId > 0 && _requestId <= _requestCount, "Invalid request ID");
        PropertyRequest storage req = requests[_requestId];
        require(req.status == 0, "Request already processed");
        
        // Create property
        _propertyCount++;
        uint256 newPropertyId = _propertyCount;
        
        // Mint NFT to the Fractionalizer contract
        _safeMint(address(fractionalizer), newPropertyId);
        
        properties[newPropertyId] = Property({
            id: newPropertyId,
            name: req.name,
            partnershipAgreementUrl: req.partnershipAgreementUrl,
            maintenanceAgreementUrl: req.maintenanceAgreementUrl,
            rentAgreementUrl: req.rentAgreementUrl,
            imageUrl: req.imageUrl,
            isFractionalized: true // Mark as fractionalized immediately
        });
        
        // Store owners info
        for (uint256 i = 0; i < req.owners.length; i++) {
            propertyOwners[newPropertyId].push(req.owners[i]);
        }
        
        // Update request
        req.status = 1; // Approved
        req.propertyId = newPropertyId;
        
        // Fractionalize the NFT
        string memory tokenSymbol = string(abi.encodePacked("F", Strings.toString(newPropertyId)));
        fractionalizer.fractionalizeNFT(
            newPropertyId,
            string(abi.encodePacked("Fractional ", req.name)),
            tokenSymbol,
            10000 // 100% in basis points
        );
        
        emit PropertyRequestApproved(_requestId, newPropertyId);
        emit PropertyRegistered(newPropertyId, req.name, address(this)); // Owner is this contract temporarily
    }

    // Reject request
    function rejectRequest(uint256 _requestId) external onlyOwner {
        require(_requestId > 0 && _requestId <= _requestCount, "Invalid request ID");
        PropertyRequest storage req = requests[_requestId];
        require(req.status == 0, "Request already processed");
        
        req.status = 2; // Rejected
        emit PropertyRequestRejected(_requestId);
    }

    // Get property owners
    function getPropertyOwners(uint256 _propertyId) external view returns (
        address[] memory ownerAddresses,
        uint256[] memory percentages
    ) {
        // require(ownerOf(_propertyId) != address(0), "Property not found or not minted yet"); // Temporarily removed for debugging
        Owner[] storage owners = propertyOwners[_propertyId];
        uint256 ownerCount = owners.length;
        
        ownerAddresses = new address[](ownerCount);
        percentages = new uint256[](ownerCount);
        
        for (uint256 i = 0; i < ownerCount; i++) {
            ownerAddresses[i] = owners[i].ownerAddress;
            percentages[i] = owners[i].percentage;
        }
        
        return (ownerAddresses, percentages);
    }

    function registerProperty(
        string memory _name,
        address _owner,
        string memory _partnershipAgreementUrl,
        string memory _maintenanceAgreementUrl,
        string memory _rentAgreementUrl,
        string memory _imageUrl
    ) external onlyOwner {
        require(bytes(_name).length > 0, "Name required");
        require(_owner != address(0), "Invalid owner");

        _propertyCount++;
        uint256 newId = _propertyCount;

        _safeMint(_owner, newId);
        properties[newId] = Property({
            id: newId,
            name: _name,
            partnershipAgreementUrl: _partnershipAgreementUrl,
            maintenanceAgreementUrl: _maintenanceAgreementUrl,
            rentAgreementUrl: _rentAgreementUrl,
            imageUrl: _imageUrl,
            isFractionalized: false
        });

        emit PropertyRegistered(newId, _name, _owner);
    }

    function getProperty(uint256 _id)
        external
        view
        returns (Property memory)
    {
        // ✅ FIX: use ownerOf() instead of _exists()
        require(ownerOf(_id) != address(0), "Property not found");
        return properties[_id];
    }

    function propertyCount() external view returns (uint256) {
        return _propertyCount;
    }

    function markFractionalized(uint256 _propertyId, address _fractionalContract) external onlyOwner {
        // ✅ FIX: use ownerOf() instead of _exists()
        require(ownerOf(_propertyId) != address(0), "Invalid property ID");
        properties[_propertyId].isFractionalized = true;
        emit PropertyFractionalized(_propertyId, _fractionalContract);
    }
}
