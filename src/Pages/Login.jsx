import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('currentUser', 'admin');
      navigate('/todos');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      localStorage.setItem('currentUser', username);
      navigate('/todos');
    } else {
      setError('Invalid username or password!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Login</h2>
        
        {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          New here? <Link to="/register" className="text-green-600 font-bold hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
}