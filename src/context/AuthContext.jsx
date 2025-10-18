import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import bcrypt from 'bcryptjs';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('presidentialCutsUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, isBarber = false) => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !users) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValid = await bcrypt.compare(password, users.password_hash);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Check if login type matches user type
      if (isBarber && !users.is_barber) {
        throw new Error('Invalid barber credentials');
      }

      setUser(users);
      localStorage.setItem('presidentialCutsUser', JSON.stringify(users));

      return { success: true, user: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name, phone = null) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email,
          password_hash,
          name,
          phone,
          is_barber: false,
          is_owner: false
        })
        .select()
        .single();

      if (error) throw error;

      setUser(newUser);
      localStorage.setItem('presidentialCutsUser', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('presidentialCutsUser');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
