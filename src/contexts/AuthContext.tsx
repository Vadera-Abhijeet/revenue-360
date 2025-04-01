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
    // Check if user is already logged in by checking access token
    const accessToken = httpService.getAccessToken();
    if (accessToken && !user) {
      // Fetch user data from API instead of local storage
      httpService
        .getCurrentUser()
        .then((userData) => {
          setUser(userData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          // If we can't fetch user data, clear everything and redirect to login
          httpService.clearAllData();
          setUser(null);
          setIsLoading(false);
          navigate("/auth");
        });
    } else {
      setIsLoading(false);
    }
  }, [navigate, user]);

  const login = async (credentials: ILoginPayload) => {
    try {
      const response = await httpService.post<ILoginResponse>(
        API_CONFIG.path.login,
        credentials,
        {}, // query params
        { headers: { Authorization: undefined } } // don't send auth header for login
      );

      const { user, access, refresh } = response;

      if (!user.role) {
        throw new Error("User roles not found");
      }

      // Store tokens and user data securely
      httpService.setTokens({ access, refresh });
      httpService.setUserData(user);

      // Set user in state and navigate
      setUser(user);
      navigate(roleBasedFirstPath[user.role] || "/dashboard");
    } catch (error) {
      throw new Error((error as Error).message || "");
    }
  };

  const logout = () => {
    httpService.clearAllData();
    setUser(null);
    navigate("/auth");
  };

  const signup = async (userData: ISignUpPayload) => {
    try {
      const response = await httpService.post<SignupResponse>(
        API_CONFIG.path.register,
        userData,
        {}, // query params
        { headers: { Authorization: undefined } } // don't send auth header for signup
      );

      const { user, access, refresh } = response;

      if (!user.role) {
        throw new Error("User roles not found");
      }

      // Store tokens and user data securely
      httpService.setTokens({ access, refresh });
      httpService.setUserData(user);

      // Set user in state and navigate
      setUser(user);
      navigate(roleBasedFirstPath[user.role] || "/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!httpService.getAccessToken(), // Check access token instead of user state
    isLoading,
    login,
    logout,
    signup,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
