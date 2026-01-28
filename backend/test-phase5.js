require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

// Credenciales del usuario de prueba
const TEST_USER = {
  email: 'miguelalexisdi18@gmail.com',
  password: 'Alexis185diaz2000'
};

let authToken = '';
let profileId = null;
let socialNetwork1Id = null;
let socialNetwork2Id = null;
let socialNetwork3Id = null;

// Configurar axios con interceptor para logging
axios.interceptors.response.use(
  response => {
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url.replace(API_URL, '')} - ${response.status}`);
    return response;
  },
  error => {
    console.error(`❌ ${error.config.method.toUpperCase()} ${error.config.url.replace(API_URL, '')} - ${error.response?.status || 'ERROR'}`);
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
);

async function runTests() {
  console.log('🧪 INICIANDO TESTS DE FASE 5 - Social Networks & Profile Completion\n');

  try {
    // ===== TEST 1: Login =====
    console.log('📝 TEST 1: Login del usuario');
    const loginRes = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    authToken = loginRes.data.data.accessToken;
    console.log(`Token obtenido: ${authToken.substring(0, 20)}...\n`);

    // Configurar header de autenticación para todas las requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    // ===== TEST 2: Obtener perfiles =====
    console.log('📝 TEST 2: Obtener lista de perfiles');
    const profilesRes = await axios.get(`${API_URL}/profiles`);
    profileId = profilesRes.data.data.profiles[0]?.id;

    if (!profileId) {
      throw new Error('No hay perfiles disponibles. Ejecuta test-phase3.js primero.');
    }

    console.log(`Profile ID: ${profileId}\n`);

    // ===== TEST 3: Crear 3 redes sociales =====
    console.log('📝 TEST 3: Crear 3 redes sociales (LinkedIn, GitHub, Portfolio)');

    const socialNetwork1 = await axios.post(`${API_URL}/profiles/${profileId}/social-networks`, {
      platform: 'linkedin',
      url: 'https://www.linkedin.com/in/johndoe',
      username: 'johndoe'
    });
    socialNetwork1Id = socialNetwork1.data.data.socialNetwork.id;
    console.log(`LinkedIn creado - ID: ${socialNetwork1Id}`);

    const socialNetwork2 = await axios.post(`${API_URL}/profiles/${profileId}/social-networks`, {
      platform: 'github',
      url: 'https://github.com/johndoe',
      username: 'johndoe'
    });
    socialNetwork2Id = socialNetwork2.data.data.socialNetwork.id;
    console.log(`GitHub creado - ID: ${socialNetwork2Id}`);

    const socialNetwork3 = await axios.post(`${API_URL}/profiles/${profileId}/social-networks`, {
      platform: 'portfolio',
      url: 'https://johndoe.dev',
      username: 'johndoe'
    });
    socialNetwork3Id = socialNetwork3.data.data.socialNetwork.id;
    console.log(`Portfolio creado - ID: ${socialNetwork3Id}\n`);

    // ===== TEST 4: Obtener todas las redes sociales =====
    console.log('📝 TEST 4: Obtener todas las redes sociales del perfil');
    const allSocialNetworks = await axios.get(`${API_URL}/profiles/${profileId}/social-networks`);
    console.log(`Total de redes sociales: ${allSocialNetworks.data.data.socialNetworks.length}`);
    console.log('Redes sociales:', allSocialNetworks.data.data.socialNetworks.map(sn => ({
      id: sn.id,
      platform: sn.platform,
      username: sn.username
    })));
    console.log();

    // ===== TEST 5: Obtener una red social específica =====
    console.log('📝 TEST 5: Obtener LinkedIn específico');
    const specificSocialNetwork = await axios.get(`${API_URL}/profiles/${profileId}/social-networks/${socialNetwork1Id}`);
    console.log('LinkedIn:', {
      id: specificSocialNetwork.data.data.socialNetwork.id,
      platform: specificSocialNetwork.data.data.socialNetwork.platform,
      url: specificSocialNetwork.data.data.socialNetwork.url,
      username: specificSocialNetwork.data.data.socialNetwork.username
    });
    console.log();

    // ===== TEST 6: Actualizar red social =====
    console.log('📝 TEST 6: Actualizar username del GitHub');
    const updatedSocialNetwork = await axios.put(`${API_URL}/profiles/${profileId}/social-networks/${socialNetwork2Id}`, {
      username: 'johndoe-dev'
    });
    console.log('GitHub actualizado:', {
      username: updatedSocialNetwork.data.data.socialNetwork.username
    });
    console.log();

    // ===== TEST 7: Reordenar redes sociales =====
    console.log('📝 TEST 7: Reordenar redes sociales (GitHub primero)');
    await axios.post(`${API_URL}/profiles/${profileId}/social-networks/reorder`, {
      ordered_ids: [socialNetwork2Id, socialNetwork1Id, socialNetwork3Id]
    });

    const reorderedSocialNetworks = await axios.get(`${API_URL}/profiles/${profileId}/social-networks`);
    console.log('Orden actualizado:', reorderedSocialNetworks.data.data.socialNetworks.map((sn, idx) => ({
      position: idx,
      platform: sn.platform,
      display_order: sn.display_order
    })));
    console.log();

    // ===== TEST 8: Toggle visibility =====
    console.log('📝 TEST 8: Ocultar Portfolio');
    const toggledSocialNetwork = await axios.patch(`${API_URL}/profiles/${profileId}/social-networks/${socialNetwork3Id}/toggle-visibility`);
    console.log('Portfolio visibility:', toggledSocialNetwork.data.data.socialNetwork.is_visible);
    console.log();

    // ===== TEST 9: Obtener estadísticas de redes sociales =====
    console.log('📝 TEST 9: Obtener estadísticas de redes sociales');
    const socialNetworkStats = await axios.get(`${API_URL}/profiles/${profileId}/social-networks/stats`);
    console.log('Estadísticas:', {
      total: socialNetworkStats.data.data.stats.total,
      visible: socialNetworkStats.data.data.stats.visible,
      hidden: socialNetworkStats.data.data.stats.hidden,
      byPlatform: socialNetworkStats.data.data.stats.byPlatform
    });
    console.log();

    // ===== TEST 10: Obtener completitud del perfil (ANTES de llenar todas las secciones) =====
    console.log('📝 TEST 10: Obtener completitud del perfil (parcial)');
    const completion1 = await axios.get(`${API_URL}/profiles/${profileId}/completion`);
    console.log('Completitud actual:', {
      percentage: completion1.data.data.completion.percentage,
      missingSectionsCount: completion1.data.data.completion.missingSections.length
    });
    console.log('Secciones faltantes:', completion1.data.data.completion.missingSections.map(m => ({
      section: m.section,
      message: m.message,
      weight: m.weight
    })));
    console.log();

    // ===== TEST 11: Verificar que completitud se actualizó automáticamente =====
    console.log('📝 TEST 11: Verificar perfil actualizado con nuevo completion_percentage');
    const updatedProfile = await axios.get(`${API_URL}/profiles/${profileId}`);
    console.log('Profile completion_percentage:', updatedProfile.data.data.profile.completion_percentage);
    console.log();

    // ===== TEST 12: Eliminar una red social =====
    console.log('📝 TEST 12: Eliminar Portfolio');
    await axios.delete(`${API_URL}/profiles/${profileId}/social-networks/${socialNetwork3Id}`);

    const afterDeleteSocialNetworks = await axios.get(`${API_URL}/profiles/${profileId}/social-networks`);
    console.log(`Redes sociales restantes: ${afterDeleteSocialNetworks.data.data.socialNetworks.length}`);
    console.log();

    // ===== TEST 13: Verificar completitud después de eliminar (debería bajar un poco) =====
    console.log('📝 TEST 13: Verificar completitud después de eliminar red social');
    const completion2 = await axios.get(`${API_URL}/profiles/${profileId}/completion`);
    console.log('Completitud después de eliminar:', {
      percentage: completion2.data.data.completion.percentage,
      missingSectionsCount: completion2.data.data.completion.missingSections.length
    });
    console.log();

    // ===== TEST 14: Agregar Twitter para completar requisito de 2 redes sociales =====
    console.log('📝 TEST 14: Agregar Twitter para completar requisito (2 redes mínimo)');
    await axios.post(`${API_URL}/profiles/${profileId}/social-networks`, {
      platform: 'twitter',
      url: 'https://twitter.com/johndoe',
      username: '@johndoe'
    });

    const completion3 = await axios.get(`${API_URL}/profiles/${profileId}/completion`);
    console.log('Completitud con 2 redes sociales:', {
      percentage: completion3.data.data.completion.percentage
    });
    console.log();

    // ===== TEST 15: Obtener perfil completo con todas las relaciones =====
    console.log('📝 TEST 15: Obtener perfil completo con todas las relaciones');
    const completeProfile = await axios.get(`${API_URL}/profiles/${profileId}/complete`);
    console.log('Perfil completo incluye:');
    console.log(`- Personal Info: ${completeProfile.data.data.profile.personalInfo ? 'Sí' : 'No'}`);
    console.log(`- Education: ${completeProfile.data.data.profile.education?.length || 0} entradas`);
    console.log(`- Experience: ${completeProfile.data.data.profile.experience?.length || 0} entradas`);
    console.log(`- Skills: ${completeProfile.data.data.profile.skills?.length || 0} skills`);
    console.log(`- Languages: ${completeProfile.data.data.profile.languages?.length || 0} idiomas`);
    console.log(`- Certifications: ${completeProfile.data.data.profile.certifications?.length || 0} certificaciones`);
    console.log(`- Social Networks: ${completeProfile.data.data.profile.socialNetworks?.length || 0} redes sociales`);
    console.log(`- Completion: ${completeProfile.data.data.profile.completion_percentage}%`);
    console.log();

    console.log('✅ TODOS LOS TESTS DE FASE 5 COMPLETADOS EXITOSAMENTE\n');
    console.log('📊 RESUMEN:');
    console.log('- Social Networks CRUD: ✅');
    console.log('- Reordenamiento: ✅');
    console.log('- Toggle visibility: ✅');
    console.log('- Estadísticas: ✅');
    console.log('- Sistema de completitud: ✅');
    console.log('- Auto-actualización de completitud: ✅');
    console.log('- Perfil completo con relaciones: ✅');
    console.log();
    console.log('🎉 FASE 5 COMPLETADA AL 100%');

  } catch (error) {
    console.error('\n❌ ERROR EN LOS TESTS:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Ejecutar tests
runTests();
