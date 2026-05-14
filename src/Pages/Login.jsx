import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('userMode', 'local');
      localStorage.setItem('username', 'admin');
      navigate('/todos');
      return;
    }

    try {
      localStorage.setItem('userMode', 'server');
      console.log("Server request sent:", { username, password });
      
      localStorage.setItem('username', username);
      navigate('/todos'); 
    } catch (err) {
      setError('Connection error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}