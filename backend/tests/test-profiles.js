const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let accessToken = '';
let profileId = '';

// Configurar axios para incluir el token en todas las peticiones
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token
api.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * Test 1: Login
 */
async function testLogin() {
  console.log('\n📋 Test 1: Login');
  try {
    const response = await api.post('/auth/login', {
      email: 'test@example.com',
      password: 'Test1234'
    });

    accessToken = response.data.data.accessToken;
    console.log('✅ Login successful');
    console.log('Token:', accessToken.substring(0, 20) + '...');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 2: Crear perfil
 */
async function testCreateProfile() {
  console.log('\n📋 Test 2: Crear perfil');
  try {
    const response = await api.post('/profiles', {
      name: 'CV Desarrollador Full Stack',
      template: 'harvard_modern',
      language: 'es',
      color_scheme: 'harvard_crimson',
      personalInfo: {
        full_name: 'Juan Pérez García',
        email: 'juan.perez@example.com',
        phone: '+52 55 1234 5678',
        location: 'Ciudad de México, México',
        professional_title: 'Senior Full Stack Developer',
        summary: 'Desarrollador Full Stack con 8+ años de experiencia en tecnologías web modernas.',
        website: 'https://juanperez.dev',
        linkedin: 'https://linkedin.com/in/juanperez',
        github: 'https://github.com/juanperez'
      }
    });

    profileId = response.data.data.profile.id;
    console.log('✅ Perfil creado exitosamente');
    console.log('Profile ID:', profileId);
    console.log('Profile Name:', response.data.data.profile.name);
    console.log('Slug:', response.data.data.profile.slug);
    console.log('Completion:', response.data.data.profile.completion_percentage + '%');
    return true;
  } catch (error) {
    console.error('❌ Error creando perfil:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 3: Obtener todos los perfiles
 */
async function testGetAllProfiles() {
  console.log('\n📋 Test 3: Obtener todos los perfiles');
  try {
    const response = await api.get('/profiles');

    console.log('✅ Perfiles obtenidos');
    console.log('Total perfiles:', response.data.data.count);
    response.data.data.profiles.forEach(profile => {
      console.log(`  - ${profile.name} (ID: ${profile.id}, Default: ${profile.is_default})`);
    });
    return true;
  } catch (error) {
    console.error('❌ Error obteniendo perfiles:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 4: Obtener perfil por ID
 */
async function testGetProfileById() {
  console.log('\n📋 Test 4: Obtener perfil por ID');
  try {
    const response = await api.get(`/profiles/${profileId}`);

    console.log('✅ Perfil obtenido');
    console.log('Name:', response.data.data.profile.name);
    console.log('Template:', response.data.data.profile.template);
    console.log('Language:', response.data.data.profile.language);
    console.log('Personal Info:', response.data.data.profile.personalInfo?.full_name || 'N/A');
    return true;
  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 5: Actualizar perfil
 */
async function testUpdateProfile() {
  console.log('\n📋 Test 5: Actualizar perfil');
  try {
    const response = await api.put(`/profiles/${profileId}`, {
      name: 'CV Desarrollador Full Stack Senior',
      template: 'harvard_classic',
      is_public: true
    });

    console.log('✅ Perfil actualizado');
    console.log('New Name:', response.data.data.profile.name);
    console.log('New Template:', response.data.data.profile.template);
    console.log('Is Public:', response.data.data.profile.is_public);
    return true;
  } catch (error) {
    console.error('❌ Error actualizando perfil:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 6: Actualizar información personal
 */
async function testUpdatePersonalInfo() {
  console.log('\n📋 Test 6: Actualizar información personal');
  try {
    const response = await api.put(`/profiles/${profileId}/personal`, {
      full_name: 'Juan Carlos Pérez García',
      twitter: 'https://twitter.com/juanperez',
      nationality: 'Mexicana',
      driving_license: 'B'
    });

    console.log('✅ Información personal actualizada');
    console.log('Full Name:', response.data.data.personalInfo.full_name);
    console.log('Completion:', response.data.data.completionPercentage + '%');
    return true;
  } catch (error) {
    console.error('❌ Error actualizando info personal:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 7: Obtener información personal
 */
async function testGetPersonalInfo() {
  console.log('\n📋 Test 7: Obtener información personal');
  try {
    const response = await api.get(`/profiles/${profileId}/personal`);

    console.log('✅ Información personal obtenida');
    console.log('Full Name:', response.data.data.personalInfo.full_name);
    console.log('Email:', response.data.data.personalInfo.email);
    console.log('Phone:', response.data.data.personalInfo.phone);
    console.log('Location:', response.data.data.personalInfo.location);
    return true;
  } catch (error) {
    console.error('❌ Error obteniendo info personal:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 8: Duplicar perfil
 */
async function testDuplicateProfile() {
  console.log('\n📋 Test 8: Duplicar perfil');
  try {
    const response = await api.post(`/profiles/${profileId}/duplicate`);

    console.log('✅ Perfil duplicado');
    console.log('New Profile ID:', response.data.data.profile.id);
    console.log('New Name:', response.data.data.profile.name);
    return true;
  } catch (error) {
    console.error('❌ Error duplicando perfil:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 9: Marcar como default
 */
async function testSetDefault() {
  console.log('\n📋 Test 9: Marcar perfil como default');
  try {
    const response = await api.patch(`/profiles/${profileId}/set-default`);

    console.log('✅ Perfil marcado como default');
    console.log('Profile:', response.data.data.profile.name);
    console.log('Is Default:', response.data.data.profile.is_default);
    return true;
  } catch (error) {
    console.error('❌ Error marcando como default:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 10: Obtener perfil completo
 */
async function testGetCompleteProfile() {
  console.log('\n📋 Test 10: Obtener perfil completo');
  try {
    const response = await api.get(`/profiles/${profileId}/complete`);

    console.log('✅ Perfil completo obtenido');
    console.log('Name:', response.data.data.profile.name);
    console.log('Has Personal Info:', !!response.data.data.profile.personalInfo);
    return true;
  } catch (error) {
    console.error('❌ Error obteniendo perfil completo:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 11: Obtener estadísticas
 */
async function testGetStats() {
  console.log('\n📋 Test 11: Obtener estadísticas');
  try {
    const response = await api.get('/profiles/stats');

    console.log('✅ Estadísticas obtenidas');
    console.log('Total Profiles:', response.data.data.stats.totalProfiles);
    console.log('Total Views:', response.data.data.stats.totalViews);
    console.log('Total Downloads:', response.data.data.stats.totalDownloads);
    console.log('Average Completion:', response.data.data.stats.averageCompletion + '%');
    return true;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 12: Eliminar perfil (último test)
 */
async function testDeleteProfile() {
  console.log('\n📋 Test 12: Eliminar perfil');
  try {
    // Primero obtener todos los perfiles para eliminar el duplicado
    const profilesResponse = await api.get('/profiles');
    const profiles = profilesResponse.data.data.profiles;

    // Buscar el perfil duplicado (el que tiene "Copy" en el nombre)
    const duplicateProfile = profiles.find(p => p.name.includes('Copy'));

    if (duplicateProfile) {
      await api.delete(`/profiles/${duplicateProfile.id}`);
      console.log('✅ Perfil duplicado eliminado');
      console.log('Deleted Profile ID:', duplicateProfile.id);
    } else {
      console.log('⚠️ No se encontró perfil duplicado para eliminar');
    }

    return true;
  } catch (error) {
    console.error('❌ Error eliminando perfil:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Ejecutar todos los tests
 */
async function runAllTests() {
  console.log('🚀 Iniciando tests de API de Profiles\n');
  console.log('='.repeat(50));

  const results = {
    passed: 0,
    failed: 0
  };

  // Login primero
  if (!(await testLogin())) {
    console.log('\n❌ Login falló. No se pueden ejecutar los demás tests.');
    return;
  }
  results.passed++;

  // Tests de perfiles
  const tests = [
    testCreateProfile,
    testGetAllProfiles,
    testGetProfileById,
    testUpdateProfile,
    testUpdatePersonalInfo,
    testGetPersonalInfo,
    testDuplicateProfile,
    testSetDefault,
    testGetCompleteProfile,
    testGetStats,
    testDeleteProfile
  ];

  for (const test of tests) {
    const success = await test();
    if (success) {
      results.passed++;
    } else {
      results.failed++;
    }

    // Pequeña pausa entre tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Resumen
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE TESTS');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Total: ${results.passed + results.failed}`);
  console.log(`🎯 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  console.log('='.repeat(50));
}

// Ejecutar tests
runAllTests().catch(error => {
  console.error('❌ Error ejecutando tests:', error);
  process.exit(1);
});
