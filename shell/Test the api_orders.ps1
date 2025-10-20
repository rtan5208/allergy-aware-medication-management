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
# List orders
#Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method GET -Headers $headers 

# Create an order that has conflicts with warning and no override
<#
$newOrder = @{
  patient_id = 2
  prescriber_id = 2
  override_flag = $false
  items = @(
    @{ medication_id = 2; dosage = '5 ml'; frequency = 'twice daily'; duration = '5 days' }
    @{ medication_id = 1; dosage = '1 tablet'; frequency = 'daily'; duration = '7 days' }
  )
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:5000/api/orders' -Method POST -Headers $headers -Body $newOrder -ContentType 'application/json'
#>


# Create an order with override to supply reason
<#
$newOrder = @{
  patient_id = 2
  prescriber_id = 2
  override_flag = $true
  override_reason = "Clinically justified benefit outweighs risk"
  items = @(
    @{ medication_id = 2; dosage = '30 ml'; frequency = 'daily'; duration = '5 days' }
    @{ medication_id = 1; dosage = '45 capsule'; frequency = 'weekly'; duration = '7 days' }
  )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method POST -Headers $headers -Body $newOrder -ContentType "application/json"
#>



# Update an order with new items
$update = @{
  prescriber_id = 2
  override_flag = $true
  override_reason = "High outweighs risk"
  items = @(
    @{ medication_id = 3; dosage='2 tablets'; frequency='daily'; duration='3 days' }
  )
}
Invoke-RestMethod -Uri 'http://localhost:5000/api/orders/10' -Method PUT -Headers $headers -Body ($update|ConvertTo-Json) -ContentType 'application/json'


# Delete an order











