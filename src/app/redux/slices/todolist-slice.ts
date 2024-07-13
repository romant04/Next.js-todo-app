import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { TodoList } from ".prisma/client";

export interface TodoListState {
  todoLists: TodoList[];
  activeTodoList: TodoList | null;
}

const initialState: TodoListState = {
  todoLists: [],
  activeTodoList: null,
};

export const todoListSlice = createSlice({
  name: "TodoList",
  initialState,
  reducers: {
    fetchTodoList: (state, action: PayloadAction<TodoList[]>) => {
      state.todoLists = action.payload;
      if (!state.activeTodoList) {
        state.activeTodoList = action.payload[0];
      }
    },
    addTodoList: (state, action: PayloadAction<TodoList>) => {
      state.todoLists.push(action.payload);
      if (state.todoLists.length === 1) state.activeTodoList = action.payload;
    },
    deleteTodoList: (state, action: PayloadAction<number>) => {
      state.todoLists = state.todoLists.filter((x) => x.id !== action.payload);
      state.activeTodoList = state.todoLists[0] || null;
    },
    setActiveTodoList: (state, action: PayloadAction<number>) => {
      state.activeTodoList = state.todoLists.find(
        (x) => x.id === action.payload,
      ) as TodoList;
    },
  },
});

// Action creators are generated for each case reducer function
export const { fetchTodoList, addTodoList, deleteTodoList, setActiveTodoList } =
  todoListSlice.actions;

export default todoListSlice.reducer;
