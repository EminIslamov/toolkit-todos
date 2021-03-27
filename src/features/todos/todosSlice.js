import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from '../../app/api'

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
   const json = await api.get('/todos?_limit=15');

   return json.data;
});

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (deletingTodoId, thunkAPI) => {
    try {
      await api.delete(`/todos/${deletingTodoId}`);
      return deletingTodoId;
    } catch (e) {
      return thunkAPI.rejectWithValue(alert("error"));
    }
  }
);

export const checkedTodo = createAsyncThunk(
  "todos/checkedTodo",
  async (id, completed) => {
    await api.patch(`/todos/${id}`, {
      body: JSON.stringify({ completed: !completed }),
      headers: { "Content-type": "applicationJSON" },
    });

    return id;
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  extraReducers: {
    [fetchTodos.pending]: (state) => {
      state.loading = true;
    },

    [fetchTodos.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },

    [deleteTodo.pending]: (state, action) => {
      const todoId = state.items.findIndex((item) => {
        return action.meta.arg === item.id;
      });

      state.items[todoId].deleting = true;
    },

    [deleteTodo.fulfilled]: (state, action) => {
      state.items = state.items.filter((item) => {
        return item.id !== action.payload;
      });
    },
    [deleteTodo.rejected]: (state, action) => {
      const todoId = state.items.findIndex((item) => {
        return action.meta.arg === item.id;
      });

      state.items[todoId].deleting = false;
      state.error = action.payload;
    },

    [checkedTodo.fulfilled]: (state, action) => {
      const checkIndex = state.items.findIndex((item) => {
        return item.id == action.payload;
      });
      state.items[checkIndex].completed = !state.items[checkIndex].completed;
    },
  },
});

export default todosSlice.reducer;
