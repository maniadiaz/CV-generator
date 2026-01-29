const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let accessToken = '';
let profileId = '';
let educationId1 = '';
let educationId2 = '';
let experienceId1 = '';
let experienceId2 = '';

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

/**
 * Test 1: Login
 */
async function testLogin() {
  console.log('\n📋 Test 1: Login');
  try {
    const response = await api.post('/auth/login', {
      email: 'miguelalexisdi18@gmail.com',
      password: 'Alexis185diaz2000'
    });

    accessToken = response.data.data.accessToken;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 2: Obtener o crear perfil
 */
async function testGetOrCreateProfile() {
  console.log('\n📋 Test 2: Obtener o crear perfil');
  try {
    let response = await api.get('/profiles');

    if (response.data.data.profiles.length > 0) {
      profileId = response.data.data.profiles[0].id;
      console.log('✅ Using existing profile:', profileId);
    } else {
      response = await api.post('/profiles', {
        name: 'CV Test Fase 3',
        template: 'harvard_classic'
      });
      profileId = response.data.data.profile.id;
      console.log('✅ Created new profile:', profileId);
    }
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 3: Crear primera educación
 */
async function testCreateEducation1() {
  console.log('\n📋 Test 3: Crear primera educación');
  try {
    const response = await api.post(`/profiles/${profileId}/education`, {
      institution: 'Universidad Nacional Autónoma de México',
      degree: 'Licenciatura en Ciencias de la Computación',
      field_of_study: 'Computer Science',
      start_date: '2015-08-01',
      end_date: '2019-06-30',
      grade: '9.2/10',
      description: 'Specialized in software engineering and artificial intelligence',
      location: 'Ciudad de México, México'
    });

    educationId1 = response.data.data.education.id;
    console.log('✅ Education 1 created:', educationId1);
    console.log('   Institution:', response.data.data.education.institution);
    console.log('   Degree:', response.data.data.education.degree);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 4: Crear segunda educación
 */
async function testCreateEducation2() {
  console.log('\n📋 Test 4: Crear segunda educación (en curso)');
  try {
    const response = await api.post(`/profiles/${profileId}/education`, {
      institution: 'Stanford University Online',
      degree: 'Maestría en Inteligencia Artificial',
      field_of_study: 'Artificial Intelligence',
      start_date: '2023-01-15',
      end_date: null,
      is_current: true,
      description: 'Advanced studies in machine learning and neural networks'
    });

    educationId2 = response.data.data.education.id;
    console.log('✅ Education 2 created:', educationId2);
    console.log('   Is Current:', response.data.data.education.is_current);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 5: Obtener todas las educaciones
 */
async function testGetAllEducations() {
  console.log('\n📋 Test 5: Obtener todas las educaciones');
  try {
    const response = await api.get(`/profiles/${profileId}/education`);

    console.log('✅ Educations retrieved:', response.data.data.count);
    response.data.data.educations.forEach((edu, i) => {
      console.log(`   ${i + 1}. ${edu.degree} - ${edu.institution} (Order: ${edu.display_order})`);
    });
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 6: Actualizar educación
 */
async function testUpdateEducation() {
  console.log('\n📋 Test 6: Actualizar educación');
  try {
    const response = await api.put(`/profiles/${profileId}/education/${educationId1}`, {
      grade: '9.5/10',
      description: 'Specialized in software engineering, AI, and graduated with honors'
    });

    console.log('✅ Education updated');
    console.log('   New Grade:', response.data.data.education.grade);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 7: Crear primera experiencia
 */
async function testCreateExperience1() {
  console.log('\n📋 Test 7: Crear primera experiencia');
  try {
    const response = await api.post(`/profiles/${profileId}/experience`, {
      project_title: 'E-commerce Platform Development',
      position: 'Full Stack Developer',
      company: 'Tech Solutions Inc.',
      company_website: 'https://techsolutions.example.com',
      employment_type: 'full_time',
      location: 'Ciudad de México, México',
      location_type: 'hybrid',
      start_date: '2019-07-01',
      end_date: '2021-12-31',
      description: 'Developed and maintained a large-scale e-commerce platform serving 100K+ users',
      achievements: [
        'Reduced page load time by 60%',
        'Implemented real-time inventory system',
        'Led team of 4 developers'
      ],
      technologies: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'AWS']
    });

    experienceId1 = response.data.data.experience.id;
    console.log('✅ Experience 1 created:', experienceId1);
    console.log('   Position:', response.data.data.experience.position);
    console.log('   Company:', response.data.data.experience.company);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 8: Crear segunda experiencia (actual)
 */
async function testCreateExperience2() {
  console.log('\n📋 Test 8: Crear segunda experiencia (actual)');
  try {
    const response = await api.post(`/profiles/${profileId}/experience`, {
      project_title: 'AI-Powered Analytics Platform',
      position: 'Senior Software Engineer',
      company: 'DataCorp',
      employment_type: 'full_time',
      location: 'Remote',
      location_type: 'remote',
      start_date: '2022-01-15',
      end_date: null,
      is_current: true,
      description: 'Building AI-powered analytics tools for enterprise clients',
      technologies: ['Python', 'TensorFlow', 'Docker', 'Kubernetes', 'GCP'],
      achievements: [
        'Designed microservices architecture',
        'Reduced processing time by 80%'
      ]
    });

    experienceId2 = response.data.data.experience.id;
    console.log('✅ Experience 2 created:', experienceId2);
    console.log('   Is Current:', response.data.data.experience.is_current);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 9: Obtener todas las experiencias
 */
async function testGetAllExperiences() {
  console.log('\n📋 Test 9: Obtener todas las experiencias');
  try {
    const response = await api.get(`/profiles/${profileId}/experience`);

    console.log('✅ Experiences retrieved:', response.data.data.count);
    response.data.data.experiences.forEach((exp, i) => {
      console.log(`   ${i + 1}. ${exp.position} at ${exp.company || 'N/A'} (Order: ${exp.display_order})`);
    });
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 10: Reordenar educaciones
 */
async function testReorderEducations() {
  console.log('\n📋 Test 10: Reordenar educaciones');
  try {
    // Invertir el orden
    const response = await api.post(`/profiles/${profileId}/education/reorder`, {
      ordered_ids: [educationId2, educationId1]
    });

    console.log('✅ Educations reordered');

    // Verificar nuevo orden
    const verify = await api.get(`/profiles/${profileId}/education`);
    console.log('   New order:');
    verify.data.data.educations.forEach((edu, i) => {
      console.log(`   ${i + 1}. ${edu.degree} (Order: ${edu.display_order})`);
    });
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 11: Reordenar experiencias
 */
async function testReorderExperiences() {
  console.log('\n📋 Test 11: Reordenar experiencias');
  try {
    const response = await api.post(`/profiles/${profileId}/experience/reorder`, {
      ordered_ids: [experienceId2, experienceId1]
    });

    console.log('✅ Experiences reordered');

    const verify = await api.get(`/profiles/${profileId}/experience`);
    console.log('   New order:');
    verify.data.data.experiences.forEach((exp, i) => {
      console.log(`   ${i + 1}. ${exp.position} (Order: ${exp.display_order})`);
    });
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 12: Toggle visibility de educación
 */
async function testToggleEducationVisibility() {
  console.log('\n📋 Test 12: Toggle visibility de educación');
  try {
    const response = await api.patch(`/profiles/${profileId}/education/${educationId1}/toggle-visibility`);

    console.log('✅ Education visibility toggled');
    console.log('   Is Visible:', response.data.data.education.is_visible);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 13: Toggle visibility de experiencia
 */
async function testToggleExperienceVisibility() {
  console.log('\n📋 Test 13: Toggle visibility de experiencia');
  try {
    const response = await api.patch(`/profiles/${profileId}/experience/${experienceId1}/toggle-visibility`);

    console.log('✅ Experience visibility toggled');
    console.log('   Is Visible:', response.data.data.experience.is_visible);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 14: Estadísticas de educación
 */
async function testEducationStats() {
  console.log('\n📋 Test 14: Estadísticas de educación');
  try {
    const response = await api.get(`/profiles/${profileId}/education/stats`);

    console.log('✅ Education stats retrieved');
    console.log('   Total:', response.data.data.stats.total);
    console.log('   Visible:', response.data.data.stats.visible);
    console.log('   Current:', response.data.data.stats.current);
    console.log('   Completed:', response.data.data.stats.completed);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 15: Estadísticas de experiencia
 */
async function testExperienceStats() {
  console.log('\n📋 Test 15: Estadísticas de experiencia');
  try {
    const response = await api.get(`/profiles/${profileId}/experience/stats`);

    console.log('✅ Experience stats retrieved');
    console.log('   Total:', response.data.data.stats.total);
    console.log('   Visible:', response.data.data.stats.visible);
    console.log('   Current:', response.data.data.stats.current);
    console.log('   Total Experience:', response.data.data.stats.totalExperience.formatted);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 16: Eliminar educación
 */
async function testDeleteEducation() {
  console.log('\n📋 Test 16: Eliminar educación');
  try {
    await api.delete(`/profiles/${profileId}/education/${educationId1}`);
    console.log('✅ Education deleted:', educationId1);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 17: Eliminar experiencia
 */
async function testDeleteExperience() {
  console.log('\n📋 Test 17: Eliminar experiencia');
  try {
    await api.delete(`/profiles/${profileId}/experience/${experienceId1}`);
    console.log('✅ Experience deleted:', experienceId1);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Ejecutar todos los tests
 */
async function runAllTests() {
  console.log('🚀 Iniciando tests de Fase 3 - Education & Experience\n');
  console.log('='.repeat(60));

  const results = { passed: 0, failed: 0 };

  if (!(await testLogin())) {
    console.log('\n❌ Login falló. No se pueden ejecutar los demás tests.');
    return;
  }
  results.passed++;

  const tests = [
    testGetOrCreateProfile,
    testCreateEducation1,
    testCreateEducation2,
    testGetAllEducations,
    testUpdateEducation,
    testCreateExperience1,
    testCreateExperience2,
    testGetAllExperiences,
    testReorderEducations,
    testReorderExperiences,
    testToggleEducationVisibility,
    testToggleExperienceVisibility,
    testEducationStats,
    testExperienceStats,
    testDeleteEducation,
    testDeleteExperience
  ];

  for (const test of tests) {
    const success = await test();
    if (success) results.passed++;
    else results.failed++;
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE TESTS - FASE 3');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Total: ${results.passed + results.failed}`);
  console.log(`🎯 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  console.log('='.repeat(60));
}

runAllTests().catch(error => {
  console.error('❌ Error ejecutando tests:', error);
  process.exit(1);
});
