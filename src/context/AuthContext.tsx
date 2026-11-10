import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SellerVerificationStatus } from '../types';
import { INITIAL_USERS } from '../data/initialData';

export interface PasswordValidationResult {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

export const validatePasswordCriteria = (password: string): PasswordValidationResult => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  // Special character check: any character that is not alphanumeric
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return {
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    isValid: hasMinLength && hasUppercase && hasNumber && hasSpecialChar,
  };
};

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string, role?: UserRole) => { success: boolean; message: string };
  signupCustomer: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  }) => { success: boolean; message?: string };
  signupSeller: (data: {
    name: string;
    businessName: string;
    email: string;
    password: string;
    phone: string;
    gstNumber: string;
    address: string;
    city: string;
    pincode: string;
  }) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  updateSellerStatus: (sellerId: string, status: SellerVerificationStatus) => void;
  isSellerVerified: boolean;
}

const USERS_STORAGE_KEY = 'aurelia_users_v3';
const CURRENT_USER_KEY = 'aurelia_current_user_v3';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedCurrent = localStorage.getItem(CURRENT_USER_KEY);
    if (savedCurrent) {
      return JSON.parse(savedCurrent);
    }
    return INITIAL_USERS[3]; // Default to Collector Vikramaditya Rao
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const login = (
    email: string,
    password: string,
    role?: UserRole
  ): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      return {
        success: false,
        message: `Account not found with email "${email}". Please verify or create an account.`,
      };
    }

    // STRICT PASSWORD VERIFICATION
    if (found.password !== password) {
      return {
        success: false,
        message: 'Invalid password. Please check your credentials and try again.',
      };
    }

    // Check requested role match if specified
    if (role && found.role !== role) {
      return {
        success: false,
        message: `This account is registered as a ${found.role.toUpperCase()}, not ${role.toUpperCase()}.`,
      };
    }

    setCurrentUser(found);
    return { success: true, message: `Welcome back, ${found.name}!` };
  };

  const signupCustomer = (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  }) => {
    // Validations
    if (!data.name.trim()) return { success: false, message: 'Full name is required.' };
    if (!data.email.trim() || !data.email.includes('@')) return { success: false, message: 'Valid email is required.' };
    if (!data.phone.trim() || data.phone.trim().length < 8) return { success: false, message: 'Compulsory phone number must be at least 8 digits.' };
    if (!data.address.trim()) return { success: false, message: 'Compulsory shipping address is required.' };

    // Strict Password Rules Check
    const pwdCheck = validatePasswordCriteria(data.password);
    if (!pwdCheck.isValid) {
      return {
        success: false,
        message: 'Password does not meet all 4 mandatory security criteria (8+ chars, uppercase, number, special char).',
      };
    }

    // Check email uniqueness
    const exists = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: `cust-${Date.now()}`,
      role: 'customer',
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      phone: data.phone.trim(),
      address: data.address.trim(),
      city: data.city.trim() || 'Unspecified',
      pincode: data.pincode.trim() || '000000',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const signupSeller = (data: {
    name: string;
    businessName: string;
    email: string;
    password: string;
    phone: string;
    gstNumber: string;
    address: string;
    city: string;
    pincode: string;
  }) => {
    if (!data.name.trim()) return { success: false, message: 'Authorized representative name is required.' };
    if (!data.businessName.trim()) return { success: false, message: 'Registered antique firm or business name is required.' };
    if (!data.email.trim() || !data.email.includes('@')) return { success: false, message: 'Valid business email is required.' };
    
    // Compulsory Phone Number
    if (!data.phone.trim() || data.phone.trim().replace(/\D/g, '').length < 10) {
      return { success: false, message: 'Compulsory phone number must be at least 10 digits for seller verification.' };
    }

    // Compulsory GST Number
    const cleanedGst = data.gstNumber.trim().toUpperCase();
    if (!cleanedGst) {
      return { success: false, message: 'GST Number is COMPULSORY for all antique and curio product sellers.' };
    }
    if (cleanedGst.length !== 15) {
      return { success: false, message: 'Compulsory GST Number must be exactly 15 alphanumeric characters (e.g., 27AAACA1234D1Z8).' };
    }

    // Strict Password Rules Check
    const pwdCheck = validatePasswordCriteria(data.password);
    if (!pwdCheck.isValid) {
      return {
        success: false,
        message: 'Password does not meet all 4 mandatory security criteria (8+ chars, uppercase, number, special char).',
      };
    }

    // Check email uniqueness
    const exists = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this business email already exists.' };
    }

    const newSeller: User = {
      id: `seller-${Date.now()}`,
      role: 'seller',
      name: data.name.trim(),
      businessName: data.businessName.trim(),
      email: data.email.trim(),
      password: data.password,
      phone: data.phone.trim(),
      gstNumber: cleanedGst,
      verificationStatus: 'verified',
      address: data.address.trim(),
      city: data.city.trim() || 'Mumbai',
      pincode: data.pincode.trim() || '400001',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.businessName)}`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newSeller]);
    setCurrentUser(newSeller);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const updateSellerStatus = (sellerId: string, status: SellerVerificationStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === sellerId ? { ...u, verificationStatus: status } : u))
    );
    if (currentUser?.id === sellerId) {
      setCurrentUser((prev) => (prev ? { ...prev, verificationStatus: status } : null));
    }
  };

  const isSellerVerified =
    currentUser?.role === 'seller' && currentUser.verificationStatus === 'verified';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        signupCustomer,
        signupSeller,
        logout,
        switchUser,
        updateSellerStatus,
        isSellerVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
