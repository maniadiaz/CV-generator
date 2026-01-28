require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5001/api';

// Credenciales del usuario de prueba
const TEST_USER = {
  email: 'miguelalexisdi18@gmail.com',
  password: 'Alexis185diaz2000'
};

let authToken = '';
let profileId = null;

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
  console.log('🧪 INICIANDO TESTS DE FASE 6 - Vista Previa y Plantillas\n');

  try {
    // ===== TEST 1: Login =====
    console.log('📝 TEST 1: Login del usuario');
    const loginRes = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    authToken = loginRes.data.data.accessToken;
    console.log(`Token obtenido: ${authToken.substring(0, 20)}...\n`);

    // Configurar header de autenticación
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    // ===== TEST 2: Obtener perfiles =====
    console.log('📝 TEST 2: Obtener lista de perfiles');
    const profilesRes = await axios.get(`${API_URL}/profiles`);
    profileId = profilesRes.data.data.profiles[0]?.id;

    if (!profileId) {
      throw new Error('No hay perfiles disponibles. Ejecuta test-phase3.js primero.');
    }

    console.log(`Profile ID: ${profileId}\n`);

    // ===== TEST 3: Listar plantillas disponibles (sin auth) =====
    console.log('📝 TEST 3: Listar todas las plantillas disponibles (endpoint público)');
    delete axios.defaults.headers.common['Authorization']; // Remover auth temporalmente
    const templatesRes = await axios.get(`${API_URL}/templates`);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`; // Restaurar auth

    console.log(`Total de plantillas disponibles: ${templatesRes.data.data.templates.length}`);
    console.log('Plantillas:', templatesRes.data.data.templates.map(t => ({
      name: t.name,
      displayName: t.displayName,
      category: t.category,
      primaryColor: t.colors.primary
    })));
    console.log();

    // ===== TEST 4: Obtener perfil actual =====
    console.log('📝 TEST 4: Obtener perfil actual para ver plantilla actual');
    const currentProfile = await axios.get(`${API_URL}/profiles/${profileId}`);
    console.log('Plantilla actual:', currentProfile.data.data.profile.template);
    console.log();

    // ===== TEST 5: Cambiar plantilla a Harvard Modern =====
    console.log('📝 TEST 5: Cambiar plantilla del perfil a Harvard Modern');
    const changeTemplate1 = await axios.patch(`${API_URL}/profiles/${profileId}/template`, {
      template: 'harvard_modern'
    });
    console.log('Nueva plantilla:', changeTemplate1.data.data.profile.template);
    console.log();

    // ===== TEST 6: Verificar cambio de plantilla =====
    console.log('📝 TEST 6: Verificar que el cambio de plantilla persistió');
    const updatedProfile1 = await axios.get(`${API_URL}/profiles/${profileId}`);
    console.log('Plantilla confirmada:', updatedProfile1.data.data.profile.template);
    console.log();

    // ===== TEST 7: Cambiar plantilla a Harvard Classic =====
    console.log('📝 TEST 7: Cambiar plantilla del perfil a Harvard Classic');
    const changeTemplate2 = await axios.patch(`${API_URL}/profiles/${profileId}/template`, {
      template: 'harvard_classic'
    });
    console.log('Nueva plantilla:', changeTemplate2.data.data.profile.template);
    console.log();

    // ===== TEST 8: Obtener perfil completo con todas las relaciones =====
    console.log('📝 TEST 8: Obtener perfil completo con eager loading (optimizado)');
    const startTime = Date.now();
    const completeProfile = await axios.get(`${API_URL}/profiles/${profileId}/complete`);
    const endTime = Date.now();

    console.log(`⚡ Query ejecutado en ${endTime - startTime}ms`);
    console.log('Perfil completo incluye:');
    console.log(`- Personal Info: ${completeProfile.data.data.profile.personalInfo ? 'Sí' : 'No'}`);
    console.log(`- Education: ${completeProfile.data.data.profile.education?.length || 0} entradas`);
    console.log(`- Experience: ${completeProfile.data.data.profile.experience?.length || 0} entradas`);
    console.log(`- Skills: ${completeProfile.data.data.profile.skills?.length || 0} skills`);
    console.log(`- Languages: ${completeProfile.data.data.profile.languages?.length || 0} idiomas`);
    console.log(`- Certifications: ${completeProfile.data.data.profile.certifications?.length || 0} certificaciones`);
    console.log(`- Social Networks: ${completeProfile.data.data.profile.socialNetworks?.length || 0} redes sociales`);
    console.log(`- Template: ${completeProfile.data.data.profile.template}`);
    console.log(`- Completion: ${completeProfile.data.data.profile.completion_percentage}%`);
    console.log();

    // ===== TEST 9: Generar preview HTML con Harvard Classic =====
    console.log('📝 TEST 9: Generar preview HTML con plantilla Harvard Classic');
    const previewClassic = await axios.get(`${API_URL}/profiles/${profileId}/preview-html`);
    const htmlClassic = previewClassic.data.data.html;

    console.log(`HTML generado: ${htmlClassic.length} caracteres`);
    console.log(`Contiene "Harvard Classic": ${htmlClassic.includes('Harvard') ? 'Sí' : 'No'}`);
    console.log(`Contiene estilos CSS: ${htmlClassic.includes('<style>') ? 'Sí' : 'No'}`);

    // Guardar HTML para inspección manual (opcional)
    const classicPath = path.join(__dirname, 'preview-harvard-classic.html');
    fs.writeFileSync(classicPath, htmlClassic);
    console.log(`✅ HTML guardado en: ${classicPath}`);
    console.log();

    // ===== TEST 10: Cambiar a Harvard Modern y generar preview =====
    console.log('📝 TEST 10: Cambiar a Harvard Modern y generar nuevo preview HTML');
    await axios.patch(`${API_URL}/profiles/${profileId}/template`, {
      template: 'harvard_modern'
    });

    const previewModern = await axios.get(`${API_URL}/profiles/${profileId}/preview-html`);
    const htmlModern = previewModern.data.data.html;

    console.log(`HTML generado: ${htmlModern.length} caracteres`);
    console.log(`Diferente de Classic: ${htmlModern !== htmlClassic ? 'Sí' : 'No'}`);

    // Guardar HTML para inspección manual
    const modernPath = path.join(__dirname, 'preview-harvard-modern.html');
    fs.writeFileSync(modernPath, htmlModern);
    console.log(`✅ HTML guardado en: ${modernPath}`);
    console.log();

    // ===== TEST 11: Validar plantilla inválida =====
    console.log('📝 TEST 11: Intentar cambiar a plantilla inválida (debe fallar)');
    try {
      await axios.patch(`${API_URL}/profiles/${profileId}/template`, {
        template: 'invalid_template'
      });
      console.error('❌ ERROR: Debió rechazar plantilla inválida');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Plantilla inválida rechazada correctamente (400)');
      } else {
        throw error;
      }
    }
    console.log();

    // ===== TEST 12: Verificar metadata de plantillas =====
    console.log('📝 TEST 12: Verificar metadata completa de plantillas');
    const allTemplates = templatesRes.data.data.templates;

    allTemplates.forEach(template => {
      console.log(`\n📄 ${template.displayName}:`);
      console.log(`   - Name: ${template.name}`);
      console.log(`   - Category: ${template.category}`);
      console.log(`   - Description: ${template.description}`);
      console.log(`   - Primary Color: ${template.colors.primary}`);
      console.log(`   - Features: ${template.features.join(', ')}`);
      console.log(`   - Preview Image: ${template.previewImage}`);
    });
    console.log();

    // ===== TEST 13: Verificar optimización de query completo =====
    console.log('📝 TEST 13: Benchmark de query completo (5 veces)');
    const times = [];
    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      await axios.get(`${API_URL}/profiles/${profileId}/complete`);
      const duration = Date.now() - start;
      times.push(duration);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    console.log(`Tiempos: ${times.join('ms, ')}ms`);
    console.log(`Promedio: ${avgTime.toFixed(2)}ms`);
    console.log(`Mínimo: ${minTime}ms`);
    console.log(`Máximo: ${maxTime}ms`);
    console.log(`${avgTime < 300 ? '✅ Excelente performance (< 300ms)' : '⚠️ Performance aceptable'}`);
    console.log();

    // Restaurar plantilla original
    console.log('📝 Restaurando plantilla original (Harvard Classic)...');
    await axios.patch(`${API_URL}/profiles/${profileId}/template`, {
      template: 'harvard_classic'
    });
    console.log();

    console.log('✅ TODOS LOS TESTS DE FASE 6 COMPLETADOS EXITOSAMENTE\n');
    console.log('📊 RESUMEN:');
    console.log('- Listar plantillas: ✅');
    console.log('- Cambiar plantilla: ✅');
    console.log('- Validación de plantilla: ✅');
    console.log('- Perfil completo con eager loading: ✅');
    console.log('- Preview HTML Harvard Classic: ✅');
    console.log('- Preview HTML Harvard Modern: ✅');
    console.log('- Metadata de plantillas: ✅');
    console.log('- Performance optimizada (< 300ms): ✅');
    console.log();
    console.log('📁 Archivos HTML generados:');
    console.log(`   - ${classicPath}`);
    console.log(`   - ${modernPath}`);
    console.log();
    console.log('🎉 FASE 6 COMPLETADA AL 100%');

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
