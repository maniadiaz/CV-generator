import api from './axios';
import type { ApiResponse } from '@app-types/index';

export type TemplateName = 'harvard_classic' | 'harvard_modern';

export interface Template {
  name: TemplateName;
  displayName: string;
  category: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: string[];
  previewImage: string;
}

export interface ValidationResult {
  isValid: boolean;
  completeness: number;
  hasPersonalInfo: boolean;
  warnings: Array<{
    section: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

interface TemplatesListResponse {
  templates: Template[];
}

interface PreviewHtmlResponse {
  html: string;
}

interface ValidationResponse {
  validation: ValidationResult;
}

export const templatesService = {
  // Get all available templates
  getTemplates: async (): Promise<Template[]> => {
    console.log('Fetching templates from /api/templates');
    const response = await api.get<ApiResponse<TemplatesListResponse>>('/api/templates');
    console.log('Templates response:', response.data);
    return response.data.data.templates;
  },

  // Change profile template
  changeTemplate: async (profileId: number, templateName: TemplateName): Promise<void> => {
    const payload = { template: templateName };
    console.log('Changing template:', {
      endpoint: `/api/profiles/${profileId}/template`,
      method: 'PATCH',
      profileId,
      templateName,
      payload,
    });
    try {
      const response = await api.patch(`/api/profiles/${profileId}/template`, payload);
      console.log('Change template response:', response.data);
    } catch (error) {
      console.error('Error changing template:', error);
      throw error;
    }
  },

  // Get HTML preview
  getPreviewHtml: async (profileId: number): Promise<string> => {
    console.log('Getting HTML preview for profile:', profileId);
    const response = await api.get<ApiResponse<PreviewHtmlResponse>>(
      `/api/profiles/${profileId}/preview-html`
    );
    console.log('HTML preview response:', response.data);
    return response.data.data.html;
  },

  // Validate profile for PDF export
  validateProfile: async (profileId: number): Promise<ValidationResult> => {
    console.log('Validating profile:', profileId);
    const response = await api.get<ApiResponse<ValidationResponse>>(
      `/api/profiles/${profileId}/pdf/validate`
    );
    console.log('Validation response:', response.data);
    return response.data.data.validation;
  },

  // Export PDF (download)
  exportPDF: async (profileId: number): Promise<Blob> => {
    console.log('Exporting PDF for profile:', profileId);
    try {
      // Primero intentar con responseType blob (comportamiento correcto del backend)
      const response = await api.get(`/api/profiles/${profileId}/pdf/export-pdf`, {
        responseType: 'blob',
      });
      console.log('Export PDF response:', response);

      // Si es un blob, devolverlo directamente
      if (response.data instanceof Blob) {
        console.log('PDF received as blob (correct):', { size: response.data.size, type: response.data.type });
        return response.data;
      }

      // Fallback: Si la respuesta es un objeto JSON con números como keys (backend antiguo)
      if (response.data && typeof response.data === 'object' && '0' in response.data) {
        console.log('PDF came as JSON object (old backend), converting to Uint8Array...');
        const bytesArray = Object.values(response.data) as number[];
        const uint8Array = new Uint8Array(bytesArray);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        console.log('Converted blob:', { size: blob.size, type: blob.type });
        return blob;
      }

      throw new Error('Invalid PDF response format');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  },

  // Preview PDF (inline)
  previewPDF: async (profileId: number): Promise<Blob> => {
    console.log('Previewing PDF for profile:', profileId);
    try {
      // Primero intentar con responseType blob (comportamiento correcto del backend)
      const response = await api.get(`/api/profiles/${profileId}/pdf/preview-pdf`, {
        responseType: 'blob',
      });
      console.log('Preview PDF response:', response);

      // Si es un blob, devolverlo directamente
      if (response.data instanceof Blob) {
        console.log('PDF received as blob (correct):', { size: response.data.size, type: response.data.type });
        return response.data;
      }

      // Fallback: Si la respuesta es un objeto JSON con números como keys (backend antiguo)
      if (response.data && typeof response.data === 'object' && '0' in response.data) {
        console.log('PDF came as JSON object (old backend), converting to Uint8Array...');
        const bytesArray = Object.values(response.data) as number[];
        const uint8Array = new Uint8Array(bytesArray);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        console.log('Converted blob:', { size: blob.size, type: blob.type });
        return blob;
      }

      throw new Error('Invalid PDF response format');
    } catch (error) {
      console.error('Error previewing PDF:', error);
      throw error;
    }
  },
};
