'use client';

import React, { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/components/user-profile';

type AuthContextType = {
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null
});

export const AuthProvider: React.FC<
  AuthContextType & { children: React.ReactNode }
> = ({ user, userProfile, children }) => {
  return (
    <AuthContext.Provider value={{ user, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
