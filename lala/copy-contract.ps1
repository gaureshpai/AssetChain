# Copy compiled contract artifacts to frontend
$contractPath = "artifacts\contracts\PropertyRegistry.sol\PropertyRegistry.json"
$targetDir = "..\frontend\contracts"
$targetPath = "$targetDir\PropertyRegistry.json"

# Create target directory if it doesn't exist
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
    Write-Host "Created directory: $targetDir" -ForegroundColor Green
}

# Copy the contract artifact
if (Test-Path $contractPath) {
    Copy-Item -Path $contractPath -Destination $targetPath -Force
    Write-Host "Successfully copied PropertyRegistry.json to frontend/contracts/" -ForegroundColor Green
} else {
    Write-Host "Error: Contract artifact not found. Please compile the contract first with 'npx hardhat compile'" -ForegroundColor Red
    exit 1
}
