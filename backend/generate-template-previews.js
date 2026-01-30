/**
 * Script para generar imágenes de preview de las plantillas
 * Uso: node generate-template-previews.js
 */

const puppeteer = require('puppeteer');
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
    summary: 'Desarrollador Full Stack con más de 8 años de experiencia en el diseño y desarrollo de aplicaciones web escalables. Especializado en tecnologías JavaScript (Node.js, React) y arquitecturas cloud. Apasionado por crear soluciones innovadoras y liderar equipos técnicos.'
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
      description: 'Enfoque en desarrollo de software y arquitectura de sistemas.'
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
      technologies: 'Node.js, React, PostgreSQL, Docker, Kubernetes, AWS'
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
      technologies: 'MongoDB, Express, React, Node.js, Redux'
    }
  ],
  skills: [
    { name: 'JavaScript', proficiency_level: 'expert', category: 'programming_languages' },
    { name: 'TypeScript', proficiency_level: 'expert', category: 'programming_languages' },
    { name: 'Python', proficiency_level: 'advanced', category: 'programming_languages' },
    { name: 'React', proficiency_level: 'expert', category: 'frameworks_libraries' },
    { name: 'Node.js', proficiency_level: 'expert', category: 'frameworks_libraries' },
    { name: 'Express', proficiency_level: 'expert', category: 'frameworks_libraries' },
    { name: 'PostgreSQL', proficiency_level: 'advanced', category: 'databases' },
    { name: 'MongoDB', proficiency_level: 'advanced', category: 'databases' },
    { name: 'Docker', proficiency_level: 'advanced', category: 'cloud_devops' },
    { name: 'AWS', proficiency_level: 'advanced', category: 'cloud_devops' },
    { name: 'Git', proficiency_level: 'expert', category: 'tools' },
    { name: 'Liderazgo de Equipos', proficiency_level: 'advanced', category: 'soft_skills' }
  ],
  languages: [
    {
      name: 'Español',
      level: 'Native',
      certification_name: null,
      certification_score: null
    },
    {
      name: 'Inglés',
      level: 'C1',
      certification_name: 'TOEFL',
      certification_score: '110'
    }
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issue_date: '2023-06-15',
      expiration_date: '2026-06-15',
      credential_id: 'AWS-SA-12345',
      credential_url: 'https://aws.amazon.com/verify/12345'
    },
    {
      name: 'Professional Scrum Master',
      issuer: 'Scrum.org',
      issue_date: '2022-03-20',
      expiration_date: null,
      credential_id: 'PSM-67890',
      credential_url: 'https://scrum.org/verify/67890'
    }
  ],
  socialNetworks: []
};

async function generatePreviewImage(templateName, outputPath) {
  console.log(`📸 Generando preview para: ${templateName}`);

  let browser;
  try {
    // Configurar el perfil con la plantilla
    const profile = { ...sampleProfile, template: templateName };

    // Obtener metadata de la plantilla
    const templateMetadata = await templateService.getTemplateMetadata(templateName);

    // Generar HTML
    const html = TemplateController.generateHtmlPreview(profile, templateMetadata);

    // Lanzar Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Configurar viewport para simular A4 (8.27 x 11.69 inches a 96 DPI)
    await page.setViewport({
      width: 800,
      height: 1100,
      deviceScaleFactor: 2 // Para mejor calidad
    });

    // Establecer contenido HTML
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    // Tomar screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: true
    });

    console.log(`✅ Preview generado: ${outputPath}`);

  } catch (error) {
    console.error(`❌ Error generando preview para ${templateName}:`, error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  console.log('🚀 Generando previews de plantillas...\n');

  const outputDir = path.join(__dirname, 'public', 'templates', 'previews');

  // Asegurar que el directorio existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Directorio creado: ${outputDir}\n`);
  }

  // Generar previews para cada plantilla
  const templates = [
    {
      name: 'harvard_classic',
      filename: 'harvard_classic.png'
    },
    {
      name: 'harvard_modern',
      filename: 'harvard_modern.png'
    }
  ];

  for (const template of templates) {
    const outputPath = path.join(outputDir, template.filename);
    await generatePreviewImage(template.name, outputPath);
  }

  console.log('\n✨ Todos los previews han sido generados exitosamente!');
  console.log('\n📍 Ubicación:', outputDir);
  console.log('\n🌐 URLs públicas:');
  console.log('   - https://api-cv.servercontrol-mzt.com/templates/previews/harvard_classic.png');
  console.log('   - https://api-cv.servercontrol-mzt.com/templates/previews/harvard_modern.png');
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
