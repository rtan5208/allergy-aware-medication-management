# 1. Obtain a JWT Token via Login
$body = @{
    username = "admin01"
    password = "hashed_admin_pass"
} | ConvertTo-Json

# 2. Call the API using Invoke-RestMethod
# $response will automatically be a PowerShell object with properties 'token' and 'user'.
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# 3. Extract the 'token' value directly
$token = $response.token

Write-Host "Token: $token" -ForegroundColor Green

# 4. Use the Token in headers
$headers = @{
    Authorization = "Bearer $token"
}

# 5. Invoke
# List All Active Ingredients
Invoke-RestMethod -Uri "http://localhost:5000/api/active-ingredients" -Method GET -Headers $headers

# Get Ingredient by ID
# Invoke-RestMethod -Uri "http://localhost:5000/api/active-ingredients/4" -Method GET -Headers $headers

# Create Ingredient
<#
$newIngredient = @{
    ingredient_name = "Methylprednisolone"
    description = "A corticosteroid (steroid) that treats inflammation."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/active-ingredients" -Method POST -Headers $headers -Body $newIngredient -ContentType "application/json"
#>

# Update Ingredient
<#
$updateIngredient = @{
    ingredient_name = "Acetaminophen"
    description = "@#Derived from groundnuts, used as base or supplement."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/active-ingredients/4" -Method PUT -Headers $headers -Body $updateIngredient -ContentType "application/json"
#>


# Delete Ingredient
#Invoke-RestMethod -Uri "http://localhost:5000/api/active-ingredients/7" -Method DELETE -Headers $headers










