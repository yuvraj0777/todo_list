import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { useTodo } from "./Context/todoContext";
import {
  CheckCircle,
  Trash2,
  Search,
  Moon,
  Sun,
  BarChart3,
  Clock,
  Bell,
  Pin,
  Github,
  Linkedin,
  PhoneCall,
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
  const [pinnedTodoIds, setPinnedTodoIds] = useState([]);
  const [theme, setTheme] = useState("light");
  const [dueDateTime, setDueDateTime] = useState("");
  const [expandedTodos, setExpandedTodos] = useState([]);
  const [phoneNo, setPhoneNo] = useState("9476890863");
  const audioRef = useRef(null);

  useEffect(() => {
    const storeTodos = localStorage.getItem("todos");
    const storedCompleted = localStorage.getItem("completedTodo");
    const storePending = localStorage.getItem("pendingTodo");
    const storedTotal = localStorage.getItem("totalTodos");
    const storedPinTodo = localStorage.getItem("pinnedTodoIds");
    const storedTheme = localStorage.getItem("theme");

    if (storeTodos) {
      try {
        const parseTodos = JSON.parse(storeTodos);
        if (Array.isArray(parseTodos)) {
          todoDispatch({ type: "SET_TODOS", payload: parseTodos });
        }
      } catch {
        localStorage.removeItem("todos");
      }
    }

    if (storedCompleted) {
      try {
        const parseCompleted = JSON.parse(storedCompleted);
        if (Array.isArray(parseCompleted)) {
          setCompletedTodo(parseCompleted);
        }
      } catch {
        localStorage.removeItem("completedTodo");
      }
    }

    if (storePending) {
      try {
        const parsePending = JSON.parse(storePending);
        if (Array.isArray(parsePending)) {
          setPendingTodo(parsePending);
        }
      } catch {
        localStorage.removeItem("pendingTodo");
      }
    }

    if (storedTotal) {
      try {
        const parseTotal = JSON.parse(storedTotal);
        if (typeof parseTotal === "number") {
          setTotalTodos(parseTotal);
        }
      } catch {
        localStorage.removeItem("totalTodos");
      }
    }

    if (storePending) {
      try {
        const parsePin = JSON.parse(storedPinTodo);
        if (Array.isArray(parsePin)) {
          setPinnedTodoIds(parsePin);
        }
      } catch {
        localStorage.removeItem("pinnedTodoIds");
      }
    }

    if (storedTheme) {
      setTheme(storedTheme);
    }

    setIsCartInitialized(true);
  }, []);

  useEffect(() => {
    if (isCartInitialized) {
      localStorage.setItem("todos", JSON.stringify(todos));
      localStorage.setItem("completedTodo", JSON.stringify(completedTodo));
      localStorage.setItem("pendingTodo", JSON.stringify(pendingTodo));
      localStorage.setItem("totalTodos", totalTodos.toString());
      localStorage.setItem("pinnedTodoIds", JSON.stringify(pinnedTodoIds));
      localStorage.setItem("theme", theme);
    }
  }, [
    todos,
    completedTodo,
    totalTodos,
    pinnedTodoIds,
    theme,
    isCartInitialized,
  ]);

  useEffect(() => {
    refFocus.current?.focus();
  }, [editId]);

  const onHandleTodo = (e) => setTodo(e.target.value);

  const onAddTodo = () => {
    if (todo.trim() === "") return;

    const currentDate = new Date();
    const dueDate = new Date(dueDateTime);

    if (dueDateTime && dueDate <= currentDate) {
      alert("Select future date!");
      setDueDateTime("");
      return;
    }

    if (dueDateTime.trim() === "") {
      alert("Please select a due date!");
      return;
    }

    todoDispatch({
      type: "ADD_TODO",
      payload: {
        id: uuid(),
        todo: todo.trim(),
        checked: false,
        dueDateTime: dueDateTime || null,
      },
    });
    setTodo("");
    setDueDateTime("");
    setTotalTodos((prev) => prev + 1);
  };

  const onChecked = (id) =>
    todoDispatch({ type: "TOGGLE_TODO", payload: { id } });

  const onDelete = (id) => {
    todoDispatch({ type: "DELETE_TODO", payload: { id } });
    if (editId === id) {
      setEditId(null);
      setTodo("");
      setDueDateTime("");
    }
  };

  const onEditStart = (item) => {
    setEditId(item.id);
    setTodo(item.todo);
    setDueDateTime(item.dueDateTime || "");
  };

  const onSaveTodo = (id) => {
    if (todo.trim() === "") return;
    todoDispatch({
      type: "EDIT_TODO",
      payload: { id, todo: todo.trim(), dueDateTime },
    });
    setEditId(null);
    setTodo("");
    setDueDateTime("");
  };

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

  const onSearchTodo = [...todos].filter((todo) =>
    todo?.todo?.toLowerCase().includes(serarchTodo.toLowerCase())
  );

  const onPinTodo = (id) => {
    if (pinnedTodoIds.includes(id)) {
      setPinnedTodoIds(pinnedTodoIds.filter((itemId) => itemId !== id));
    } else {
      setPinnedTodoIds([...pinnedTodoIds, id]);
    }
  };

  const ClearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const onHandleRead = (id) => {
    setExpandedTodos((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  const navigateToGithub = () => {
    window.open("https://github.com/yuvraj0777", "_blank");
  };

  const navigateToLinkedin = () => {
    window.open("https://www.linkedin.com/in/yuvraj-singh-gaharwar/", "_blank");
  };

  const clickToCall = () => {
    const phoneNumber = phoneNo.replace(/\D/g, "9476890863");
    window.open(`tel:${phoneNumber}`, "_blank");
  };

  const birthdayAudio = document.getElementById("birthdayAudio");

  const handleGiftBoxClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
    }
  };

  console.log("song", birthdayAudio);

  return (
    <>
      <div
        className={`flex flex-col items-center min-h-screen ${
          theme === "light" ? "bg-gray-100" : "bg-black text-white"
        } px-4 sm:px-0`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mt-5 w-full sm:w-[90%] max-w-[1200px]">
          <h1 className="text-3xl font-bold hover:text-[#a1a1aa] animate-pulse">
            TodoNest
          </h1>
          <div className="flex gap-4 justify-end mt-4 sm:mt-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              {theme === "dark" ? <Moon size={30} /> : <Sun size={30} />}
            </button>
            <div
              className={`mt-4 sm:mt-0 flex w-full sm:w-[300px] rounded-full border hover:border-blue-500 ${
                theme === "dark" ? "bg-white text-black" : "bg-black text-white"
              } p-2 shadow-lg`}
            >
              <Search
                className={`${
                  theme === "light" ? "text-gray-300" : "text-gray-500"
                } ml-2 mt-1 animate-pulse`}
              />
              <input
                type="search"
                onChange={(e) => setSearchTodo(e.target.value)}
                placeholder="Search your todo...."
                className={`w-full ml-5 bg-transparent focus:outline-none ${
                  theme === "dark"
                    ? "text-black placeholder-black"
                    : "text-white placeholder-gray-300"
                }`}
              />
            </div>
            <button
              className={`rounded-lg border ${
                theme === "light" ? "text-black bg-[orange]" : "text-white"
              } hover:bg-orange-500 focus:border-blue-500 focus:outline-none px-4 py-2 transition-colors`}
              onClick={ClearCache}
            >
              Clear Cache
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <input
            onChange={onHandleTodo}
            value={todo}
            type="text"
            placeholder="Add your todo...."
            className="w-full sm:w-[300px] text-black rounded-md p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />
          <input
            type="datetime-local"
            value={dueDateTime}
            onChange={(e) => setDueDateTime(e.target.value)}
            className="w-full sm:w-[250px] text-black rounded-md p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />
          <button
            onClick={onAddTodo}
            disabled={btnDisabled}
            style={{ cursor: btnDisabled ? "not-allowed" : "pointer" }}
            className="w-full sm:w-[100px] h-[40px] bg-[#4dabf7] rounded-md"
          >
            Add Todo
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-10 justify-center items-center w-full px-2">
          <div className="flex flex-wrap gap-4 mt-10 justify-center">
            {totalTodos > 0 && (
              <div
                className={`w-56 ${
                  theme === "light"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                } mt-5 rounded-md shadow-lg h-20 flex justify-start gap-5 items-center`}
              >
                <div className="px-6 flex flex-col justify-start items-start">
                  <h1 className="text-xl font-semibold">Total Task</h1>
                  <h1 className="text-blue-600 text-xl font-bold">
                    {totalTodos}
                  </h1>
                </div>
                <BarChart3 size={30} className="ml-2 text-blue-500" />
              </div>
            )}
            {completedTodo.length > 0 && (
              <div
                className={`w-56 ${
                  theme === "light"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                } mt-5 rounded-md shadow-lg h-20 flex justify-start gap-5 items-center`}
              >
                <div className="px-6 flex flex-col justify-start items-start">
                  <h1 className="text-xl font-semibold">Completed</h1>
                  <h1 className="text-orange-400 text-xl font-bold">
                    {completedTodo.length}
                  </h1>
                </div>
                <CheckCircle size={30} className="ml-2 text-green-500" />
              </div>
            )}
            {pinnedTodoIds.length > 0 && (
              <div
                className={`w-56 ${
                  theme === "light"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                } mt-5 rounded-md shadow-lg h-20 flex justify-start gap-5 items-center`}
              >
                <div className="px-6 flex flex-col justify-start items-start">
                  <h1 className="text-xl font-semibold">High Priority</h1>
                  <h1 className="text-orange-400 text-xl font-bold">
                    {pinnedTodoIds.length}
                  </h1>
                </div>
                <Bell size={30} className="ml-2 text-red-500" />
              </div>
            )}
            {pendingTodo.length > 0 && (
              <div
                className={`w-56 ${
                  theme === "light"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                } mt-5 rounded-md shadow-lg h-20 flex justify-start gap-5 items-center`}
              >
                <div className="px-6 flex flex-col justify-start items-start">
                  <h1 className="text-xl font-semibold">Pending</h1>
                  <h1 className="text-orange-600 text-xl font-bold">
                    {pendingTodo.length}
                  </h1>
                </div>
                <Clock size={30} className="ml-2 text-red-500" />
              </div>
            )}
          </div>

          {onSearchTodo.length > 0 ? (
            <div className="bg-slate-200 mt-10 p-4 rounded-md shadow-md w-[80%] flex flex-col gap-2 mb-10">
              {onSearchTodo.map((item) => (
                <label
                  className={`${
                    item.checked ? "bg-red-800" : "bg-gray-500"
                  } p-4 rounded-md shadow-md flex justify-between gap-2 w-full items-center`}
                  key={item.id}
                >
                  <div className="flex gap-3 items-center w-full">
                    <input
                      checked={item.checked}
                      onChange={() => onChecked(item.id)}
                      type="checkbox"
                    />
                    {editId === item.id ? (
                      <div className="flex flex-col flex-1">
                        <input
                          type="text"
                          value={todo}
                          onChange={onHandleTodo}
                          className="rounded-lg px-2 py-1 w-full border text-black border-black"
                        />
                        {/* <input
                        type="datetime-local"
                        value={dueDateTime}
                        onChange={(e) => setDueDateTime(e.target.value)}
                        className="rounded-lg px-2 py-1 w-full border border-black mt-2"
                      /> */}
                      </div>
                    ) : (
                      <div className="flex flex-col flex-1">
                        <span
                          className={`text-sm font-normal ${
                            expandedTodos.includes(item.id)
                              ? "whitespace-normal"
                              : "truncate max-w-[900px]"
                          } ${
                            item.checked
                              ? "line-through decoration-white px-2 py-1 text-white"
                              : ""
                          }`}
                          style={{
                            display: "inline-block",
                            overflow: expandedTodos.includes(item.id)
                              ? "visible"
                              : "hidden",
                          }}
                        >
                          {item.todo}
                        </span>

                        {item.todo.length > 60 && (
                          <button
                            onClick={() => onHandleRead(item.id)}
                            className={`${
                              theme === "light" ? "text-white" : "text-black"
                            } text-sm mt-1 self-start hover:underline`}
                          >
                            {expandedTodos.includes(item.id)
                              ? "Read less"
                              : "Read more"}
                          </button>
                        )}

                        {item.dueDateTime && (
                          <span
                            className={`text-sm font-bold mt-1 ${
                              new Date(item.dueDateTime) < new Date()
                                ? "text-red-500"
                                : "text-blue-700"
                            }`}
                          >
                            Due: {new Date(item.dueDateTime).toLocaleString()}
                          </span>
                        )}
                      </div>
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
                      disabled={
                        item.dueDateTime &&
                        new Date(item.dueDateTime) <= new Date()
                      }
                      style={{
                        display: item.checked ? "none" : "block",
                      }}
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
                    disabled={
                      item.dueDateTime &&
                      new Date(item.dueDateTime) <= new Date()
                    }
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => onPinTodo(item.id)}
                    className="px-2 py-1 rounded-md text-white"
                    disabled={
                      item.dueDateTime &&
                      new Date(item.dueDateTime) <= new Date()
                    }
                  >
                    {pinnedTodoIds.includes(item.id) ? (
                      <Pin className="fill-yellow-500 text-yellow-500" />
                    ) : (
                      <Pin className="text-gray-300" />
                    )}
                  </button>

                  <audio id="birthdayAudio" ref={audioRef} src={""}></audio>
                  {/* <button onClick={handleGiftBoxClick}>Play Song</button> */}
                </label>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
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
      <div
        className={`${
          theme === "light" ? "bg-black" : "bg-gray-800"
        } w-full mt-0 p-4 text-center`}
      >
        <p
          className={`${
            theme === "light"
              ? "text-[rgb(161,161,170)]"
              : "text-[rgb(161,161,170)]"
          } w-full mt-10 p-4 text-center`}
        >
          © {new Date().getFullYear()} TodoNest. All rights reserved.
          <br />
          Created by Yuvraj Singh
        </p>
        <div className="flex justify-center items-center gap-4 mt-2">
          <Github
            onClick={navigateToGithub}
            className={`cursor-pointer text-white hover:fill-white`}
          />
          <Linkedin
            onClick={navigateToLinkedin}
            className={`cursor-pointer text-white hover:fill-white`}
          />
          <PhoneCall
            onClick={clickToCall}
            className={`cursor-pointer text-white hover:fill-white`}
          />
        </div>
      </div>
    </>
  );
};

export default App;
