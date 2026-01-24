import { createContext, useContext, useState, useEffect } from 'react';

const CVContext = createContext();

const defaultProfile = {
  id: Date.now(),
  name: 'Nuevo Perfil',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: '',
    summary: ''
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  certifications: []
};

export function CVProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileId, setCurrentProfileId] = useState(null);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedProfiles = localStorage.getItem('cv-profiles');
    const savedCurrentId = localStorage.getItem('cv-current-profile');

    if (savedProfiles) {
      const parsed = JSON.parse(savedProfiles);
      setProfiles(parsed);

      if (savedCurrentId && parsed.some(p => p.id === parseInt(savedCurrentId))) {
        setCurrentProfileId(parseInt(savedCurrentId));
      } else if (parsed.length > 0) {
        setCurrentProfileId(parsed[0].id);
      }
    } else {
      // Crear perfil por defecto
      const newProfile = { ...defaultProfile, id: Date.now() };
      setProfiles([newProfile]);
      setCurrentProfileId(newProfile.id);
    }
  }, []);

  // Guardar en localStorage cuando cambien los perfiles
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('cv-profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  // Guardar perfil actual
  useEffect(() => {
    if (currentProfileId) {
      localStorage.setItem('cv-current-profile', currentProfileId.toString());
    }
  }, [currentProfileId]);

  const currentProfile = profiles.find(p => p.id === currentProfileId) || null;

  const updateProfile = (updates) => {
    setProfiles(prev => prev.map(p =>
      p.id === currentProfileId ? { ...p, ...updates } : p
    ));
  };

  const updatePersonalInfo = (info) => {
    updateProfile({ personalInfo: { ...currentProfile?.personalInfo, ...info } });
  };

  const addExperience = (experience) => {
    const newExp = { ...experience, id: Date.now() };
    updateProfile({ experience: [...(currentProfile?.experience || []), newExp] });
  };

  const updateExperience = (id, updates) => {
    updateProfile({
      experience: currentProfile?.experience.map(exp =>
        exp.id === id ? { ...exp, ...updates } : exp
      ) || []
    });
  };

  const deleteExperience = (id) => {
    updateProfile({
      experience: currentProfile?.experience.filter(exp => exp.id !== id) || []
    });
  };

  const addEducation = (education) => {
    const newEdu = { ...education, id: Date.now() };
    updateProfile({ education: [...(currentProfile?.education || []), newEdu] });
  };

  const updateEducation = (id, updates) => {
    updateProfile({
      education: currentProfile?.education.map(edu =>
        edu.id === id ? { ...edu, ...updates } : edu
      ) || []
    });
  };

  const deleteEducation = (id) => {
    updateProfile({
      education: currentProfile?.education.filter(edu => edu.id !== id) || []
    });
  };

  const addSkill = (skill) => {
    updateProfile({ skills: [...(currentProfile?.skills || []), skill] });
  };

  const deleteSkill = (index) => {
    updateProfile({
      skills: currentProfile?.skills.filter((_, i) => i !== index) || []
    });
  };

  const addLanguage = (language) => {
    const newLang = { ...language, id: Date.now() };
    updateProfile({ languages: [...(currentProfile?.languages || []), newLang] });
  };

  const deleteLanguage = (id) => {
    updateProfile({
      languages: currentProfile?.languages.filter(lang => lang.id !== id) || []
    });
  };

  const addCertification = (certification) => {
    const newCert = { ...certification, id: Date.now() };
    updateProfile({ certifications: [...(currentProfile?.certifications || []), newCert] });
  };

  const deleteCertification = (id) => {
    updateProfile({
      certifications: currentProfile?.certifications.filter(cert => cert.id !== id) || []
    });
  };

  const createProfile = (name = 'Nuevo Perfil') => {
    const newProfile = { ...defaultProfile, id: Date.now(), name };
    setProfiles(prev => [...prev, newProfile]);
    setCurrentProfileId(newProfile.id);
    return newProfile.id;
  };

  const deleteProfile = (id) => {
    if (profiles.length <= 1) return; // No eliminar si es el único

    setProfiles(prev => prev.filter(p => p.id !== id));
    if (currentProfileId === id) {
      const remaining = profiles.filter(p => p.id !== id);
      setCurrentProfileId(remaining[0]?.id || null);
    }
  };

  const switchProfile = (id) => {
    if (profiles.some(p => p.id === id)) {
      setCurrentProfileId(id);
    }
  };

  const renameProfile = (id, newName) => {
    setProfiles(prev => prev.map(p =>
      p.id === id ? { ...p, name: newName } : p
    ));
  };

  const exportData = () => {
    const data = JSON.stringify(profiles, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        setProfiles(data);
        setCurrentProfileId(data[0]?.id || null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CVContext.Provider value={{
      profiles,
      currentProfile,
      currentProfileId,
      updatePersonalInfo,
      addExperience,
      updateExperience,
      deleteExperience,
      addEducation,
      updateEducation,
      deleteEducation,
      addSkill,
      deleteSkill,
      addLanguage,
      deleteLanguage,
      addCertification,
      deleteCertification,
      createProfile,
      deleteProfile,
      switchProfile,
      renameProfile,
      exportData,
      importData
    }}>
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
}
