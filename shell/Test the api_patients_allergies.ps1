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
# List Allergies for a Patient
#Invoke-RestMethod -Uri "http://localhost:5000/api/patient-allergies/2" -Method GET -Headers $headers

# Add Allergy to Patient
<#
$newPatientAllergy = @{
    allergy_id = 4
    severity = "Mild"
    notes = "Reactions can range from local swelling to severe, life-threatening anaphylaxis."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/patient-allergies/2" -Method POST -Headers $headers -Body $newPatientAllergy -ContentType "application/json"
#>

# Update Patient Allergy
<#
$updatePatientAllergy = @{
    severity = "Mild"
    notes = "With correct notes presentable"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/patient-allergies/2" -Method PUT -Headers $headers -Body $updatePatientAllergy -ContentType "application/json"
#>


# Remove Allergy from Patient
#Invoke-RestMethod -Uri "http://localhost:5000/api/patient-allergies/2" -Method DELETE -Headers $headers