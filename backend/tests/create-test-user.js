const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function createTestUser() {
  try {
    console.log('📋 Creating test user...');

    const response = await axios.post(`${API_URL}/auth/register`, {
      email: 'miguelalexisdi18@gmail.com',
      password: 'Alexis185diaz2000',
      first_name: 'Miguel Alexis',
      last_name: 'Diaz Diaz'
    });

    console.log('✅ Test user created successfully!');
    console.log('Email:', response.data.data.user.email);
    console.log('Name:', response.data.data.user.first_name, response.data.data.user.last_name);

  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️ Test user already exists');
    } else {
      console.error('❌ Error creating test user:', error.response?.data || error.message);
    }
  }
}

createTestUser();
