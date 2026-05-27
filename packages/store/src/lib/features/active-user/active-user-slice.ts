import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@inithium/types';

export interface ActiveUserState {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ActiveUserState = {
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,
  isLoading: false,
  error: null,
};

export const activeUserSlice = createSlice({
  name: 'activeUser',
  initialState,
  reducers: {
    setActiveUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isBootstrapping = false;
      state.error = null;
    },

    clearActiveUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isBootstrapping = false;
      state.error = null;
    },

    setBootstrappingComplete(state) {
      state.isBootstrapping = false;
    },
  },
});

export const {
  setActiveUser,
  clearActiveUser,
  setBootstrappingComplete,
} = activeUserSlice.actions;

type StateWithActiveUser = { activeUser: ActiveUserState };

export const selectActiveUser = (state: StateWithActiveUser) => state.activeUser.user;
export const selectIsAuthenticated = (state: StateWithActiveUser) => state.activeUser.isAuthenticated;
export const selectIsBootstrapping = (state: StateWithActiveUser) => state.activeUser.isBootstrapping;
export const selectActiveUserLoading = (state: StateWithActiveUser) => state.activeUser.isLoading;
export const selectActiveUserError = (state: StateWithActiveUser) => state.activeUser.error;