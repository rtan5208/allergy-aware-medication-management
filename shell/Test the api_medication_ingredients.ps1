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
# Add Ingredients
<#
$body = @{ ingredient_id = 4 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/medications/3/active-ingredients" -Method POST -Headers $headers -Body $body -ContentType "application/json"
#>

# Remove Ingredients
#Invoke-RestMethod -Uri "http://localhost:5000/api/medications/3/active-ingredients/4" -Method DELETE -Headers $headers

# List Ingredients
Invoke-RestMethod -Uri "http://localhost:5000/api/medications/3/active-ingredients" -Method GET -Headers $headers

