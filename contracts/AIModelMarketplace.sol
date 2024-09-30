// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract AImodelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        address[] buyers; // Store buyers' addresses
        uint8 ratingCount;
        uint256 totalRating;
    }

    Model[] public models;
    address public owner;

    event ModelListed(uint256 modelId, string name, address creator, uint256 price);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint8 rating, address rater);
    event FundsWithdrawn(address owner, uint256 amount);

    constructor() public {
        owner = msg.sender; // Set the contract creator as the owner
    }

    // Function to list a new AI model
    function listModel(string memory name, string memory description, uint256 price) public {
        require(price > 0, "Price must be greater than zero");

        uint256 modelId = models.length;
        models.push(Model({
            name: name,
            description: description,
            price: price,
            creator: payable(msg.sender), // Correctly initialize as payable
            buyers: new address[](0), // Initialize buyers array correctly
            ratingCount: 0,
            totalRating: 0
        }));

        emit ModelListed(modelId, name, msg.sender, price);
    }

      // Function to purchase a model
    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect amount sent");
        require(model.creator != msg.sender, "Cannot purchase your own model");

        // Instead of transferring funds directly to the creator, the Ether stays in the contract

        model.buyers.push(msg.sender);  // Store buyer's address
        emit ModelPurchased(modelId, msg.sender);
    }

    

    // Function to rate a model
    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];

        require(model.creator != msg.sender, "Model creator cannot rate their own model");

        model.ratingCount++;
        model.totalRating += rating;

        emit ModelRated(modelId, rating, msg.sender);
    }

    // Function to withdraw funds
    function withdrawFunds() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        // Transfer the contract balance to the owner
        payable(msg.sender).transfer(balance);
        emit FundsWithdrawn(msg.sender, balance);
    }  

    // Function to get model details
    function getModelDetails(uint256 modelId) public view returns (string memory, string memory, uint256, address, uint256, address[] memory) {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];
        uint256 averageRating = model.ratingCount > 0 ? model.totalRating / model.ratingCount : 0;

        return (model.name, model.description, model.price, model.creator, averageRating, model.buyers);
    }
}
