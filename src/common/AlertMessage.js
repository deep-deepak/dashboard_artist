// components/AlertMessage.js
import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAlert } from '../context/AlertContext';

const AlertMessage = () => {
    const { showAlert, alertMessage, alertType, hide } = useAlert();

    if (!showAlert) return null;

    return (
        <Alert variant={alertType} onClose={hide} dismissible>
            {alertMessage}
        </Alert>
    );
};

export default AlertMessage;
