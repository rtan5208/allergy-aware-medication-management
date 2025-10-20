const express = require('express');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const allergyRoutes = require('./routes/allergyRoutes');
const patientAllergyRoutes = require('./routes/patientAllergyRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const activeIngredientRoutes = require('./routes/activeIngredientRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/allergies', allergyRoutes);
app.use('/api/patient-allergies', patientAllergyRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/active-ingredients', activeIngredientRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});