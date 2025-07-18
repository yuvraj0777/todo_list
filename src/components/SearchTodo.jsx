import React, { useState } from "react";
import { Search } from "lucide-react";
import { useTodo } from "../Context/todoContext";

const SearchTodo = () => {
  const { todos, todoDispatch } = useTodo();
  const [serarchTodo, setSearchTodo] = useState("");

  console.log("Search todos", serarchTodo);
  // console.log("todoDispatch", todoDispatch);

  const onSearchTodo = [...todos].filter((todo) =>
    todo.todo.toLowerCase().includes(serarchTodo.toLowerCase())
  );

  // console.log("onSearchTodo", onSearchTodo);

  return (
    <>
      <div className="ml-[900px] flex w-[300px] rounded-full bg-black text-white p-2 border-r-0 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg">
        <Search className="text-gray-300 ml-2" />
        <input
          type="search"
          onChange={(e) => setSearchTodo(e.target.value)}
          placeholder="Search your todo...."
          className="w-full ml-5 bg-transparent text-white placeholder-gray-300 focus:outline-none"
        />
        
      </div>
    </>
  );
};

export default SearchTodo;
