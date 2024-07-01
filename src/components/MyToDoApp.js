import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ToDoApp = () => {
  const [todos, setTodos] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Personal');
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [todoCategory, setTodoCategory] = useState('Personal');

  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [todos, category]);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5201/api/ToDo');
      console.log(response);

      if (!response.ok) {


        console.log();
        throw new Error(`HTTP error! status: ${response.status}`);


      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todo items:', error);

    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5201/api/ToDo/search?query=${query}`);

      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);


      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todo items:', error);
      toast.warn("Not  Found.........");

    }
  };

  const handleAddOrUpdate = async () => {
    const currentDate = new Date().toISOString().split('T')[0];


    const newTodo = { title, description, priority, category: todoCategory, createdDate: currentDate };
    const newTodo1 = { id, title, description, priority, category: todoCategory, createdDate: currentDate };


    if (currentTodo) {
      // Update existing todo
      console.log("Updated Data");
      try {
        const response = await fetch(`http://localhost:5201/api/ToDo/${currentTodo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTodo1),

        });

        if (!response.ok) {
          throw new Error(`Error updating todo item: ${response.statusText}`);
        } else {

          toast.success('Todo Updated successfully!');
          setTimeout(() => {
            fetchTodos();
          }, 1000);
        }
        
      } catch (error) {
        console.error('Error updating todo items:', error);

        toast.error("Eror"+error);
      }
    } else {
      // Add new todo
      try {

        console.log("Added Data");
        const response = await fetch('http://localhost:5201/api/ToDo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTodo),
        });

        console.log(newTodo);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
          toast.error(response.status);
        }
        const data = await response.json();
        setTodos([...todos, data]);
        toast.success('Todo added successfully!');

        setTimeout(() => {
          fetchTodos();
        }, 2000);
      } catch (error) {
        console.error('Error adding todo item:', error);
      }
    }

    setModalIsOpen(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are You sure to delete this toast") == true) {
        const response = await fetch(`http://localhost:5201/api/ToDo/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Error deleting todo item: ${response.statusText}`);
        }else{
          toast.success('Todo deleted successfully!');
          setTimeout(() => {

            fetchTodos();
            
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error deleting todo item:', error);
    }
  };

  const filterTodos = () => {
    if (category === 'All') {
      setFilteredTodos(todos); // Show all todos
    } else {
      const res = todos.filter((todo) => todo.category === category);
      setFilteredTodos(res);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const openModal = (todo = null) => {
    setCurrentTodo(todo);
    if (todo) {
      setId(todo.id)
      setTitle(todo.title);
      setDescription(todo.description);
      setPriority(todo.priority);
      setTodoCategory(todo.category);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setId('');
    setTitle('');
    setDescription('');
    setPriority('Low');
    setTodoCategory('Personal');
    setCurrentTodo(null);
  };

  return (
    <div className="p-4 bg-slate-400">

      <ToastContainer position="top-center" />
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => openModal()}
        >
          Add Todo List
        </button>
        <div>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleCategoryChange('All')}
          >
            View All Todos
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mx-2"
            onClick={() => handleCategoryChange('Personal')}
          >
            View Personal Todos
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => handleCategoryChange('Work')}
          >
            View Work Todos
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">{category} ToDo List</h1>
      <div className="mb-4  space-x-4 ">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border border-gray-300 p-2 rounded w-50%"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 "
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {filteredTodos.map((todo, index) => (
          <div key={todo.id} className="bg-white shadow-lg bg-slate-50 rounded p-4 ">
            <h2 className="font-bold text-xl text-start">Sr No: {index + 1}</h2>
            <h4 className="font-bold text-xl text-center">Title : {todo.title}</h4>
            <p></p>
            <p className=" text-xl text-center">Description : {todo.description}</p>
            <p className=" text-xl text-center">Priority: {todo.priority}</p>
            <p className=" text-xl text-center">Category: {todo.category}</p>
            <p className=" text-xl text-start">Created Date: {new Date(todo.createdDate).toLocaleDateString()}</p>
            <div className="flex space-x-96 mt-8">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => openModal(todo)}
              >
                Update
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Todo Modal">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddOrUpdate();
        }}>
          <ToastContainer position="top-center" />
          <h2 className="text-2xl font-bold mb-4">{currentTodo ? 'Update Todo' : 'Add Todo'}</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="border border-gray-300 p-2 rounded w-full mb-2"
          />
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="border border-gray-300 p-2 rounded w-full h-40 mb-2"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full mb-2"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={todoCategory}
            onChange={(e) => setTodoCategory(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full mb-2"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {currentTodo ? 'Update Todo' : 'Add Todo'}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ToDoApp;

