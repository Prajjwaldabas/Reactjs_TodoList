import React, { useState, useEffect } from 'react';
import './TodoList.css';
import { v4 as uuidv4 } from 'uuid';

const TodoList = () => {
  // setting states of todo items
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // Keep track of the todo being edited
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState('');




  // Fetch todos from API on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  // Handle adding a new todo
  const handleAddTodo = async () => {
    const newTodo = { title: newTodoTitle, completed: false , id: uuidv4()};
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setTodos([data, ...todos]); // add new todo at the beginning of the array
    setNewTodoTitle('');
  };

  // Handle updating a todo
  // const handleUpdateTodo = async (id, updates) => {
  //   const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(updates),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });
  //   const data = await response.json();
  //   const updatedTodos = todos.map(todo => {
  //     if (todo.id === id) {
  //       return data;
  //     } else {
  //       return todo;
  //     }
  //   });
  //   setTodos(updatedTodos);
  //   setEditingTodoId(null);
  //   setEditingTodoTitle('');
  // };

  // Handle deleting a todo
  const handleDeleteTodo = async (id) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 200) {
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      setEditingTodoId(null);
      setEditingTodoTitle('');
    }
  };

  // Handle editing a todo
  // Handle editing a todo
  const handleEditTodo = (id, title) => {
    setEditingTodoId(id);
    setEditingTodoTitle(title);
  };
  

  // Handle saving edited todo
  const handleSaveTodo = id => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, title: editingTodoTitle };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEditingTodoId(null);
    setEditingTodoTitle('');
  };
  

  return (
    <div className="todo-list">
      <h1> Reactjs Todo List</h1>
      <div className="add-todo">
          <input
            type="text"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
          />
          <button onClick={handleAddTodo} id='add-btn'>Add</button>
        </div>
      <ul>
        {todos.slice(0, 7).map((todo,index) => (

          <li key={todo.id}>
           
            {editingTodoId === todo.id ? (
              <div className="editing">
                <input
                  type="text"
                  className='editInput'
                  value={editingTodoTitle} onChange={e => setEditingTodoTitle(e.target.value)}
                  />
                  <button onClick={() => handleSaveTodo(todo.id)}>Save</button>
                </div>
              ) : (
                <div className="title">
                   <span>{index + 1}. </span>
                   {/* <input
              type="checkbox"
              checked={todo.completed}
              onChange={e => handleUpdateTodo(todo.id, { completed: e.target.checked })}
            /> */}
                  {todo.title}
                  <button className="edit-btn" onClick={() => handleEditTodo(todo.id, todo.title)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                </div>
              )}
             
            </li>
          ))}
        </ul>
        
      </div>
    );
  };
  
  export default TodoList;
  
