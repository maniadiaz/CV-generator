import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CVProfile } from '@app-types/index';
import api from '@api/axios';

interface ProfileState {
  profiles: CVProfile[];
  currentProfile: CVProfile | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
}

const initialState: ProfileState = {
  profiles: [],
  currentProfile: null,
  loading: false,
  error: null,
  saving: false,
};

// Async thunks
export const fetchProfiles = createAsyncThunk(
  'profile/fetchProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/profiles');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar perfiles');
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  'profile/fetchProfileById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/profiles/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar perfil');
    }
  }
);

export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async (profile: Partial<CVProfile>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/profiles', profile);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear perfil');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ id, data }: { id: string; data: Partial<CVProfile> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/profiles/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar perfil');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/profiles/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar perfil');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCurrentProfile: (state, action: PayloadAction<CVProfile | null>) => {
      state.currentProfile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCurrentProfile: (state, action: PayloadAction<Partial<CVProfile>>) => {
      if (state.currentProfile) {
        state.currentProfile = { ...state.currentProfile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch profiles
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action: PayloadAction<CVProfile[]>) => {
        state.loading = false;
        state.profiles = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profiles = [];
      });

    // Fetch profile by ID
    builder
      .addCase(fetchProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action: PayloadAction<CVProfile>) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create profile
    builder
      .addCase(createProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action: PayloadAction<CVProfile>) => {
        state.saving = false;
        state.profiles.push(action.payload);
        state.currentProfile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<CVProfile>) => {
        state.saving = false;
        const index = state.profiles.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
        state.currentProfile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    // Delete profile
    builder
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.profiles = state.profiles.filter((p) => p.id !== action.payload);
        if (state.currentProfile?.id === action.payload) {
          state.currentProfile = null;
        }
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentProfile, clearError, updateCurrentProfile } = profileSlice.actions;
export default profileSlice.reducer;
