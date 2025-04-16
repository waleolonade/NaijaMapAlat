// src/context/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('@user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Here you would typically call your authentication API
      // For demo purposes, we'll use a mock user
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email: email,
        phone: '+1234567890',
        token: 'mock-token-123',
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    } catch (error) {
      Alert.alert('Login Error', error.message || 'Failed to login');
      return false;
    }
  };

  // Register function
  const register = async (name, email, password, phone) => {
    try {
      // Here you would typically call your registration API
      // For demo purposes, we'll use a mock response
      const mockUser = {
        id: '2',
        name: name,
        email: email,
        phone: phone,
        token: 'mock-token-456',
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    } catch (error) {
      Alert.alert('Registration Error', error.message || 'Failed to register');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  // Update user profile
  const updateProfile = async (updatedUser) => {
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      Alert.alert('Update Error', error.message || 'Failed to update profile');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};