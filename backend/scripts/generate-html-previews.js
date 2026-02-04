/**
 * Script para generar archivos HTML de preview de las plantillas
 * Uso: node generate-html-previews.js
 */

const fs = require('fs');
const path = require('path');

// Importar el controlador de templates
const { TemplateController } = require('./src/controllers/templateController');
const templateService = require('./src/services/templateService');

// Datos de ejemplo para el CV
const sampleProfile = {
  id: 1,
  name: 'CV Ejemplo',
  template: 'harvard_classic',
  language: 'es',
  personalInfo: {
    full_name: 'Juan Pérez García',
    professional_title: 'Desarrollador Full Stack Senior',
    email: 'juan.perez@ejemplo.com',
    phone: '+52 123 456 7890',
    location: 'Ciudad de México, México',
    bio: 'Desarrollador Full Stack con más de 8 años de experiencia en el diseño y desarrollo de aplicaciones web escalables. Especializado en tecnologías JavaScript (Node.js, React) y arquitecturas cloud. Apasionado por crear soluciones innovadoras y liderar equipos técnicos.'
  },
  education: [
    {
      institution: 'Universidad Nacional Autónoma de México',
      degree: 'Licenciatura',
      field_of_study: 'Ingeniería en Computación',
      start_date: '2012-08-01',
      end_date: '2016-06-01',
      is_current: false,
      location: 'Ciudad de México',
      grade: '9.2/10',
      description: 'Enfoque en desarrollo de software y arquitectura de sistemas.',
      is_visible: true
    }
  ],
  experience: [
    {
      position: 'Senior Full Stack Developer',
      project_title: 'Plataforma de E-commerce',
      company: 'Tech Solutions S.A.',
      start_date: '2020-01-01',
      end_date: null,
      is_current: true,
      location: 'Ciudad de México',
      achievements: 'Lideré el desarrollo de una plataforma de e-commerce que procesa más de 10,000 transacciones diarias. Implementé arquitectura de microservicios con Node.js y React, mejorando el rendimiento en un 40%.',
      technologies: 'Node.js, React, PostgreSQL, Docker, Kubernetes, AWS',
      is_visible: true
    },
    {
      position: 'Full Stack Developer',
      project_title: 'Sistema de Gestión Empresarial',
      company: 'Digital Innovations Inc.',
      start_date: '2017-03-01',
      end_date: '2019-12-31',
      is_current: false,
      location: 'Ciudad de México',
      achievements: 'Desarrollé un sistema ERP completo utilizando MERN stack. Coordiné con equipos multidisciplinarios para la integración de módulos de contabilidad, inventario y recursos humanos.',
      technologies: 'MongoDB, Express, React, Node.js, Redux',
      is_visible: true
    }
  ],
  skills: [
    { name: 'JavaScript', proficiency_level: 'expert', category: 'programming_languages', is_visible: true },
    { name: 'TypeScript', proficiency_level: 'expert', category: 'programming_languages', is_visible: true },
    { name: 'Python', proficiency_level: 'advanced', category: 'programming_languages', is_visible: true },
    { name: 'React', proficiency_level: 'expert', category: 'frameworks_libraries', is_visible: true },
    { name: 'Node.js', proficiency_level: 'expert', category: 'frameworks_libraries', is_visible: true },
    { name: 'Express', proficiency_level: 'expert', category: 'frameworks_libraries', is_visible: true },
    { name: 'PostgreSQL', proficiency_level: 'advanced', category: 'databases', is_visible: true },
    { name: 'MongoDB', proficiency_level: 'advanced', category: 'databases', is_visible: true },
    { name: 'Docker', proficiency_level: 'advanced', category: 'cloud_devops', is_visible: true },
    { name: 'AWS', proficiency_level: 'advanced', category: 'cloud_devops', is_visible: true },
    { name: 'Git', proficiency_level: 'expert', category: 'office_tools', is_visible: true },
    { name: 'Liderazgo de Equipos', proficiency_level: 'advanced', category: 'soft_skills', is_visible: true }
  ],
  languages: [
    {
      name: 'Español',
      level: 'Native',
      certification_name: null,
      certification_score: null,
      is_visible: true
    },
    {
      name: 'Inglés',
      level: 'C1',
      certification_name: 'TOEFL',
      certification_score: '110',
      is_visible: true
    }
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuing_organization: 'Amazon Web Services',
      issue_date: '2023-06-15',
      expiration_date: '2026-06-15',
      credential_id: 'AWS-SA-12345',
      credential_url: 'https://aws.amazon.com/verify/12345',
      is_visible: true
    },
    {
      name: 'Professional Scrum Master',
      issuing_organization: 'Scrum.org',
      issue_date: '2022-03-20',
      expiration_date: null,
      credential_id: 'PSM-67890',
      credential_url: 'https://scrum.org/verify/67890',
      is_visible: true
    }
  ],
  socialNetworks: [
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/juanperez',
      is_visible: true
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/juanperez',
      is_visible: true
    }
  ]
};

async function generateHtmlPreview(templateName, outputPath) {
  console.log(`📄 Generando HTML preview para: ${templateName}`);

  try {
    // Configurar el perfil con la plantilla
    const profile = { ...sampleProfile, template: templateName };

    // Obtener metadata de la plantilla
    const templateMetadata = await templateService.getTemplateMetadata(templateName);

    // Generar HTML
    const html = TemplateController.generateHtmlPreview(profile, templateMetadata);

    // Guardar archivo HTML
    fs.writeFileSync(outputPath, html, 'utf-8');

    console.log(`✅ HTML preview generado: ${outputPath}`);

  } catch (error) {
    console.error(`❌ Error generando HTML preview para ${templateName}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Generando HTML previews de plantillas...\n');

  const outputDir = path.join(__dirname, 'previews');

  // Asegurar que el directorio exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Directorio creado: ${outputDir}\n`);
  }

  // Generar previews para cada plantilla
  const templates = [
    {
      name: 'harvard_classic',
      filename: 'harvard_classic.html'
    },
    {
      name: 'harvard_modern',
      filename: 'harvard_modern.html'
    },
    {
      name: 'oxford',
      filename: 'oxford.html'
    }
  ];

  for (const template of templates) {
    const outputPath = path.join(outputDir, template.filename);
    await generateHtmlPreview(template.name, outputPath);
  }

  console.log('\n✨ Todos los HTML previews han sido generados exitosamente!');
  console.log('\n📍 Ubicación:', outputDir);
  console.log('\n📄 Archivos generados:');
  templates.forEach(t => {
    console.log(`   - ${path.join(outputDir, t.filename)}`);
  });
  console.log('\n💡 Abre los archivos HTML en tu navegador para ver los previews');
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
