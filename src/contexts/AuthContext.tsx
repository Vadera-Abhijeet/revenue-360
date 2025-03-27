import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirstPathByRole } from "../config/routes";
import { ILoginResponse, IMerchant, SignupResponse } from "../interfaces";
import { httpService } from "../services/httpService";
import { API_CONFIG } from "../shared/constants";

export interface ISignUpPayload extends Record<string, unknown> {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginPayload extends Record<string, unknown> {
  email: string;
  password: string;
}

interface AuthContextType {
  user: IMerchant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: ILoginPayload) => Promise<void>;
  logout: () => void;
  signup: (userData: ISignUpPayload) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<IMerchant | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IMerchant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const roleBasedFirstPath = getFirstPathByRole();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: ILoginPayload) => {
    try {
      setIsLoading(true);
      const response = await httpService.post<ILoginResponse>(
        API_CONFIG.path.login,
        credentials,
        {}, // query params
        { headers: { Authorization: undefined } } // don't send auth header for login
      );

      const { user, access, refresh } = response;

      if (!user.roles || user.roles.length === 0) {
        setIsLoading(false);
        throw new Error("User roles not found");
      }

      // Store tokens and user data securely
      httpService.setTokens({ access, refresh });
      httpService.setUserData(user);

      // Set user in state and navigate
      setUser(user);
      setIsLoading(false);
      navigate(roleBasedFirstPath[user.roles[0]] || "/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    httpService.clearAllData();
    setUser(null);
    navigate("/auth");
  };

  const signup = async (userData: ISignUpPayload) => {
    try {
      setIsLoading(true);
      const response = await httpService.post<SignupResponse>(
        API_CONFIG.path.register,
        userData,
        {}, // query params
        { headers: { Authorization: undefined } } // don't send auth header for signup
      );

      const { user, access, refresh } = response;

      if (!user.roles || user.roles.length === 0) {
        setIsLoading(false);
        throw new Error("User roles not found");
      }

      // Store tokens and user data securely
      httpService.setTokens({ access, refresh });
      httpService.setUserData(user);

      // Set user in state and navigate
      setUser(user);
      setIsLoading(false);
      navigate(roleBasedFirstPath[user.roles[0]] || "/dashboard");
    } catch (error) {
      setIsLoading(false);
      console.error("Signup error:", error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
