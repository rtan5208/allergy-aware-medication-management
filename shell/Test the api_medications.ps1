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
# GET all medications
#Invoke-RestMethod -Uri "http://localhost:5000/api/medications" -Method GET -Headers $headers

# POST create a medication
<#
$newMed = @{
    medication_name = "Zofolt"
    manufacturer = "Pfizer"
    type = "Capsule"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/medications" -Method POST -Headers $headers -Body $newMed -ContentType "application/json"
#>


# GET the created medication by id
#Invoke-RestMethod -Uri "http://localhost:5000/api/medications/4" -Method GET -Headers $headers


# PUT update the medication
<#
$updateMed = @{
    medication_name = "TestMed A - Updated"
    manufacturer = "Acme Pharma Ltd"
    type = "Capsule"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/medications/4" -Method PUT -Headers $headers -Body $updateMed -ContentType "application/json"
#>

# DELETE medication (will fail if referenced by order_items or medication_ingredients)
#Invoke-RestMethod -Uri "http://localhost:5000/api/medications/3" -Method DELETE -Headers $headers














