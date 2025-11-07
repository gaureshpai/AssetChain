#!/bin/bash
# Copy compiled contract artifacts to frontend

CONTRACT_PATH="artifacts/contracts/PropertyRegistry.sol/PropertyRegistry.json"
TARGET_DIR="../frontend/contracts"
TARGET_PATH="$TARGET_DIR/PropertyRegistry.json"

# Create target directory if it doesn't exist
if [ ! -d "$TARGET_DIR" ]; then
    mkdir -p "$TARGET_DIR"
    echo "Created directory: $TARGET_DIR"
fi

# Copy the contract artifact
if [ -f "$CONTRACT_PATH" ]; then
    cp "$CONTRACT_PATH" "$TARGET_PATH"
    echo "Successfully copied PropertyRegistry.json to frontend/contracts/"
else
    echo "Error: Contract artifact not found. Please compile the contract first with 'npx hardhat compile'"
    exit 1
fi
