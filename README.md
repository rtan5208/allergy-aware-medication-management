This document compiles the API surface exposed by the backend and shows how to exercise each endpoint using the PowerShell scripts in this folder.

Prerequisites
- Backend running at http://localhost:5000 — start [backend/src/app.js](../backend/src/app.js).
- Env: set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, JWT_SECRET in [backend/.env](../backend/.env) as read by [backend/src/config/db.js](../backend/src/config/db.js).
- Base URL: http://localhost:5000
- Default login used by scripts: username=admin01, password=hashed_admin_pass (generate hashes with [backend/src/utils/hash.js](../backend/src/utils/hash.js) if needed).

Run a test script
- From repo root in PowerShell:
  - powershell -ExecutionPolicy Bypass -File "shell/Test the api_users.ps1"
- Each script:
  - Logs in: POST /api/auth/login via [`authController.login`](../backend/src/controllers/authController.js) routed in [backend/src/routes/authRoutes.js](../backend/src/routes/authRoutes.js).
  - Extracts token and sets Authorization: Bearer <token> for subsequent calls using [`auth`](../backend/src/middleware/auth.js).

Auth
- POST /api/auth/login — obtain JWT
  - Controller: [`authController.login`](../backend/src/controllers/authController.js)
  - Route: [backend/src/routes/authRoutes.js](../backend/src/routes/authRoutes.js)
  - Used in every script here.
  - 

Users
- Base: /api/users — Route: [backend/src/routes/userRoutes.js](../backend/src/routes/userRoutes.js), Controller: [backend/src/controllers/userController.js](../backend/src/controllers/userController.js)
- Endpoints:
  - GET /api/users — [`userController.getAllUsers`](../backend/src/controllers/userController.js)
  - GET /api/users/:user_id — [`userController.getUserById`](../backend/src/controllers/userController.js)
  - POST /api/users — [`userController.createUser`](../backend/src/controllers/userController.js) (hashes password with bcrypt)
  - PUT /api/users/:user_id — [`userController.updateUser`](../backend/src/controllers/userController.js)
  - PATCH /api/users/:user_id/deactivate — [`userController.deactivateUser`](../backend/src/controllers/userController.js)
  - DELETE /api/users/:user_id — [`userController.deleteUser`](../backend/src/controllers/userController.js)
- Test: [Test the api_users.ps1](./Test%20the%20api_users.ps1)

Patients
- Base: /api/patients — Route: [backend/src/routes/patientRoutes.js](../backend/src/routes/patientRoutes.js), Controller: [backend/src/controllers/patientController.js](../backend/src/controllers/patientController.js)
- Endpoints:
  - GET /api/patients — [`patientController.getAllPatients`](../backend/src/controllers/patientController.js)
  - GET /api/patients/:patient_id — [`patientController.getPatientById`](../backend/src/controllers/patientController.js)
  - POST /api/patients — [`patientController.createPatient`](../backend/src/controllers/patientController.js)
  - PUT /api/patients/:patient_id — [`patientController.updatePatient`](../backend/src/controllers/patientController.js)
  - DELETE /api/patients/:patient_id — [`patientController.deletePatient`](../backend/src/controllers/patientController.js) (prevents delete if referenced)
- Test: [Test the api_patients.ps1](./Test%20the%20api_patients.ps1)

Patient Allergies
- Base: /api/patient-allergies — Route: [backend/src/routes/patientAllergyRoutes.js](../backend/src/routes/patientAllergyRoutes.js), Controller: [backend/src/controllers/patientAllergyController.js](../backend/src/controllers/patientAllergyController.js)
- Endpoints:
  - GET /api/patient-allergies/:patient_id — [`patientAllergyController.listPatientAllergies`](../backend/src/controllers/patientAllergyController.js)
  - POST /api/patient-allergies/:patient_id — [`patientAllergyController.addPatientAllergy`](../backend/src/controllers/patientAllergyController.js)
  - PUT /api/patient-allergies/:patient_allergy_id — [`patientAllergyController.updatePatientAllergy`](../backend/src/controllers/patientAllergyController.js)
  - DELETE /api/patient-allergies/:patient_allergy_id — [`patientAllergyController.deletePatientAllergy`](../backend/src/controllers/patientAllergyController.js)
- Note: PUT/DELETE use patient_allergy_id (record id), not patient_id.
- Test: [Test the api_patients_allergies.ps1](./Test%20the%20api_patients_allergies.ps1)

Allergies
- Base: /api/allergies — Route: [backend/src/routes/allergyRoutes.js](../backend/src/routes/allergyRoutes.js), Controller: [backend/src/controllers/allergyController.js](../backend/src/controllers/allergyController.js)
- Endpoints:
  - GET /api/allergies — [`allergyController.getAllAllergies`](../backend/src/controllers/allergyController.js)
  - GET /api/allergies/:allergy_id — [`allergyController.getAllergyById`](../backend/src/controllers/allergyController.js)
  - POST /api/allergies — [`allergyController.createAllergy`](../backend/src/controllers/allergyController.js)
  - PUT /api/allergies/:allergy_id — [`allergyController.updateAllergy`](../backend/src/controllers/allergyController.js)
  - DELETE /api/allergies/:allergy_id — [`allergyController.deleteAllergy`](../backend/src/controllers/allergyController.js) (prevents delete if referenced)
- Test: [Test the api_allergies.ps1](./Test%20the%20api_allergies.ps1)

