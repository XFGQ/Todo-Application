import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoAdd from '../Components/TodoAdd';
import { getTodosFromStorage, saveTodosToStorage } from '../Interfaces/todoInterface';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const savedTodos = getTodosFromStorage(currentUser);
    setTodos(savedTodos);
  }, [currentUser, navigate]);

  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    saveTodosToStorage(currentUser, newTodos);
  };

  const addTodo = (text, tag) => {
    const newTodo = { id: Date.now(), text, tag, isCompleted: false, isDeleted: false };
    saveTodos([...todos, newTodo]);
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

  const moveToTrash = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isDeleted: true };
      }
      return todo;
    });
    saveTodos(updatedTodos);
  };

  const restoreTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isDeleted: false };
      }
      return todo;
    });
    saveTodos(updatedTodos);
  };

  const deletePermanently = (id) => {
    saveTodos(todos.filter(todo => todo.id !== id));
  };

  const deleteTag = (tagName) => {
    if (tagName === 'General') return;
    const updatedTodos = todos.map(todo => {
      if (todo.tag === tagName) {
        return { ...todo, tag: 'General' };
      }
      return todo;
    });
    saveTodos(updatedTodos);
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, text: editText };
      }
      return todo;
    });
    saveTodos(updatedTodos);
    setEditingId(null);
    setEditText('');
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const activeTodos = todos.filter(todo => !todo.isCompleted && !todo.isDeleted);
  const completedTodos = todos.filter(todo => todo.isCompleted && !todo.isDeleted);
  const deletedTodos = todos.filter(todo => todo.isDeleted);

  const allAvailableTags = [...new Set(todos.filter(todo => !todo.isDeleted).map(todo => todo.tag))];
  const activeTags = [...new Set(activeTodos.map(todo => todo.tag))];

  const sortedActiveTags = activeTags.sort((a, b) => {
    if (a === 'General') return -1;
    if (b === 'General') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex flex-col items-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-blue-600">Welcome, {currentUser}</h1>
          <button onClick={logout} className="text-red-500 text-sm font-bold hover:underline">Logout</button>
        </div>
        
        <TodoAdd onAdd={addTodo} existingTags={allAvailableTags} />
        
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Active Tasks</h2>
          
          {sortedActiveTags.length === 0 && <p className="text-gray-400 text-sm italic text-center">No active tasks.</p>}

          {sortedActiveTags.map(tagName => (
            <div key={tagName} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-black text-blue-500 uppercase tracking-wider px-1 border-l-4 border-blue-500 ml-1">
                  {tagName}
                </h3>
                {tagName !== 'General' && (
                  <button onClick={() => deleteTag(tagName)} className="text-xs font-bold text-red-400 hover:text-red-600 transition">
                    Delete Tag
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {activeTodos.filter(t => t.tag === tagName).map(todo => (
                  <div key={todo.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3 flex-1">
                      <button 
                        onClick={() => toggleComplete(todo.id)}
                        className="w-5 h-5 rounded-full border-2 border-blue-500 hover:bg-blue-100 flex-shrink-0"
                      ></button>
                      
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 border border-blue-300 rounded px-2 py-1 outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="text-gray-800 font-medium">{todo.text}</span>
                      )}
                    </div>
                    
                    <div className="flex gap-3 ml-2">
                      {editingId === todo.id ? (
                        <button onClick={() => saveEdit(todo.id)} className="text-green-600 hover:text-green-800 text-sm font-bold">Save</button>
                      ) : (
                        <button onClick={() => startEditing(todo)} className="text-blue-500 hover:text-blue-700 text-sm font-bold">Edit</button>
                      )}
                      <button onClick={() => moveToTrash(todo.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Trash</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-bold text-green-600 mb-3">Done! ({completedTodos.length})</h2>
          <div className="space-y-2">
            {completedTodos.map(todo => (
              <div key={todo.id} className="flex justify-between items-center p-3 border rounded-lg bg-green-50 opacity-80">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleComplete(todo.id)}
                    className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </button>
                  <span className="text-gray-500 line-through">
                    <span className="text-xs font-bold mr-2">[{todo.tag}]</span>
                    {todo.text}
                  </span>
                </div>
                <button onClick={() => moveToTrash(todo.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Trash</button>
              </div>
            ))}
          </div>
        </div>

        {deletedTodos.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-bold text-red-500 mb-3">Trash ({deletedTodos.length})</h2>
            <div className="space-y-2">
              {deletedTodos.map(todo => (
                <div key={todo.id} className="flex justify-between items-center p-3 border border-red-200 rounded-lg bg-red-50 opacity-70">
                  <span className="text-gray-500 line-through">
                    <span className="text-xs font-bold mr-2">[{todo.tag}]</span>
                    {todo.text}
                  </span>
                  <div className="flex gap-4">
                    <button onClick={() => restoreTodo(todo.id)} className="text-blue-500 hover:text-blue-700 text-sm font-bold">Restore</button>
                    <button onClick={() => deletePermanently(todo.id)} className="text-red-600 hover:text-red-800 text-sm font-bold">Delete Forever</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}