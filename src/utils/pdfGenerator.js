import jsPDF from 'jspdf';

export function generateHarvardCV(profile) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addSectionTitle = (title) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(128, 0, 0); // Harvard crimson
    doc.text(title.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(128, 0, 0);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setTextColor(0, 0, 0);
  };

  const addText = (text, indent = 0, bold = false, fontSize = 10) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    doc.text(lines, margin + indent, y);
    y += lines.length * 5;
  };

  const { personalInfo, education, experience, skills, languages, certifications } = profile;

  // Header - Nombre centrado
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(128, 0, 0);
  doc.text(personalInfo.fullName || 'Nombre Completo', pageWidth / 2, y, { align: 'center' });
  y += 10;

  // Información de contacto centrada
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const contactParts = [];
  if (personalInfo.address) contactParts.push(personalInfo.address);
  if (personalInfo.city) contactParts.push(personalInfo.city);
  if (personalInfo.country) contactParts.push(personalInfo.country);

  if (contactParts.length > 0) {
    doc.text(contactParts.join(', '), pageWidth / 2, y, { align: 'center' });
    y += 5;
  }

  const contactInfo = [];
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.email) contactInfo.push(personalInfo.email);

  if (contactInfo.length > 0) {
    doc.text(contactInfo.join(' | '), pageWidth / 2, y, { align: 'center' });
    y += 5;
  }

  const socialLinks = [];
  if (personalInfo.linkedin) socialLinks.push(`LinkedIn: ${personalInfo.linkedin}`);
  if (personalInfo.github) socialLinks.push(`GitHub: ${personalInfo.github}`);

  if (socialLinks.length > 0) {
    doc.text(socialLinks.join(' | '), pageWidth / 2, y, { align: 'center' });
    y += 5;
  }

  if (personalInfo.portfolio) {
    doc.text(`Portfolio: ${personalInfo.portfolio}`, pageWidth / 2, y, { align: 'center' });
    y += 5;
  }

  y += 8;

  // Resumen profesional
  if (personalInfo.summary) {
    addSectionTitle('Resumen Profesional');
    addText(personalInfo.summary);
    y += 5;
  }

  // Educación
  if (education && education.length > 0) {
    addSectionTitle('Educación');
    education.forEach((edu) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(edu.institution || '', margin, y);

      const dateText = `${edu.startDate || ''} - ${edu.endDate || 'Presente'}`;
      doc.setFont('helvetica', 'normal');
      doc.text(dateText, pageWidth - margin, y, { align: 'right' });
      y += 5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text(`${edu.degree || ''} en ${edu.field || ''}`, margin, y);
      y += 5;

      if (edu.gpa) {
        doc.setFont('helvetica', 'normal');
        doc.text(`GPA: ${edu.gpa}`, margin, y);
        y += 5;
      }

      if (edu.description) {
        addText(edu.description, 5);
      }
      y += 3;
    });
    y += 5;
  }

  // Experiencia Profesional
  if (experience && experience.length > 0) {
    addSectionTitle('Experiencia Profesional');
    experience.forEach((exp) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(exp.company || '', margin, y);

      const dateText = `${exp.startDate || ''} - ${exp.endDate || 'Presente'}`;
      doc.setFont('helvetica', 'normal');
      doc.text(dateText, pageWidth - margin, y, { align: 'right' });
      y += 5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      const locationText = exp.location ? ` | ${exp.location}` : '';
      doc.text(`${exp.position || ''}${locationText}`, margin, y);
      y += 6;

      if (exp.description) {
        doc.setFont('helvetica', 'normal');
        const descLines = exp.description.split('\n');
        descLines.forEach((line) => {
          if (line.trim()) {
            const bulletText = `• ${line.trim()}`;
            const wrapped = doc.splitTextToSize(bulletText, contentWidth - 5);
            wrapped.forEach((wLine, idx) => {
              if (y > 275) {
                doc.addPage();
                y = 20;
              }
              doc.text(idx === 0 ? wLine : `  ${wLine}`, margin + 3, y);
              y += 4.5;
            });
          }
        });
      }
      y += 5;
    });
  }

  // Habilidades
  if (skills && skills.length > 0) {
    addSectionTitle('Habilidades');
    const skillsText = skills.join(' • ');
    addText(skillsText);
    y += 5;
  }

  // Idiomas
  if (languages && languages.length > 0) {
    addSectionTitle('Idiomas');
    languages.forEach((lang) => {
      addText(`${lang.name}: ${lang.level}`);
    });
    y += 5;
  }

  // Certificaciones
  if (certifications && certifications.length > 0) {
    addSectionTitle('Certificaciones');
    certifications.forEach((cert) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(cert.name || '', margin, y);

      if (cert.date) {
        doc.setFont('helvetica', 'normal');
        doc.text(cert.date, pageWidth - margin, y, { align: 'right' });
      }
      y += 5;

      if (cert.issuer) {
        doc.setFont('helvetica', 'italic');
        doc.text(cert.issuer, margin, y);
        y += 5;
      }
      y += 2;
    });
  }

  // Guardar
  const fileName = `CV_${personalInfo.fullName?.replace(/\s+/g, '_') || 'documento'}_Harvard.pdf`;
  doc.save(fileName);
}
