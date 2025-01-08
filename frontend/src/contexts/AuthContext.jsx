import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, logout as logoutAction } from '../store/slices/authSlice';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const reduxUser = useSelector(state => state.auth.user);
    const [user, setUser] = useState(reduxUser);

    // Keep local state in sync with Redux state
    useEffect(() => {
        setUser(reduxUser);
    }, [reduxUser]);

    const login = useCallback(async (tokens) => {
        try {
            // Dispatch the login action to Redux with the tokens
            const result = await dispatch(loginAction(tokens)).unwrap();
            return result;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }, [dispatch]);

    const logout = useCallback(() => {
        dispatch(logoutAction());
    }, [dispatch]);

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 