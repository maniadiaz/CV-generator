/**
 * Script de prueba para verificar los nuevos endpoints de categorías de skills
 * Uso: node test-skill-categories.js
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5001';
const TEST_EMAIL = 'miguelalexisdi18@gmail.com';
const TEST_PASSWORD = 'Password123!';

async function testSkillCategories() {
  console.log('🧪 Probando nuevos endpoints de categorías de skills...\n');

  try {
    // 1. Login
    console.log('🔐 1. Haciendo login...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso\n');

    // 2. Obtener perfil
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

    // 3. Probar endpoint de todas las categorías
    console.log('📂 3. Obteniendo todas las categorías...');
    const categoriesResponse = await axios.get(
      `${API_URL}/api/profiles/${profileId}/skills/categories`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const { categories, total } = categoriesResponse.data.data;
    console.log(`✅ Categorías obtenidas: ${total} categorías\n`);

    // Verificar estructura de categorías
    console.log('🔍 4. Verificando estructura de categorías...');
    const firstCategory = categories[0];
    const requiredFields = ['value', 'label', 'description', 'icon', 'examples'];
    const hasAllFields = requiredFields.every(field => firstCategory.hasOwnProperty(field));

    if (hasAllFields) {
      console.log('✅ Estructura correcta');
      console.log('   Primera categoría:', {
        value: firstCategory.value,
        label: firstCategory.label,
        description: firstCategory.description.substring(0, 50) + '...',
        icon: firstCategory.icon,
        examplesCount: firstCategory.examples.length
      });
    } else {
      console.log('❌ ERROR: Estructura de categoría incorrecta');
      console.log('   Campos encontrados:', Object.keys(firstCategory));
      console.log('   Campos requeridos:', requiredFields);
      return;
    }

    // Mostrar todas las categorías
    console.log('\n📋 5. Categorías disponibles:');
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. [${cat.value}] ${cat.label}`);
    });

    // 4. Probar endpoint de categorías agrupadas
    console.log('\n📊 6. Obteniendo categorías agrupadas...');
    const groupedResponse = await axios.get(
      `${API_URL}/api/profiles/${profileId}/skills/categories/grouped`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const { categoriesGrouped, totalGroups } = groupedResponse.data.data;
    console.log(`✅ Categorías agrupadas: ${totalGroups} grupos\n`);

    // Mostrar grupos
    console.log('📊 7. Grupos de categorías:');
    Object.entries(categoriesGrouped).forEach(([groupName, groupCategories]) => {
      console.log(`\n   📁 ${groupName} (${groupCategories.length} categorías):`);
      groupCategories.forEach(cat => {
        console.log(`      • ${cat.label}`);
      });
    });

    // 5. Probar crear skill con nueva categoría
    console.log('\n🧪 8. Probando crear skill con nueva categoría (design_tools)...');

    try {
      const createSkillResponse = await axios.post(
        `${API_URL}/api/profiles/${profileId}/skills`,
        {
          name: 'Figma',
          category: 'design_tools',
          proficiency_level: 'advanced',
          years_of_experience: 3
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('✅ Skill creado exitosamente con categoría nueva');
      console.log('   ID:', createSkillResponse.data.data.skill.id);
      console.log('   Nombre:', createSkillResponse.data.data.skill.name);
      console.log('   Categoría:', createSkillResponse.data.data.skill.category);

      // Eliminar el skill de prueba
      await axios.delete(
        `${API_URL}/api/profiles/${profileId}/skills/${createSkillResponse.data.data.skill.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('✅ Skill de prueba eliminado');

    } catch (error) {
      console.log('❌ ERROR al crear skill:', error.response?.data?.message || error.message);
      return;
    }

    // 6. Probar validación (categoría inválida)
    console.log('\n🧪 9. Probando validación (categoría inválida)...');

    try {
      await axios.post(
        `${API_URL}/api/profiles/${profileId}/skills`,
        {
          name: 'React',
          category: 'frontend', // ❌ Categoría inválida
          proficiency_level: 'expert',
          years_of_experience: 5
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('❌ ERROR: Debería haber rechazado la categoría inválida');

    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validación funciona correctamente');
        console.log('   Mensaje de error:', error.response.data.message);
      } else {
        console.log('❌ ERROR inesperado:', error.message);
        return;
      }
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('✨ TODAS LAS PRUEBAS PASARON EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ ${total} categorías disponibles`);
    console.log(`   ✅ ${totalGroups} grupos temáticos`);
    console.log(`   ✅ Endpoint de categorías funciona`);
    console.log(`   ✅ Endpoint de categorías agrupadas funciona`);
    console.log(`   ✅ Creación de skill con nueva categoría funciona`);
    console.log(`   ✅ Validación de categorías funciona`);
    console.log('\n🎉 Sistema de categorías expandido funcionando correctamente\n');

  } catch (error) {
    console.log('\n❌ ERROR EN LA PRUEBA:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Mensaje: ${error.response.data.message || error.response.statusText}`);
      if (error.response.data.errors) {
        console.log(`   Errores:`, error.response.data.errors);
      }
    } else {
      console.log('   Mensaje:', error.message);
    }
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. El servidor está corriendo (npm run dev)');
    console.log('   2. La base de datos está conectada');
    console.log('   3. El usuario de prueba existe y está verificado');
    console.log('   4. Todos los archivos nuevos están en su lugar');
    process.exit(1);
  }
}

// Ejecutar
testSkillCategories().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
