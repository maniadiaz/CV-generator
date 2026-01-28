const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre del perfil/CV (ej: "CV Desarrollador Senior")'
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      comment: 'URL-friendly version of name'
    },
    template: {
      type: DataTypes.ENUM('harvard_classic', 'harvard_modern'),
      allowNull: false,
      defaultValue: 'harvard_classic',
      comment: 'Template design chosen'
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si es el CV por defecto del usuario'
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si el CV es visible públicamente'
    },
    language: {
      type: DataTypes.ENUM('es', 'en'),
      allowNull: false,
      defaultValue: 'es',
      comment: 'Idioma del CV'
    },
    color_scheme: {
      type: DataTypes.STRING(50),
      defaultValue: 'harvard_crimson',
      comment: 'Esquema de colores aplicado'
    },
    completion_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      comment: 'Porcentaje de completitud del CV (0-100)'
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Número de veces que se ha visto el CV'
    },
    download_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Número de descargas/exportaciones'
    },
    last_exported_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Última vez que se exportó a PDF'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'profiles',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_profiles_user_id',
        fields: ['user_id']
      },
      {
        name: 'idx_profiles_slug',
        unique: true,
        fields: ['slug']
      },
      {
        name: 'idx_profiles_is_public',
        fields: ['is_public']
      }
    ]
  });

  /**
   * Generar slug único a partir del nombre
   */
  Profile.beforeValidate(async (profile) => {
    if (profile.name && !profile.slug) {
      const baseSlug = profile.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/-+/g, '-') // Múltiples guiones a uno
        .trim();

      let slug = baseSlug;
      let counter = 1;

      // Verificar unicidad y agregar número si es necesario
      while (await Profile.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      profile.slug = slug;
    }
  });

  /**
   * Verificar que solo haya un perfil por defecto por usuario
   */
  Profile.beforeSave(async (profile) => {
    if (profile.is_default && profile.changed('is_default')) {
      // Desmarcar otros perfiles del mismo usuario como default
      await Profile.update(
        { is_default: false },
        {
          where: {
            user_id: profile.user_id,
            id: { [sequelize.Sequelize.Op.ne]: profile.id }
          }
        }
      );
    }
  });

  /**
   * Método de instancia: Incrementar view count
   */
  Profile.prototype.incrementViewCount = async function() {
    this.view_count += 1;
    await this.save();
    return this;
  };

  /**
   * Método de instancia: Incrementar download count
   */
  Profile.prototype.incrementDownloadCount = async function() {
    this.download_count += 1;
    this.last_exported_at = new Date();
    await this.save();
    return this;
  };

  /**
   * Método de instancia: Marcar como perfil por defecto
   */
  Profile.prototype.setAsDefault = async function() {
    // Desmarcar otros perfiles del mismo usuario
    await Profile.update(
      { is_default: false },
      { where: { user_id: this.user_id } }
    );

    // Marcar este como default
    this.is_default = true;
    await this.save();
    return this;
  };

  return Profile;
};
