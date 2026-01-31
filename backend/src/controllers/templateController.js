const templateService = require('../services/templateService');
const profileService = require('../services/profileService');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

class TemplateController {
  /**
   * GET /api/templates
   * Obtener todas las plantillas disponibles
   */
  async getTemplates(req, res) {
    try {
      const templates = await templateService.getAvailableTemplates();

      return ApiResponse.success(res, {
        templates,
        count: templates.length
      }, 'Templates retrieved successfully');

    } catch (error) {
      logger.error('Get templates error:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * PATCH /api/profiles/:id/template
   * Cambiar la plantilla de un perfil
   */
  async changeTemplate(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);
      const { template } = req.body;

      const result = await templateService.changeProfileTemplate(profileId, userId, template);

      return ApiResponse.success(res, {
        profile: result.profile,
        template: result.template
      }, result.message);

    } catch (error) {
      logger.error('Change template error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      if (error.message.includes('Template')) {
        return ApiResponse.badRequest(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * GET /api/profiles/:id/preview-html
   * Generar preview HTML del CV
   */
  async getPreviewHtml(req, res) {
    try {
      const userId = req.user.id;
      const profileId = parseInt(req.params.id);

      // Obtener perfil completo con todas las relaciones
      const profile = await profileService.getCompleteProfile(profileId, userId);

      if (!profile) {
        return ApiResponse.notFound(res, 'Profile not found');
      }

      // Obtener metadata de la plantilla
      const templateMetadata = await templateService.getTemplateMetadata(profile.template);

      // Generar HTML básico del CV según la plantilla
      const html = TemplateController.generateHtmlPreview(profile, templateMetadata);

      return ApiResponse.success(res, {
        html,
        template: profile.template,
        templateMetadata
      }, 'HTML preview generated successfully');

    } catch (error) {
      logger.error('Get preview HTML error:', error);

      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return ApiResponse.notFound(res, error.message);
      }

      return ApiResponse.error(res, error.message, 500);
    }
  }

  /**
   * Generar HTML básico del CV según la plantilla
   * @private
   */
  static generateHtmlPreview(profile, templateMetadata) {
    const personalInfo = profile.personalInfo || {};
    const education = profile.education || [];
    const experience = profile.experience || [];
    const skills = profile.skills || [];
    const languages = profile.languages || [];
    const certifications = profile.certifications || [];
    const socialNetworks = profile.socialNetworks || [];

    // Generar HTML según la plantilla
    if (profile.template === 'harvard_modern') {
      return TemplateController.generateHarvardModernHtml(profile, personalInfo, education, experience, skills, languages, certifications, socialNetworks, templateMetadata);
    } else {
      // harvard_classic por defecto
      return TemplateController.generateHarvardClassicHtml(profile, personalInfo, education, experience, skills, languages, certifications, socialNetworks, templateMetadata);
    }
  }

  /**
   * Generar HTML para Harvard Classic
   * @private
   */
  static generateHarvardClassicHtml(profile, personalInfo, education, experience, skills, languages, certifications, socialNetworks, templateMetadata) {
    const { colors } = templateMetadata;

    return `
<!DOCTYPE html>
<html lang="${profile.language || 'es'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.full_name || 'CV'} - ${profile.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #333;
            max-width: 850px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }
        h1 {
            color: ${colors.primary};
            font-size: 36px;
            margin-bottom: 10px;
            border-bottom: 3px solid ${colors.primary};
            padding-bottom: 10px;
        }
        h2 {
            color: ${colors.primary};
            font-size: 20px;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 2px solid ${colors.accent};
            padding-bottom: 5px;
        }
        h3 {
            font-size: 18px;
            margin-bottom: 5px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 15px;
        }
        .contact-info {
            font-size: 14px;
            color: #555;
            margin-top: 10px;
        }
        .section {
            margin-bottom: 25px;
        }
        .entry {
            margin-bottom: 20px;
        }
        .entry-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .entry-title {
            font-weight: bold;
        }
        .entry-date {
            color: #666;
            font-style: italic;
        }
        .entry-subtitle {
            color: #666;
            margin-bottom: 5px;
        }
        .description {
            margin-top: 5px;
            text-align: justify;
        }
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
        }
        .skill-item {
            padding: 8px;
            background: #f5f5f5;
            border-left: 3px solid ${colors.accent};
        }
        ul {
            margin-left: 20px;
            margin-top: 5px;
        }
        li {
            margin-bottom: 3px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${personalInfo.full_name || 'Nombre Completo'}</h1>
        ${personalInfo.professional_title ? `<div class="subtitle">${personalInfo.professional_title}</div>` : ''}
        <div class="contact-info">
            ${personalInfo.email ? `${personalInfo.email}` : ''}
            ${personalInfo.phone ? ` | ${personalInfo.phone}` : ''}
            ${personalInfo.location ? ` | ${personalInfo.location}` : ''}
        </div>
    </div>

    ${personalInfo.summary ? `
    <div class="section">
        <h2>Resumen Profesional</h2>
        <p class="description">${personalInfo.summary}</p>
    </div>
    ` : ''}

    ${experience.length > 0 ? `
    <div class="section">
        <h2>Experiencia Laboral</h2>
        ${experience.map(exp => `
        <div class="entry">
            <div class="entry-header">
                <div>
                    <h3 class="entry-title">${exp.position || exp.project_title || 'Sin título'}</h3>
                    <div class="entry-subtitle">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
                </div>
                <div class="entry-date">
                    ${TemplateController.formatDate(exp.start_date)} - ${exp.is_current ? 'Presente' : TemplateController.formatDate(exp.end_date)}
                </div>
            </div>
            ${exp.achievements ? `<p class="description">${exp.achievements}</p>` : ''}
            ${exp.technologies ? `<div style="margin-top: 5px;"><strong>Tecnologías:</strong> ${exp.technologies}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${education.length > 0 ? `
    <div class="section">
        <h2>Educación</h2>
        ${education.map(edu => `
        <div class="entry">
            <div class="entry-header">
                <div>
                    <h3 class="entry-title">${edu.degree}${edu.field_of_study ? ` en ${edu.field_of_study}` : ''}</h3>
                    <div class="entry-subtitle">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>
                </div>
                <div class="entry-date">
                    ${TemplateController.formatDate(edu.start_date)} - ${edu.is_current ? 'Presente' : TemplateController.formatDate(edu.end_date)}
                </div>
            </div>
            ${edu.grade ? `<div>Calificación: ${edu.grade}</div>` : ''}
            ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${skills.length > 0 ? `
    <div class="section">
        <h2>Habilidades</h2>
        <div class="skills-grid">
            ${skills.map(skill => `
            <div class="skill-item">
                <strong>${skill.name}</strong>
                ${skill.proficiency_level ? ` - ${skill.proficiency_level}` : ''}
            </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    ${certifications.length > 0 ? `
    <div class="section">
        <h2>Certificaciones</h2>
        ${certifications.map(cert => `
        <div class="entry">
            <h3 class="entry-title">${cert.name}</h3>
            <div class="entry-subtitle">${cert.issuing_organization}${cert.issue_date ? ` - ${TemplateController.formatDate(cert.issue_date)}` : ''}</div>
            ${cert.credential_id ? `<div>ID: ${cert.credential_id}</div>` : ''}
            ${cert.credential_url ? `<div><a href="${cert.credential_url}">Verificar credencial</a></div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${languages.length > 0 ? `
    <div class="section">
        <h2>Idiomas</h2>
        <ul>
            ${languages.map(lang => `
            <li><strong>${lang.name}</strong> - ${lang.level || 'No especificado'}${lang.certification_name ? ` (${lang.certification_name}${lang.certification_score ? `: ${lang.certification_score}` : ''})` : ''}</li>
            `).join('')}
        </ul>
    </div>
    ` : ''}
</body>
</html>
    `.trim();
  }

  /**
   * Generar HTML para Harvard Modern
   * @private
   */
  static generateHarvardModernHtml(profile, personalInfo, education, experience, skills, languages, certifications, socialNetworks, templateMetadata) {
    const { colors } = templateMetadata;

    return `
<!DOCTYPE html>
<html lang="${profile.language || 'es'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.full_name || 'CV'} - ${profile.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            max-width: 850px;
            margin: 0 auto;
            padding: 0;
            background: white;
        }
        .header {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        h1 {
            font-size: 42px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .subtitle {
            font-size: 20px;
            margin-bottom: 15px;
            opacity: 0.9;
        }
        .contact-info {
            font-size: 14px;
            margin-top: 15px;
            opacity: 0.95;
        }
        .content {
            padding: 40px;
        }
        h2 {
            color: ${colors.primary};
            font-size: 24px;
            margin-top: 30px;
            margin-bottom: 20px;
            padding-left: 15px;
            border-left: 5px solid ${colors.accent};
            font-weight: 700;
        }
        h3 {
            font-size: 18px;
            margin-bottom: 5px;
            color: ${colors.secondary};
        }
        .section {
            margin-bottom: 30px;
        }
        .entry {
            margin-bottom: 25px;
            padding-left: 20px;
        }
        .entry-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .entry-title {
            font-weight: bold;
            color: ${colors.secondary};
        }
        .entry-date {
            color: ${colors.accent};
            font-weight: 600;
            white-space: nowrap;
        }
        .entry-subtitle {
            color: #7f8c8d;
            margin-bottom: 8px;
            font-style: italic;
        }
        .description {
            margin-top: 8px;
            text-align: justify;
            color: #555;
        }
        .summary-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 5px solid ${colors.primary};
            margin-bottom: 20px;
        }
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .skill-item {
            padding: 12px 15px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 6px;
            border-left: 4px solid ${colors.accent};
            font-weight: 500;
        }
        ul {
            margin-left: 20px;
            margin-top: 10px;
        }
        li {
            margin-bottom: 8px;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${personalInfo.full_name || 'Nombre Completo'}</h1>
        ${personalInfo.professional_title ? `<div class="subtitle">${personalInfo.professional_title}</div>` : ''}
        <div class="contact-info">
            ${personalInfo.email ? `${personalInfo.email}` : ''}
            ${personalInfo.phone ? ` | ${personalInfo.phone}` : ''}
            ${personalInfo.location ? ` | ${personalInfo.location}` : ''}
        </div>
    </div>

    <div class="content">
        ${personalInfo.summary ? `
        <div class="section">
            <div class="summary-box">
                <h2 style="margin-top: 0;">Resumen Profesional</h2>
                <p class="description">${personalInfo.summary}</p>
            </div>
        </div>
        ` : ''}

        ${experience.length > 0 ? `
        <div class="section">
            <h2>Experiencia Laboral</h2>
            ${experience.map(exp => `
            <div class="entry">
                <div class="entry-header">
                    <div>
                        <h3 class="entry-title">${exp.position || exp.project_title || 'Sin título'}</h3>
                        <div class="entry-subtitle">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
                    </div>
                    <div class="entry-date">
                        ${TemplateController.formatDate(exp.start_date)} - ${exp.is_current ? 'Presente' : TemplateController.formatDate(exp.end_date)}
                    </div>
                </div>
                ${exp.achievements ? `<p class="description">${exp.achievements}</p>` : ''}
                ${exp.technologies ? `<div style="margin-top: 8px; color: #7f8c8d;"><strong>Tecnologías:</strong> ${exp.technologies}</div>` : ''}
            </div>
            `).join('')}
        </div>
        ` : ''}

        ${education.length > 0 ? `
        <div class="section">
            <h2>Educación</h2>
            ${education.map(edu => `
            <div class="entry">
                <div class="entry-header">
                    <div>
                        <h3 class="entry-title">${edu.degree}${edu.field_of_study ? ` en ${edu.field_of_study}` : ''}</h3>
                        <div class="entry-subtitle">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>
                    </div>
                    <div class="entry-date">
                        ${TemplateController.formatDate(edu.start_date)} - ${edu.is_current ? 'Presente' : TemplateController.formatDate(edu.end_date)}
                    </div>
                </div>
                ${edu.grade ? `<div style="color: #7f8c8d;">Calificación: ${edu.grade}</div>` : ''}
                ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
            </div>
            `).join('')}
        </div>
        ` : ''}

        ${skills.length > 0 ? `
        <div class="section">
            <h2>Habilidades</h2>
            <div class="skills-grid">
                ${skills.map(skill => `
                <div class="skill-item">
                    <strong>${skill.name}</strong>
                    ${skill.proficiency_level ? ` - ${skill.proficiency_level}` : ''}
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${certifications.length > 0 ? `
        <div class="section">
            <h2>Certificaciones</h2>
            ${certifications.map(cert => `
            <div class="entry">
                <h3 class="entry-title">${cert.name}</h3>
                <div class="entry-subtitle">${cert.issuing_organization}${cert.issue_date ? ` - ${TemplateController.formatDate(cert.issue_date)}` : ''}</div>
                ${cert.credential_id ? `<div style="color: #7f8c8d;">ID: ${cert.credential_id}</div>` : ''}
                ${cert.credential_url ? `<div style="color: #7f8c8d;"><a href="${cert.credential_url}" style="color: ${colors.primary};">Verificar credencial</a></div>` : ''}
            </div>
            `).join('')}
        </div>
        ` : ''}

        ${languages.length > 0 ? `
        <div class="section">
            <h2>Idiomas</h2>
            <ul>
                ${languages.map(lang => `
                <li><strong>${lang.name}</strong> - ${lang.level || 'No especificado'}${lang.certification_name ? ` (${lang.certification_name}${lang.certification_score ? `: ${lang.certification_score}` : ''})` : ''}</li>
                `).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Formatear fecha para mostrar
   * @private
   */
  static formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
}

// Exportar instancia para endpoints
const instance = new TemplateController();

// Exportar también la clase para acceder a métodos estáticos
module.exports = instance;
module.exports.TemplateController = TemplateController;
