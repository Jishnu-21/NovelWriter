import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  error: null,
  otpSent: false,
  userId: null,
};

export const signup = createAsyncThunk('auth/signup', async (user, thunkAPI) => {
  try {
    const response = await authService.signup(user);
    return response; // Ensure response contains userId if needed
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'An error occurred');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp }, thunkAPI) => {
  try {
    return await authService.verifyOTP({ email, otp }); // Pass an object with email and otp
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'An error occurred');
  }
});


export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  localStorage.removeItem('user'); // Ensure local storage is cleared on logout
});

export const resendOTP = createAsyncThunk('auth/resendOTP', async (email, thunkAPI) => {
  try {
    const response = await authService.resendOTP(email);
    return response;
  } catch (error) {
    console.error('Resend OTP thunk error:', error);
    return thunkAPI.rejectWithValue(error.response?.data || error.message || 'An error occurred');
  }
});


export const googleSignIn = createAsyncThunk('auth/googleSignIn', async (_, thunkAPI) => {
  try {
    await authService.googleSignIn();
  } catch (error) {
    console.error('Google Sign-In error:', error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, thunkAPI) => {
  try {
    const response = await authService.forgotPassword(email);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, thunkAPI) => {
  try {
    const response = await authService.resetPassword(data);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'An error occurred');
  }
});


export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    const response = await authService.login(user);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
  }
});

export const adminLogin = createAsyncThunk('auth/adminLogin', async (admin, thunkAPI) => {
  try {
    const response = await authService.adminLogin(admin);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.otpSent = false;
      state.userId = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.userId = action.payload.userId;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.otpSent = false;
        state.userId = null;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('user');
      })
      .addCase(resendOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(googleSignIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        console.log('Reset password pending');
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        console.log('Reset password fulfilled with payload:', action.payload);
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        console.log('Reset password rejected with error:', action.payload);
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...action.payload, isAdmin: true };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;