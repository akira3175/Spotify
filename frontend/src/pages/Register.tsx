
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Logo from '@/components/sidebar/Logo';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(firstName, lastName, username, password);
      toast.success('Registered successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to register');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="mb-8">
        <Logo />
      </div>
      
      <div className="w-full max-w-md bg-spotify-base p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign up for Spotify</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <Input
              id="first_name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-zinc-800 border-zinc-700 text-white"
              placeholder="First name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-1">
              Last name
            </label>
            <Input
              id="last_name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-zinc-800 border-zinc-700 text-white"
              placeholder="Last name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-800 border-zinc-700 text-white"
              placeholder="Username"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border-zinc-700 text-white"
              placeholder="Password"
              required
              minLength={8}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">Already have an account?</p>
          <Link to="/login" className="text-white hover:underline font-medium mt-1 block">
            Log in to Spotify
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
