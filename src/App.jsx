import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { useTodo } from "./Context/todoContext";
import {
  CheckCircle,
  Circle,
  Edit3,
  Trash2,
  Plus,
  Calendar,
  Tag,
  Search,
  Filter,
  Moon,
  Sun,
  Download,
  Clock,
  Flag,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Bell,
  FileText,
  BarChart3,
  Ribbon,
  Save,
} from "lucide-react";

const App = () => {
  const [todo, setTodo] = useState("");
  const { todoDispatch, todos } = useTodo();
  const [isCartInitialized, setIsCartInitialized] = useState(false);
  const refFocus = useRef(null);
  const [editId, setEditId] = useState(null);
  const [completedTodo, setCompletedTodo] = useState([]);
  const [pendingTodo, setPendingTodo] = useState([]);
  const [totalTodos, setTotalTodos] = useState(0);
  const [serarchTodo, setSearchTodo] = useState("");

  useEffect(() => {
    const storeTodos = localStorage.getItem("todos");
    const storedCompleted = localStorage.getItem("completedTodo");
    const storePending = localStorage.getItem("pendingTodo");
    const storedTotal = localStorage.getItem("totalTodos");

    if (storeTodos) {
      try {
        const parseTodos = JSON.parse(storeTodos);
        if (Array.isArray(parseTodos)) {
          todoDispatch({ type: "SET_TODOS", payload: parseTodos });
        }
      } catch (error) {
        console.error("Error parsing todos from localStorage:", error);
        localStorage.removeItem("todos");
      }
    }

    if (storedCompleted) {
      try {
        const parseCompleted = JSON.parse(storedCompleted);
        if (Array.isArray(parseCompleted)) {
          setCompletedTodo(parseCompleted);
        }
      } catch (error) {
        console.error("Error parsing completedTodo from localStorage:", error);
        localStorage.removeItem("completedTodo");
      }
    }

    if (storePending) {
      try {
        const parsePending = JSON.parse(storePending);
        if (Array.isArray(parsePending)) {
          setPendingTodo(parsePending);
        }
      } catch (error) {
        console.log("Error parsing pendingTodo from localStorage:", error);
        localStorage.removeItem("pendingTodo");
      }
    }

    if (storedTotal) {
      try {
        const parseTotal = JSON.parse(storedTotal);
        if (typeof parseTotal === "number") {
          setTotalTodos(parseTotal);
        }
      } catch (error) {
        console.error("Error parsing totalTodos from localStorage:", error);
        localStorage.removeItem("totalTodos");
      }
    }

    setIsCartInitialized(true);
  }, []);

  useEffect(() => {
    if (isCartInitialized) {
      localStorage.setItem("todos", JSON.stringify(todos));
      localStorage.setItem("completedTodo", JSON.stringify(completedTodo));
      localStorage.setItem("pendingTodo", JSON.stringify(pendingTodo));
      localStorage.setItem("totalTodos", totalTodos.toString());
    }
  }, [todos, completedTodo, totalTodos, isCartInitialized]);

  useEffect(() => {
    refFocus.current?.focus();
  }, [editId]);

  const onHandleTodo = (e) => {
    setTodo(e.target.value);
  };

  const onAddTodo = () => {
    if (todo.trim() === "") return;
    todoDispatch({
      type: "ADD_TODO",
      payload: { id: uuid(), todo: todo.trim(), checked: false },
    });
    setTodo("");
    setTotalTodos((prev) => prev + 1);
  };

  const onChecked = (id) => {
    todoDispatch({
      type: "TOGGLE_TODO",
      payload: { id },
    });
  };

  const onDelete = (id) => {
    todoDispatch({ type: "DELETE_TODO", payload: { id } });
    if (editId === id) {
      setEditId(null);
      setTodo("");
    }
  };

  const onEditStart = (item) => {
    setEditId(item.id);
    setTodo(item.todo);
  };

  const onSaveTodo = (id) => {
    if (todo.trim() === "") return;
    todoDispatch({
      type: "EDIT_TODO",
      payload: { id, todo: todo.trim() },
    });
    setEditId(null);
    setTodo("");
  };

  // const onCompletedTodo = (id) => {
  //   todoDispatch({
  //     type: "COMPLETED_TODO",
  //     payload: { id },
  //   });
  //   setCompletedTodo((prev) => [...prev, id]);
  // };

  const onCompletedTodo = (id) => {
    setCompletedTodo((prev) => [...prev, id]);

    todoDispatch({ type: "DELETE_TODO", payload: { id } });
  };

  useEffect(() => {
    if (isCartInitialized) {
      const pending = todos.filter((item) => !completedTodo.includes(item.id));
      setPendingTodo(pending);
    }
  }, [todos, completedTodo, isCartInitialized]);

  const btnDisabled = todo.trim() === "";

  console.log("Search todos", serarchTodo);

  const onSearchTodo = [...todos].filter((todo) =>
    todo.todo.toLowerCase().includes(serarchTodo.toLowerCase())
  );

  // console.log("onSearchTodo", onSearchTodo);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-2xl font-bold items-center flex justify-center">
          My todo list
        </h1>
        <div className="ml-[900px] flex w-[300px] rounded-full bg-black text-white p-2 border-r-0 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg">
          <Search className="text-gray-300 ml-2" />
          <input
            type="search"
            onChange={(e) => setSearchTodo(e.target.value)}
            placeholder="Search your todo...."
            className="w-full ml-5 bg-transparent text-white placeholder-gray-300 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <input
          onChange={onHandleTodo}
          value={todo}
          // ref={refFocus}
          type="text"
          placeholder="Add your todo...."
          className="mt-10 w-[300px] rounded-md p-2 border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
        />
        <button
          // onClick={editId ? () => onSaveTodo(editId) : onAddTodo}
          onClick={onAddTodo}
          disabled={btnDisabled}
          style={{ cursor: btnDisabled ? "not-allowed" : "pointer" }}
          className="w-[100px] h-[40px] bg-[#4dabf7] cursor-pointer rounded-md border-l-0 border-black ml-2"
        >
          Add Todo
        </button>
      </div>

      <div>
        <div className="flex flex-wrap gap-4 mt-10 justify-center">
          <div className="w-56 bg-black mt-5 rounded-md shadow-lg h-20 flex justify-start gap-5 items-center text-white">
            <div className="px-6 flex flex-col justify-start items-start">
              <h1 className="text-xl text-white">Total Task</h1>
              <h1 className="text-blue-600 text-xl font-bold">{totalTodos}</h1>
            </div>
            <BarChart3 size={30} className="ml-2 text-blue-500" />
          </div>
          <div className="w-56 bg-black mt-5 rounded-md shadow-lg h-20 flex justify-start gap-5 items-center text-white">
            <div className="px-6 flex flex-col justify-start items-start">
              <h1 className="text-xl text-white">Completed</h1>
              <h1 className="text-orange-400 text-xl font-bold">
                {completedTodo.length}
              </h1>
            </div>
            <CheckCircle size={30} className="ml-2 text-green-500" />
          </div>
          <div className="w-56 bg-black mt-5 rounded-md shadow-lg h-20 flex justify-start gap-5 items-center text-white">
            <div className="px-6 flex flex-col justify-start items-start">
              <h1 className="text-xl text-white">Pending</h1>
              <h1 className="text-orange-600 text-xl font-bold">
                {pendingTodo.length}
              </h1>
            </div>
            <Clock size={30} className="ml-2 text-red-500" />
          </div>
        </div>
        {onSearchTodo.length > 0 ? (
          <div className="bg-slate-200 mt-10 p-4 rounded-md shadow-md w-[900px] flex flex-col gap-2 justify-center items-center">
            {onSearchTodo.map((item) => (
              <label
                className={`${
                  item.checked ? "bg-red-800" : "bg-gray-500 "
                } p-4 rounded-md shadow-md flex justify-between gap-2 w-[100%] items-center`}
                key={item.id}
              >
                <div className="flex gap-3 items-center w-full">
                  <input
                    checked={item.checked}
                    onChange={() => onChecked(item.id)}
                    type="checkbox"
                  />
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={todo}
                      onChange={onHandleTodo}
                      className="rounded-lg px-2 py-1 w-full border border-black"
                    />
                  ) : (
                    <span
                      className={`flex-1 ${
                        item.checked
                          ? "line-through decoration-white px-2 py-1 text-white"
                          : ""
                      }`}
                    >
                      {item.todo}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      editId === item.id
                        ? onSaveTodo(item.id)
                        : onEditStart(item)
                    }
                    className="bg-black px-2 py-1 rounded-md text-white"
                    disabled={item.checked}
                    style={{ display: item.checked ? "none" : "block" }}
                  >
                    {editId === item.id ? "Save" : "Edit"}
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="bg-red-500 px-2 py-1 rounded-md text-white"
                    style={{ display: item.checked ? "block" : "none" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <button
                  onClick={() => onCompletedTodo(item.id)}
                  style={{ display: item.checked ? "block" : "none" }}
                  className="bg-orange-700 px-2 py-1 rounded-md text-white"
                >
                  Completed
                </button>
              </label>
            ))}
          </div>
        ) : (
          <div className={`p-12 text-center`}>
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              No todos match your search!
            </h3>
            <p className="opacity-70">
              Add your first todo to get started, or try searching for a
              different one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
