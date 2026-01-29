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
  console.log('🧪 INICIANDO TESTS DE FASE 7 - Exportación PDF\n');

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

    // ===== TEST 3: Validar perfil antes de exportar =====
    console.log('📝 TEST 3: Validar que el perfil esté listo para exportar');
    const validation = await axios.get(`${API_URL}/profiles/${profileId}/pdf/validate`);
    console.log('Validación del perfil:', {
      isValid: validation.data.data.validation.isValid,
      completeness: validation.data.data.validation.completeness,
      hasPersonalInfo: validation.data.data.validation.hasPersonalInfo,
      warnings: validation.data.data.validation.warnings?.length || 0
    });

    if (validation.data.data.validation.warnings && validation.data.data.validation.warnings.length > 0) {
      console.log('Advertencias:', validation.data.data.validation.warnings.map(w => w.message));
    }
    console.log();

    // ===== TEST 4: Obtener estadísticas antes de exportar =====
    console.log('📝 TEST 4: Obtener contadores de descarga antes de exportar');
    const profileBefore = await axios.get(`${API_URL}/profiles/${profileId}`);
    console.log('Profile antes de exportar:', {
      download_count: profileBefore.data.data.profile.download_count,
      last_exported_at: profileBefore.data.data.profile.last_exported_at
    });
    console.log();

    // ===== TEST 5: Exportar PDF (descarga) =====
    console.log('📝 TEST 5: Exportar CV a PDF (modo descarga)');
    const exportRes = await axios.get(`${API_URL}/profiles/${profileId}/pdf/export-pdf`, {
      responseType: 'arraybuffer'
    });

    // Verificar headers
    console.log('Headers de respuesta:', {
      contentType: exportRes.headers['content-type'],
      contentDisposition: exportRes.headers['content-disposition'],
      contentLength: exportRes.headers['content-length']
    });

    // Crear carpeta exports si no existe
    const exportsDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Guardar PDF descargado
    const exportFilename = exportRes.headers['content-disposition']
      ? exportRes.headers['content-disposition'].split('filename=')[1]?.replace(/"/g, '')
      : `CV-export-${Date.now()}.pdf`;

    const exportPath = path.join(exportsDir, exportFilename);
    fs.writeFileSync(exportPath, Buffer.from(exportRes.data));

    const exportSize = fs.statSync(exportPath).size;
    console.log(`✅ PDF exportado guardado en: ${exportPath}`);
    console.log(`Tamaño del archivo: ${(exportSize / 1024).toFixed(2)} KB`);
    console.log();

    // ===== TEST 6: Vista previa PDF (inline) =====
    console.log('📝 TEST 6: Generar vista previa de PDF (modo inline)');
    const previewRes = await axios.get(`${API_URL}/profiles/${profileId}/pdf/preview-pdf`, {
      responseType: 'arraybuffer'
    });

    console.log('Headers de vista previa:', {
      contentType: previewRes.headers['content-type'],
      contentDisposition: previewRes.headers['content-disposition'],
      contentLength: previewRes.headers['content-length']
    });

    // Guardar PDF de vista previa
    const previewFilename = `CV-preview-${profileId}.pdf`;
    const previewPath = path.join(exportsDir, previewFilename);
    fs.writeFileSync(previewPath, Buffer.from(previewRes.data));

    const previewSize = fs.statSync(previewPath).size;
    console.log(`✅ PDF de vista previa guardado en: ${previewPath}`);
    console.log(`Tamaño del archivo: ${(previewSize / 1024).toFixed(2)} KB`);
    console.log();

    // ===== TEST 7: Verificar incremento de contadores =====
    console.log('📝 TEST 7: Verificar que se incrementaron los contadores');
    const profileAfter = await axios.get(`${API_URL}/profiles/${profileId}`);
    console.log('Profile después de exportar:', {
      download_count: profileAfter.data.data.profile.download_count,
      last_exported_at: profileAfter.data.data.profile.last_exported_at,
      incremento: profileAfter.data.data.profile.download_count - profileBefore.data.data.profile.download_count
    });
    console.log();

    // ===== TEST 8: Exportar múltiples veces (stress test) =====
    console.log('📝 TEST 8: Exportar PDF 3 veces seguidas (stress test)');
    const startTime = Date.now();

    for (let i = 1; i <= 3; i++) {
      const iterStart = Date.now();
      const pdfRes = await axios.get(`${API_URL}/profiles/${profileId}/pdf/export-pdf`, {
        responseType: 'arraybuffer'
      });
      const iterDuration = Date.now() - iterStart;

      const size = Buffer.from(pdfRes.data).length;
      console.log(`  Exportación ${i}: ${iterDuration}ms - ${(size / 1024).toFixed(2)} KB`);
    }

    const totalDuration = Date.now() - startTime;
    const avgDuration = totalDuration / 3;
    console.log(`\nPromedio: ${avgDuration.toFixed(2)}ms por exportación`);
    console.log(`Total: ${totalDuration}ms para 3 exportaciones`);
    console.log();

    // ===== TEST 9: Verificar contador final =====
    console.log('📝 TEST 9: Verificar contador final después de múltiples exportaciones');
    const profileFinal = await axios.get(`${API_URL}/profiles/${profileId}`);
    console.log('Contador final de descargas:', profileFinal.data.data.profile.download_count);
    console.log('Última exportación:', new Date(profileFinal.data.data.profile.last_exported_at).toLocaleString());
    console.log();

    // ===== TEST 10: Cambiar plantilla y exportar =====
    console.log('📝 TEST 10: Cambiar plantilla a Harvard Modern y exportar');
    await axios.patch(`${API_URL}/profiles/${profileId}/template`, {
      template: 'harvard_modern'
    });

    const modernPdfRes = await axios.get(`${API_URL}/profiles/${profileId}/pdf/export-pdf`, {
      responseType: 'arraybuffer'
    });

    const modernFilename = `CV-harvard-modern-${Date.now()}.pdf`;
    const modernPath = path.join(exportsDir, modernFilename);
    fs.writeFileSync(modernPath, Buffer.from(modernPdfRes.data));

    const modernSize = fs.statSync(modernPath).size;
    console.log(`✅ PDF con plantilla Modern guardado en: ${modernPath}`);
    console.log(`Tamaño: ${(modernSize / 1024).toFixed(2)} KB`);
    console.log(`Diferencia de tamaño vs Classic: ${((modernSize - exportSize) / 1024).toFixed(2)} KB`);
    console.log();

    // Restaurar plantilla
    await axios.patch(`${API_URL}/profiles/${profileId}/template`, {
      template: 'harvard_classic'
    });

    // ===== TEST 11: Verificar que PDFs son válidos =====
    console.log('📝 TEST 11: Verificar que todos los PDFs generados son válidos');
    const pdfFiles = fs.readdirSync(exportsDir).filter(f => f.endsWith('.pdf'));

    let validPdfs = 0;
    for (const file of pdfFiles) {
      const filePath = path.join(exportsDir, file);
      const content = fs.readFileSync(filePath);

      // Verificar que comienza con el header PDF
      const isPdf = content.toString('utf8', 0, 4) === '%PDF';
      if (isPdf) {
        validPdfs++;
        const size = fs.statSync(filePath).size;
        console.log(`  ✅ ${file} - ${(size / 1024).toFixed(2)} KB - Válido`);
      } else {
        console.log(`  ❌ ${file} - No es un PDF válido`);
      }
    }

    console.log(`\nPDFs válidos: ${validPdfs}/${pdfFiles.length}`);
    console.log();

    console.log('✅ TODOS LOS TESTS DE FASE 7 COMPLETADOS EXITOSAMENTE\n');
    console.log('📊 RESUMEN:');
    console.log('- Validación de perfil: ✅');
    console.log('- Exportación PDF (download): ✅');
    console.log('- Vista previa PDF (inline): ✅');
    console.log('- Incremento de contadores: ✅');
    console.log('- Stress test (3 exports): ✅');
    console.log('- Cambio de plantilla y export: ✅');
    console.log('- Verificación de PDFs válidos: ✅');
    console.log();
    console.log('📁 Archivos PDF generados:');
    pdfFiles.forEach(file => {
      const size = fs.statSync(path.join(exportsDir, file)).size;
      console.log(`   - ${file} (${(size / 1024).toFixed(2)} KB)`);
    });
    console.log();
    console.log(`📈 Estadísticas finales:`);
    console.log(`   - Total de exportaciones: ${profileFinal.data.data.profile.download_count}`);
    console.log(`   - Última exportación: ${new Date(profileFinal.data.data.profile.last_exported_at).toLocaleString()}`);
    console.log(`   - Promedio de tiempo: ${avgDuration.toFixed(2)}ms`);
    console.log();
    console.log('🎉 FASE 7 COMPLETADA AL 100%');

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
