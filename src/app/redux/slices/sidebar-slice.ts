import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SidebarState {
  open: boolean;
}

const initialState: SidebarState = {
  open: false,
};

export const sidebarSlice = createSlice({
  name: "Sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
