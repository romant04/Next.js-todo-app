import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type Sorters = "priority" | "date" | "";
export type Filters = "all" | "completed" | "uncompleted";

export interface TodoFilterState {
  sortBy: Sorters;
  filterBy: Filters;
}

const initialState: TodoFilterState = {
  sortBy: "",
  filterBy: "all",
};

export const todoFiltersSlice = createSlice({
  name: "Todo filters",
  initialState,
  reducers: {
    setSorter: (state, action: PayloadAction<Sorters>) => {
      state.sortBy = action.payload;
    },
    setFilter: (state, action: PayloadAction<Filters>) => {
      state.filterBy = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSorter, setFilter } = todoFiltersSlice.actions;

export default todoFiltersSlice.reducer;
