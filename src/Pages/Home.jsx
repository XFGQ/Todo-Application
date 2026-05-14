import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoAdd from '../Components/TodoAdd';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const savedTodos = JSON.parse(localStorage.getItem(`todos_${currentUser}`) || '[]');
    setTodos(savedTodos);
  }, [currentUser, navigate]);

  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem(`todos_${currentUser}`, JSON.stringify(newTodos));
  };

  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, isCompleted: false };
    saveTodos([...todos, newTodo]);
  };

  const deleteTodo = (id) => {
    saveTodos(todos.filter(todo => todo.id !== id));
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex flex-col items-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-600">Tasks for {currentUser}</h1>
          <button onClick={logout} className="text-red-500 text-sm font-bold">Logout</button>
        </div>
        
        <TodoAdd onAdd={addTodo} />
        
        <div className="space-y-3">
          {todos.map(todo => (
            <div key={todo.id} className="flex justify-between items-center p-3 border rounded">
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:font-bold">Delete</button>
            </div>
          ))}
          {todos.length === 0 && <p className="text-center text-gray-400">No tasks yet.</p>}
        </div>
      </div>
    </div>
  );
}