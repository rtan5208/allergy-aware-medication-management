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
# Get All Patients
#Invoke-RestMethod -Uri "http://localhost:5000/api/patients" -Method GET -Headers $headers

# Get Patient by ID
#Invoke-RestMethod -Uri "http://localhost:5000/api/patients/1" -Method GET -Headers $headers

# Create Patient
<#
$newPatient = @{
    name = "Doroamon"
    nric_passport = "S1234567A"
    dob = "1990-01-01"
    age = 45
    gender = "Female"
    phone = "12345678"
    email = "doroamon@example.com"
    notes = "Testing allegery notes"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/patients" -Method POST -Headers $headers -Body $newPatient -ContentType "application/json"
#>

# Update Patient

$updatePatient = @{
    name = "Anti Greast"
    nric_passport = "S5847654321B"
    dob = "1977-02-02"
    age = 33
    gender = "Female"
    phone = "87654321"
    email = "jane@example.com"
    notes = "Updated notes"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/patients/2" -Method PUT -Headers $headers -Body $updatePatient -ContentType "application/json"
#>

# Delete Patient
#Invoke-RestMethod -Uri "http://localhost:5000/api/patients/1" -Method DELETE -Headers $headers








