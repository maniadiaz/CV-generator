/**
 * Script de prueba para verificar que el PDF se envía como binario
 * Uso: node test-pdf-binary.js
 */

const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:5001';
const TEST_EMAIL = 'miguelalexisdi18@gmail.com';
const TEST_PASSWORD = 'Password123!';

async function testPdfBinary() {
  console.log('🧪 Probando envío de PDF como binario...\n');

  try {
    // 1. Login
    console.log('🔐 1. Haciendo login...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso\n');

    // 2. Obtener perfil para export
    console.log('📋 2. Obteniendo perfil...');
    const profileResponse = await axios.get(`${API_URL}/api/profiles`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!profileResponse.data.data.profiles.length) {
      console.log('❌ No hay perfiles para probar');
      return;
    }

    const profileId = profileResponse.data.data.profiles[0].id;
    console.log(`✅ Perfil obtenido: ID ${profileId}\n`);

    // 3. Exportar PDF
    console.log('📄 3. Exportando PDF...');
    const pdfResponse = await axios.get(
      `${API_URL}/api/profiles/${profileId}/pdf/export-pdf`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer' // Importante: recibir como arraybuffer
      }
    );

    console.log('✅ PDF recibido\n');

    // 4. Verificar que es binario
    console.log('🔍 4. Verificando formato...');
    const contentType = pdfResponse.headers['content-type'];
    const contentLength = pdfResponse.headers['content-length'];
    const data = pdfResponse.data;

    console.log(`   Content-Type: ${contentType}`);
    console.log(`   Content-Length: ${contentLength} bytes`);
    console.log(`   Tipo de datos: ${data.constructor.name}`);
    console.log(`   Tamaño real: ${data.byteLength || data.length} bytes`);

    // Verificar que es un Buffer/ArrayBuffer y no JSON
    const isBuffer = Buffer.isBuffer(data) || data instanceof ArrayBuffer;
    const isValidPDF = data[0] === 0x25 && data[1] === 0x50 && data[2] === 0x44 && data[3] === 0x46; // %PDF

    console.log(`   ¿Es Buffer/ArrayBuffer?: ${isBuffer ? '✅ Sí' : '❌ No'}`);
    console.log(`   ¿Inicia con %PDF?: ${isValidPDF ? '✅ Sí' : '❌ No'}`);

    if (!isBuffer) {
      console.log('\n❌ ERROR: El PDF se está enviando como JSON en lugar de binario');
      console.log('   Primeros bytes:', JSON.stringify(data).substring(0, 100));
      return;
    }

    if (!isValidPDF) {
      console.log('\n❌ ERROR: El contenido no es un PDF válido');
      console.log('   Primeros bytes:', Array.from(data.slice(0, 20)));
      return;
    }

    // 5. Guardar archivo para verificar
    const outputPath = `./test-pdf-output-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, Buffer.from(data));
    console.log(`\n✅ PDF guardado en: ${outputPath}`);

    // 6. Verificar tamaño del archivo
    const stats = fs.statSync(outputPath);
    console.log(`   Tamaño del archivo: ${stats.size} bytes`);

    console.log('\n✨ PRUEBA EXITOSA: El PDF se envía correctamente como binario');

  } catch (error) {
    console.log('\n❌ ERROR EN LA PRUEBA:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Content-Type: ${error.response.headers['content-type']}`);

      // Si la respuesta es JSON, mostrarla
      if (error.response.headers['content-type']?.includes('application/json')) {
        console.log('   Respuesta JSON:', error.response.data);
      }
    } else {
      console.log('   Mensaje:', error.message);
    }
  }
}

// Ejecutar
testPdfBinary().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
