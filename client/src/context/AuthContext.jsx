import React, { useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';

const AuthContext = React.createContext();

// Custom hook for using auth context
const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('AuthContext - loginWithGoogle success, uid:', result.user.uid);
            // Sync with backend
            const { uid, email, displayName, photoURL } = result.user;

            await axios.post('http://localhost:5000/api/auth/login', {
                uid,
                email,
                name: displayName,
                photoURL
            });
            return result;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    }

    function logout() {
        console.log('AuthContext - logout called');
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('AuthContext - onAuthStateChanged, user?', !!user);
            if (user) {
                try {
                    // Get MongoDB user data
                    await user.getIdToken();
                    const res = await axios.post('http://localhost:5000/api/auth/login', {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName,
                        photoURL: user.photoURL
                    });
                    // Merge Firebase user with MongoDB data
                    // Store both Firebase user object and MongoDB data
                    const mergedUser = {
                        // Firebase properties
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        // Firebase methods
                        getIdToken: () => user.getIdToken(),
                        // MongoDB data
                        ...res.data,
                        // Keep reference to auth user for logout
                        _firebaseUser: user,
                    };
                    console.log('AuthContext - merged backend user into firebase user', user.uid);
                    setCurrentUser(mergedUser);
                } catch (error) {
                    console.error("Error fetching user data", error);
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Refresh current user profile from backend and merge into firebase user object
    async function refreshCurrentUser() {
        try {
            const user = auth.currentUser;
            if (!user) return null;
            const token = await user.getIdToken();
            const res = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Merge Firebase user with updated MongoDB data
            const mergedUser = {
                // Firebase properties
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                // Firebase methods
                getIdToken: () => user.getIdToken(),
                // MongoDB data
                ...res.data,
                // Keep reference to auth user
                _firebaseUser: user,
            };
            setCurrentUser(mergedUser);
            return mergedUser;
        } catch (error) {
            console.error('Failed to refresh current user', error);
            return null;
        }
    }

    const value = {
        currentUser,
        loginWithGoogle,
        logout,
        refreshCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth };
export default AuthProvider;
