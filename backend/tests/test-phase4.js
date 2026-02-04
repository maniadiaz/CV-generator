const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let accessToken = '';
let profileId = '';
let skillId1 = '';
let skillId2 = '';
let skillId3 = '';
let languageId1 = '';
let languageId2 = '';
let certificationId1 = '';
let certificationId2 = '';

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
        name: 'CV Test Fase 4',
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
 * Test 3: Crear primer skill (JavaScript - programming_languages)
 */
async function testCreateSkill1() {
  console.log('\n📋 Test 3: Crear primer skill (JavaScript)');
  try {
    const response = await api.post(`/profiles/${profileId}/skills`, {
      name: 'JavaScript',
      category: 'programming_languages',
      proficiency_level: 'expert',
      years_of_experience: 5
    });

    skillId1 = response.data.data.skill.id;
    console.log('✅ Skill 1 created:', skillId1);
    console.log('   Name:', response.data.data.skill.name);
    console.log('   Category:', response.data.data.skill.category);
    console.log('   Proficiency:', response.data.data.skill.proficiency_level);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 4: Crear segundo skill (React - frameworks_libraries)
 */
async function testCreateSkill2() {
  console.log('\n📋 Test 4: Crear segundo skill (React)');
  try {
    const response = await api.post(`/profiles/${profileId}/skills`, {
      name: 'React',
      category: 'frameworks_libraries',
      proficiency_level: 'advanced',
      years_of_experience: 4
    });

    skillId2 = response.data.data.skill.id;
    console.log('✅ Skill 2 created:', skillId2);
    console.log('   Name:', response.data.data.skill.name);
    console.log('   Category:', response.data.data.skill.category);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 5: Crear tercer skill (PostgreSQL - databases)
 */
async function testCreateSkill3() {
  console.log('\n📋 Test 5: Crear tercer skill (PostgreSQL)');
  try {
    const response = await api.post(`/profiles/${profileId}/skills`, {
      name: 'PostgreSQL',
      category: 'databases',
      proficiency_level: 'advanced',
      years_of_experience: 3
    });

    skillId3 = response.data.data.skill.id;
    console.log('✅ Skill 3 created:', skillId3);
    console.log('   Name:', response.data.data.skill.name);
    console.log('   Category:', response.data.data.skill.category);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 6: Crear primer language (Español - native)
 */
async function testCreateLanguage1() {
  console.log('\n📋 Test 6: Crear primer language (Español)');
  try {
    const response = await api.post(`/profiles/${profileId}/languages`, {
      name: 'Español',
      proficiency_level: 'native',
      can_read: true,
      can_write: true,
      can_speak: true
    });

    languageId1 = response.data.data.language.id;
    console.log('✅ Language 1 created:', languageId1);
    console.log('   Name:', response.data.data.language.name);
    console.log('   Proficiency:', response.data.data.language.proficiency_level);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 7: Crear segundo language (English - fluent)
 */
async function testCreateLanguage2() {
  console.log('\n📋 Test 7: Crear segundo language (English)');
  try {
    const response = await api.post(`/profiles/${profileId}/languages`, {
      name: 'English',
      proficiency_level: 'fluent',
      cefr_level: 'C1',
      can_read: true,
      can_write: true,
      can_speak: true
    });

    languageId2 = response.data.data.language.id;
    console.log('✅ Language 2 created:', languageId2);
    console.log('   Name:', response.data.data.language.name);
    console.log('   Proficiency:', response.data.data.language.proficiency_level);
    console.log('   CEFR Level:', response.data.data.language.cefr_level);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 8: Crear primera certification (sin expiración)
 */
async function testCreateCertification1() {
  console.log('\n📋 Test 8: Crear primera certification (sin expiración)');
  try {
    const response = await api.post(`/profiles/${profileId}/certifications`, {
      name: 'AWS Certified Solutions Architect',
      issuing_organization: 'Amazon Web Services',
      issue_date: '2023-01-15',
      does_not_expire: true,
      credential_id: 'AWS-CSA-2023-12345',
      credential_url: 'https://aws.amazon.com/verification/12345',
      description: 'Professional level certification for designing distributed systems on AWS'
    });

    certificationId1 = response.data.data.certification.id;
    console.log('✅ Certification 1 created:', certificationId1);
    console.log('   Name:', response.data.data.certification.name);
    console.log('   Organization:', response.data.data.certification.issuing_organization);
    console.log('   Does Not Expire:', response.data.data.certification.does_not_expire);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 9: Crear segunda certification (con expiration_date)
 */
async function testCreateCertification2() {
  console.log('\n📋 Test 9: Crear segunda certification (con expiración)');
  try {
    const response = await api.post(`/profiles/${profileId}/certifications`, {
      name: 'Professional Scrum Master I',
      issuing_organization: 'Scrum.org',
      issue_date: '2024-06-01',
      expiration_date: '2026-06-01',
      does_not_expire: false,
      credential_id: 'PSM-I-456789',
      description: 'Certification demonstrating understanding of Scrum framework'
    });

    certificationId2 = response.data.data.certification.id;
    console.log('✅ Certification 2 created:', certificationId2);
    console.log('   Name:', response.data.data.certification.name);
    console.log('   Expiration Date:', response.data.data.certification.expiration_date);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 10: Obtener todos los skills
 */
async function testGetAllSkills() {
  console.log('\n📋 Test 10: Obtener todos los skills');
  try {
    const response = await api.get(`/profiles/${profileId}/skills`);

    console.log('✅ Skills retrieved:', response.data.data.count);
    response.data.data.skills.forEach((skill, i) => {
      console.log(`   ${i + 1}. ${skill.name} - ${skill.category} (${skill.proficiency_level})`);
    });
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 11: Obtener todos los languages
 */
async function testGetAllLanguages() {
  console.log('\n📋 Test 11: Obtener todos los languages');
  try {
    const response = await api.get(`/profiles/${profileId}/languages`);

    console.log('✅ Languages retrieved:', response.data.data.count);
    response.data.data.languages.forEach((lang, i) => {
      console.log(`   ${i + 1}. ${lang.name} - ${lang.proficiency_level}${lang.cefr_level ? ` (${lang.cefr_level})` : ''}`);
    });
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 12: Obtener todas las certifications
 */
async function testGetAllCertifications() {
  console.log('\n📋 Test 12: Obtener todas las certifications');
  try {
    const response = await api.get(`/profiles/${profileId}/certifications`);

    console.log('✅ Certifications retrieved:', response.data.data.count);
    response.data.data.certifications.forEach((cert, i) => {
      console.log(`   ${i + 1}. ${cert.name} - ${cert.issuing_organization}`);
    });
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 13: Actualizar un skill
 */
async function testUpdateSkill() {
  console.log('\n📋 Test 13: Actualizar skill (JavaScript)');
  try {
    const response = await api.put(`/profiles/${profileId}/skills/${skillId1}`, {
      proficiency_level: 'expert',
      years_of_experience: 6
    });

    console.log('✅ Skill updated');
    console.log('   New Years of Experience:', response.data.data.skill.years_of_experience);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 14: Reordenar skills de categoría programming_languages
 */
async function testReorderSkills() {
  console.log('\n📋 Test 14: Reordenar skills');
  try {
    // Obtener todos los skills primero para tener todos los IDs
    const getResponse = await api.get(`/profiles/${profileId}/skills`);
    const allSkillIds = getResponse.data.data.skills.map(s => s.id);

    // Invertir el orden
    const reversedIds = [...allSkillIds].reverse();

    const response = await api.post(`/profiles/${profileId}/skills/reorder`, {
      ordered_ids: reversedIds
    });

    console.log('✅ Skills reordered');

    // Verificar nuevo orden
    const verify = await api.get(`/profiles/${profileId}/skills`);
    console.log('   New order:');
    verify.data.data.skills.forEach((skill, i) => {
      console.log(`   ${i + 1}. ${skill.name} (Order: ${skill.display_order})`);
    });
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 15: Toggle visibility de un language
 */
async function testToggleLanguageVisibility() {
  console.log('\n📋 Test 15: Toggle visibility de language');
  try {
    const response = await api.patch(`/profiles/${profileId}/languages/${languageId1}/toggle-visibility`);

    console.log('✅ Language visibility toggled');
    console.log('   Is Visible:', response.data.data.language.is_visible);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 16: Estadísticas de skills
 */
async function testSkillsStats() {
  console.log('\n📋 Test 16: Estadísticas de skills');
  try {
    const response = await api.get(`/profiles/${profileId}/skills/stats`);

    console.log('✅ Skills stats retrieved');
    console.log('   Total:', response.data.data.stats.total);
    console.log('   Visible:', response.data.data.stats.visible);
    if (response.data.data.stats.byCategory) {
      console.log('   By Category:');
      Object.entries(response.data.data.stats.byCategory).forEach(([cat, count]) => {
        console.log(`     - ${cat}: ${count}`);
      });
    }
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 17: Estadísticas de languages
 */
async function testLanguagesStats() {
  console.log('\n📋 Test 17: Estadísticas de languages');
  try {
    const response = await api.get(`/profiles/${profileId}/languages/stats`);

    console.log('✅ Languages stats retrieved');
    console.log('   Total:', response.data.data.stats.total);
    console.log('   Visible:', response.data.data.stats.visible);
    if (response.data.data.stats.byProficiency) {
      console.log('   By Proficiency:');
      Object.entries(response.data.data.stats.byProficiency).forEach(([level, count]) => {
        console.log(`     - ${level}: ${count}`);
      });
    }
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 18: Estadísticas de certifications
 */
async function testCertificationsStats() {
  console.log('\n📋 Test 18: Estadísticas de certifications');
  try {
    const response = await api.get(`/profiles/${profileId}/certifications/stats`);

    console.log('✅ Certifications stats retrieved');
    console.log('   Total:', response.data.data.stats.total);
    console.log('   Visible:', response.data.data.stats.visible);
    console.log('   Active:', response.data.data.stats.active || 'N/A');
    console.log('   Expired:', response.data.data.stats.expired || 'N/A');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 19: Eliminar un skill
 */
async function testDeleteSkill() {
  console.log('\n📋 Test 19: Eliminar skill');
  try {
    await api.delete(`/profiles/${profileId}/skills/${skillId3}`);
    console.log('✅ Skill deleted:', skillId3);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test 20: Eliminar una certification
 */
async function testDeleteCertification() {
  console.log('\n📋 Test 20: Eliminar certification');
  try {
    await api.delete(`/profiles/${profileId}/certifications/${certificationId2}`);
    console.log('✅ Certification deleted:', certificationId2);
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
  console.log('🚀 Iniciando tests de Fase 4 - Skills, Languages & Certifications\n');
  console.log('='.repeat(60));

  const results = { passed: 0, failed: 0 };

  if (!(await testLogin())) {
    console.log('\n❌ Login falló. No se pueden ejecutar los demás tests.');
    return;
  }
  results.passed++;

  const tests = [
    testGetOrCreateProfile,
    testCreateSkill1,
    testCreateSkill2,
    testCreateSkill3,
    testCreateLanguage1,
    testCreateLanguage2,
    testCreateCertification1,
    testCreateCertification2,
    testGetAllSkills,
    testGetAllLanguages,
    testGetAllCertifications,
    testUpdateSkill,
    testReorderSkills,
    testToggleLanguageVisibility,
    testSkillsStats,
    testLanguagesStats,
    testCertificationsStats,
    testDeleteSkill,
    testDeleteCertification
  ];

  for (const test of tests) {
    const success = await test();
    if (success) results.passed++;
    else results.failed++;
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE TESTS - FASE 4');
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
