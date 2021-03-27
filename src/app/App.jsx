import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkedTodo,
  deleteTodo,
  fetchTodos,
} from "../features/todos/todosSlice";
import ReactLoading from "react-loading";

function App(props) {
  const todos = useSelector((state) => state.items);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  const handleDeleteTodo = (deletingTodoId) => {
    dispatch(deleteTodo(deletingTodoId));
  };

  if (todos === undefined) {
    return "";
  }

  const handleChecked = (id, completed) => {
    dispatch(checkedTodo(id, completed));
  };

  return (
    <div className="container">
      {todos.map((todo) => {
        return (
          <div className="todo">
            <div>
              <input
                checked={todo.completed}
                type="checkbox"
                onChange={() => {
                  handleChecked(todo.id, todo.completed);
                }}
              />
            </div>
            <div className="title">{todo.title}</div>
            <div>
              <div className="delete" onClick={() => handleDeleteTodo(todo.id)}>
                {todo.deleting ? (
                  <ReactLoading
                    type="spin"
                    color="green"
                    height={20}
                    width={20}
                  />
                ) : (
                  "X"
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
