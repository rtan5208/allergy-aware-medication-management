/**
 * hashed_admin_pass
 * hashed_doctor_pass
 * hashed_pharma_pass
  */

const bcrypt = require('bcrypt');
bcrypt.hash('hashed_admin_pass', 10).then(console.log);
bcrypt.hash('hashed_doctor_pass', 10).then(console.log);
bcrypt.hash('hashed_pharma_pass', 10).then(console.log);