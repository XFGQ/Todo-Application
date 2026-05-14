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

  const toggleComplete = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: !todo.isCompleted };
      }
      return todo;
    });
    saveTodos(updatedTodos);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const activeTodos = todos.filter(todo => !todo.isCompleted);
  const completedTodos = todos.filter(todo => todo.isCompleted);

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex flex-col items-center">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-blue-600">Welcome, {currentUser}</h1>
          <button onClick={logout} className="text-red-500 text-sm font-bold hover:underline">Logout</button>
        </div>
        
        <TodoAdd onAdd={addTodo} />
        
        {}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-700 mb-3">Active Tasks ({activeTodos.length})</h2>
          <div className="space-y-3">
            {activeTodos.map(todo => (
              <div key={todo.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  {}
                  <button 
                    onClick={() => toggleComplete(todo.id)}
                    className="w-5 h-5 rounded-full border-2 border-blue-500 hover:bg-blue-100 flex-shrink-0"
                  ></button>
                  <span className="text-gray-800 font-medium">{todo.text}</span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
              </div>
            ))}
            {activeTodos.length === 0 && <p className="text-gray-400 text-sm italic">No active tasks.</p>}
          </div>
        </div>

        {}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-green-600 mb-3">Done! ({completedTodos.length})</h2>
          <div className="space-y-3">
            {completedTodos.map(todo => (
              <div key={todo.id} className="flex justify-between items-center p-3 border rounded-lg bg-green-50 opacity-80">
                <div className="flex items-center gap-3">
                  {}
                  <button 
                    onClick={() => toggleComplete(todo.id)}
                    className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </button>
                  <span className="text-gray-500 line-through">{todo.text}</span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
              </div>
            ))}
            {completedTodos.length === 0 && <p className="text-gray-400 text-sm italic">No completed tasks yet.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}