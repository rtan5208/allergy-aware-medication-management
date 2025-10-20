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
# Get All Allergies 
#Invoke-RestMethod -Uri "http://localhost:5000/api/allergies" -Method GET -Headers $headers


# Get Allergy by ID
#Invoke-RestMethod -Uri "http://localhost:5000/api/allergies/1" -Method GET -Headers $headers

# Create Allergy
<#
$newAllergy = @{
    allergy_name = "Insect sting"
    description = "An allergic reaction to the venom from insects like bees, wasps, and hornets."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/allergies" -Method POST -Headers $headers -Body $newAllergy -ContentType "application/json"
#>

# Update Allergy

$updateAllergy = @{
    allergy_name = "Insect sting allergy"
    description = "Reactions can range from local swelling to severe, life-threatening anaphylaxis."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/allergies/5" -Method PUT -Headers $headers -Body $updateAllergy -ContentType "application/json"

# Delete Allergy
Invoke-RestMethod -Uri "http://localhost:5000/api/allergies/1" -Method DELETE -Headers $headers







