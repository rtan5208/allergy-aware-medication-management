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
# List allergies linked to an ingredient
#Invoke-RestMethod -Uri "http://localhost:5000/api/active-ingredients/2/allergies" -Method GET -Headers $headers


# Link allergy to ingredient

$linkBody = @{ allergy_id =3 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/active-ingredients/2/allergies" -Method POST -Headers $headers -Body $linkBody -ContentType "application/json"
#>

# Unlink allergy from ingredient
#Invoke-RestMethod -Uri "http://localhost:5000/api/active-ingredients/2/allergies/3" -Method DELETE -Headers $headers




