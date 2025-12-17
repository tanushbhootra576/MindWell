import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProfileCompleteRoute - Ensures user has completed their profile
 * Redirects to profile setup if profile is not complete
 */
const ProfileCompleteRoute = ({ children, allowIncomplete = false }) => {
    const { currentUser } = useAuth();
    const [checking, setChecking] = useState(true);
    const [isComplete, setIsComplete] = useState(false);


    useEffect(() => {
        if (!currentUser) {
            setChecking(false);
            setIsComplete(false);
            return;
        }
        // Debug: log currentUser
        // eslint-disable-next-line no-console
        console.log('ProfileCompleteRoute - currentUser:', currentUser);
        console.log('ProfileCompleteRoute - currentUser.name:', currentUser.name);
        console.log('ProfileCompleteRoute - currentUser.age:', currentUser.age, 'type:', typeof currentUser.age);
        console.log('ProfileCompleteRoute - currentUser.gender:', currentUser.gender);
        console.log('ProfileCompleteRoute - currentUser.mentalHealthFocus:', currentUser.mentalHealthFocus);

        // Check if profile is complete - require: name, age (valid number >= 13), gender, and at least 1 mental health focus
        const validAge = typeof currentUser.age === 'number' && currentUser.age >= 13;
        const hasMentalHealthFocus = Array.isArray(currentUser.mentalHealthFocus) && currentUser.mentalHealthFocus.length > 0;

        const complete = currentUser &&
            currentUser.name &&
            validAge &&
            currentUser.gender &&
            hasMentalHealthFocus;

        console.log('ProfileCompleteRoute - check result:', {
            hasName: !!currentUser.name,
            validAge,
            hasGender: !!currentUser.gender,
            hasMentalHealthFocus,
            complete: !!complete
        });

        setIsComplete(!!complete);
        setChecking(false);
    }, [currentUser]);

    if (allowIncomplete) {
        return children;
    }
    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    if (checking) {
        return <div style={{ padding: 40, textAlign: 'center' }}>Checking profile...</div>;
    }
    if (!isComplete) {
        return <Navigate to="/profile?setup=true" />;
    }
    return children;
};

export default ProfileCompleteRoute;