Active Ingredients
- Base: /api/active-ingredients — Route: [backend/src/routes/activeIngredientRoutes.js](../backend/src/routes/activeIngredientRoutes.js), Controller: [backend/src/controllers/activeIngredientController.js](../backend/src/controllers/activeIngredientController.js)
- Endpoints:
  - GET /api/active-ingredients — [`activeIngredientController.getAllIngredients`](../backend/src/controllers/activeIngredientController.js)
  - GET /api/active-ingredients/:ingredient_id — [`activeIngredientController.getIngredientById`](../backend/src/controllers/activeIngredientController.js)
  - POST /api/active-ingredients — [`activeIngredientController.createIngredient`](../backend/src/controllers/activeIngredientController.js)
  - PUT /api/active-ingredients/:ingredient_id — [`activeIngredientController.updateIngredient`](../backend/src/controllers/activeIngredientController.js)
  - DELETE /api/active-ingredients/:ingredient_id — [`activeIngredientController.deleteIngredient`](../backend/src/controllers/activeIngredientController.js)
- Test: [Test the api_active_ingredients.ps1](./Test%20the%20api_active_ingredients.ps1)

Ingredient ↔ Allergy mapping (under Active Ingredients)
- Base: /api/active-ingredients/:ingredient_id/allergies — Mounted in [backend/src/routes/activeIngredientRoutes.js](../backend/src/routes/activeIngredientRoutes.js), Controller: [backend/src/controllers/ingredientAllergyController.js](../backend/src/controllers/ingredientAllergyController.js)
- Endpoints:
  - GET — [`ingredientAllergyController.listAllergies`](../backend/src/controllers/ingredientAllergyController.js)
  - POST — [`ingredientAllergyController.linkAllergy`](../backend/src/controllers/ingredientAllergyController.js)
  - DELETE /:allergy_id — [`ingredientAllergyController.unlinkAllergy`](../backend/src/controllers/ingredientAllergyController.js)
- Test: [Test the apit_ingredients_allergies_map.ps1](./Test%20the%20apit_ingredients_allergies_map.ps1)

Medications
- Base: /api/medications — Route: [backend/src/routes/medicationRoutes.js](../backend/src/routes/medicationRoutes.js), Controller: [backend/src/controllers/medicationController.js](../backend/src/controllers/medicationController.js)
- Endpoints:
  - GET /api/medications — [`medicationController.getAllMedications`](../backend/src/controllers/medicationController.js)
  - GET /api/medications/:medication_id — [`medicationController.getMedicationById`](../backend/src/controllers/medicationController.js)
  - POST /api/medications — [`medicationController.createMedication`](../backend/src/controllers/medicationController.js)
  - PUT /api/medications/:medication_id — [`medicationController.updateMedication`](../backend/src/controllers/medicationController.js)
  - DELETE /api/medications/:medication_id — [`medicationController.deleteMedication`](../backend/src/controllers/medicationController.js) (prevents delete if referenced)
- Test: [Test the api_medications.ps1](./Test%20the%20api_medications.ps1)

Medication ↔ Active Ingredient mapping (under Medications)
- Intended Base: /api/medications/:medication_id/active-ingredients — Controller: [backend/src/controllers/medicationIngredientController.js](../backend/src/controllers/medicationIngredientController.js)
- Endpoints:
  - GET — [`medicationIngredientController.listIngredients`](../backend/src/controllers/medicationIngredientController.js)
  - POST — [`medicationIngredientController.addIngredient`](../backend/src/controllers/medicationIngredientController.js)
  - DELETE /:ingredient_id — [`medicationIngredientController.removeIngredient`](../backend/src/controllers/medicationIngredientController.js)
- Test: [Test the api_medication_ingredients.ps1](./Test%20the%20api_medication_ingredients.ps1)
- Note: Ensure these routes are mounted under /api/medications in [backend/src/routes/medicationRoutes.js](../backend/src/routes/medicationRoutes.js) to match the script paths.

Orders
- Base: /api/orders — Route: [backend/src/routes/orderRoutes.js](../backend/src/routes/orderRoutes.js), Controller: [backend/src/controllers/orderController.js](../backend/src/controllers/orderController.js)
- Endpoints:
  - GET /api/orders — [`orderController.listOrders`](../backend/src/controllers/orderController.js)
  - GET /api/orders/:order_id — [`orderController.getOrder`](../backend/src/controllers/orderController.js)
  - POST /api/orders — [`orderController.createOrder`](../backend/src/controllers/orderController.js) (performs ingredient–allergy conflict detection, supports override_flag + override_reason)
  - PUT /api/orders/:order_id — [`orderController.updateOrder`](../backend/src/controllers/orderController.js) (re-evaluates conflicts, supports override)
  - DELETE /api/orders/:order_id — [`orderController.deleteOrder`](../backend/src/controllers/orderController.js)
- Persistence/Audit: [`Order.create`](../backend/src/models/orderModel.js), [`Order.update`](../backend/src/models/orderModel.js), [`AuditLog.insert`](../backend/src/models/auditLogModel.js)
- Conflict SQL reference: [sql/Detect Allergy Conflicts in Prescriptions.sql](../sql/Detect%20Allergy%20Conflicts%20in%20Prescriptions.sql)
- Test: [Test the api_orders.ps1](./Test%20the%20api_orders.ps1)

Common testing notes
- All protected routes require Authorization: Bearer <token> — enforced by [`auth`](../backend/src/middleware/auth.js).
- Scripts contain commented example calls; uncomment to run the desired operation.
- Typical errors:
  - 401 No token/Invalid token: ensure JWT_SECRET is set and you supply Authorization header.
  - 404 Not found: verify ids exist; for patient allergies, use patient_allergy_id for PUT/DELETE.
  - 400 Delete blocked due to references: remove associations first (messages list required cleanups).

