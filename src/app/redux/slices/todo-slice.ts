import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { Todo } from ".prisma/client";

export interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: [],
};

export const todosSlice = createSlice({
  name: "Todos",
  initialState,
  reducers: {
    fetchTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((x) => x.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex((x) => x.id === action.payload.id);
      state.todos[index] = action.payload;
    },
    resetTodos: (state) => {
      state.todos = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { fetchTodos, addTodo, deleteTodo, editTodo, resetTodos } =
  todosSlice.actions;

export default todosSlice.reducer;
