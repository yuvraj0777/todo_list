import { createContext, useContext, useReducer } from "react";
import { todoReducer } from "../TodoReducers/todoReducer";

const TodoContext = createContext();

const TodoProvider = ({ children }) => {
  const initialState = {
    todos: [],
  };

  const [{ todos }, todoDispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={{ todos, todoDispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

const useTodo = () => useContext(TodoContext);

export { TodoProvider, useTodo };
