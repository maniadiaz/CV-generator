require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function createProfile() {
  try {
    // Login
    const login = await axios.post(`${API_URL}/auth/login`, {
      email: 'miguelalexisdi18@gmail.com',
      password: 'Alexis185diaz2000'
    });

    const token = login.data.data.accessToken;

    // Crear perfil
    const profile = await axios.post(`${API_URL}/profiles`, {
      name: 'Mi CV Principal',
      template: 'harvard_classic',
      language: 'es'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Profile creado:', profile.data.data.profile.id);
    console.log('Nombre:', profile.data.data.profile.name);
    console.log('Template:', profile.data.data.profile.template);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createProfile();
