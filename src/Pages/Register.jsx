import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.username === username)) {
      setError('This username is already taken!');
      return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! You can now login.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Create Account</h2>
        
        {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="border p-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="border p-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}