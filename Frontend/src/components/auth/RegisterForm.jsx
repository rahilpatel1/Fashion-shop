import { useState } from 'react';
import { motion } from 'framer-motion';

// Make sure this is the only export in the file
export default function RegisterForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, email, password);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
      <input
        type="text"
        value={name}
        className="w-full px-4 py-2 border rounded-lg"
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        required
      />
      </div>
      <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Email Address"
        required
        />
        </div>
        <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Password"
        minLength="6"
        required
      />
      </div>
      <div>
      <button 
        type="submit"
        className=" auth-button w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        Create Account
      </button>
        </div>
    </form>
  );
}