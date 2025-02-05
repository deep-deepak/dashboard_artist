// context/AlertContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context for the alert
const AlertContext = createContext();

// Create a provider component
export const AlertProvider = ({ children }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    const show = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };

    const hide = () => {
        setShowAlert(false);
    };

    return (
        <AlertContext.Provider value={{ showAlert, alertMessage, alertType, show, hide }}>
            {children}
        </AlertContext.Provider>
    );
};

// Custom hook to use the alert context
export const useAlert = () => useContext(AlertContext);
