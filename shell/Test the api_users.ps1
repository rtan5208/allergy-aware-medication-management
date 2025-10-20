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
# Get All Users
# Invoke-RestMethod -Uri "http://localhost:5000/api/users" -Method GET -Headers $headers

# Get User by ID
# Invoke-RestMethod -Uri "http://localhost:5000/api/users/1" -Method GET -Headers $headers

# Create User
<#
$newUser = @{
    username = "ctan66"
    password = "hashed_doctor_pass"
    role = "Doctor"
    full_name = "Ooi Thiam Cheng"
    email = "ooitc@hlwe.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/users" -Method POST -Headers $headers -Body $newUser -ContentType "application/json"
#>

# Update User
<#
$updateUser = @{
    username = "ctan66"
    role = "Pharmacist"
    full_name = "Ooi Thiam Cheng"
    email = "ooitc@hlwe.com"
    is_active = "1"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/users/4" -Method PUT -Headers $headers -Body $updateUser -ContentType "application/json"
#>

# Deactivate User (Soft Delete)
#Invoke-RestMethod -Uri "http://localhost:5000/api/users/4/deactivate" -Method PATCH -Headers $headers

# Delete User (Hard Delete)
#Invoke-RestMethod -Uri "http://localhost:5000/api/users/1" -Method DELETE -Headers $headers


