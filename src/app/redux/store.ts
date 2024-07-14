import { configureStore } from "@reduxjs/toolkit";
import todoListsReducer from "./slices/todolist-slice";
import sidebarReducer from "./slices/sidebar-slice";
import todoReducer from "./slices/todo-slice";
import todoFilters from "./slices/todo-filters-slice";

export const store = configureStore({
  reducer: {
    todoLists: todoListsReducer,
    sidebar: sidebarReducer,
    todos: todoReducer,
    todoFilters: todoFilters,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
