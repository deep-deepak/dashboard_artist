import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, FormGroup, FormControl, FormLabel, Button, FormCheck, Spinner } from 'react-bootstrap';
import Title from '../common/Title';
import { contactService } from '../service/contactInfo';
import { toast } from 'react-toastify';

const FormWithContact = ({ initialData, onSubmit, submitButtonText = "Submit", isEditMode = false }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        amount: '',
        anonymous: false,
        dedicationMessage: '',
        phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Initialize form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                amount: initialData.amount || '',
                anonymous: initialData.anonymous || false,
                dedicationMessage: initialData.dedicationMessage || '',
                phone: initialData.phone || '',
                email: initialData.email || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for the field being changed
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Required fields except anonymous
        const requiredFields = ['firstName', 'lastName', 'amount', 'dedicationMessage', 'phone', 'email'];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
                isValid = false;
            }
        });

        // Validate email format
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Validate phone format (basic validation)
        if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
            isValid = false;
        }

        // Validate amount is a positive number
        if (formData.amount && (isNaN(formData.amount) || Number(formData.amount) <= 0)) {
            newErrors.amount = 'Amount must be a positive number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                // For edit mode, use the onSubmit prop
                await onSubmit({
                    ...formData,
                    amount: Number(formData.amount), // Ensure amount is a number
                    _id: initialData?._id // Preserve the ID for editing
                });
            } else {
                // For create mode, use the service directly
                const response = await contactService.submitForm({
                    ...formData,
                    amount: Number(formData.amount),
                    tags: "form_with_contact"
                });

                if (response) {
                    toast.success(response.message || 'Donation submitted successfully');
                    // Reset form after successful submission
                    setFormData({
                        firstName: '',
                        lastName: '',
                        amount: '',
                        anonymous: false,
                        dedicationMessage: '',
                        phone: '',
                        email: ''
                    });
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error(error.message || 'Error submitting form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title title={isEditMode ? "Edit Donation" : "Form with Contact Info"} />
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <FormGroup className="mb-3">
                            <FormLabel>First Name</FormLabel>
                            <FormControl
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                isInvalid={!!errors.firstName}
                            />
                            <FormControl.Feedback type="invalid">{errors.firstName}</FormControl.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="mb-3">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                isInvalid={!!errors.lastName}
                            />
                            <FormControl.Feedback type="invalid">{errors.lastName}</FormControl.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="mb-3">
                            <FormLabel>Amount</FormLabel>
                            <FormControl
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={formData.amount}
                                onChange={handleChange}
                                isInvalid={!!errors.amount}
                                min="0"
                                step="0.01"
                            />
                            <FormControl.Feedback type="invalid">{errors.amount}</FormControl.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="mb-3 mt-4">
                            <FormCheck
                                type="checkbox"
                                name="anonymous"
                                label="Make donation anonymous"
                                checked={formData.anonymous}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={12}>
                        <FormGroup className="mb-3">
                            <FormLabel>Dedication Message</FormLabel>
                            <FormControl
                                as="textarea"
                                name="dedicationMessage"
                                rows={3}
                                placeholder="Dedication Message"
                                value={formData.dedicationMessage}
                                onChange={handleChange}
                                isInvalid={!!errors.dedicationMessage}
                            />
                            <FormControl.Feedback type="invalid">{errors.dedicationMessage}</FormControl.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="mb-3">
                            <FormLabel>Phone</FormLabel>
                            <FormControl
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                isInvalid={!!errors.phone}
                            />
                            <FormControl.Feedback type="invalid">{errors.phone}</FormControl.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="mb-3">
                            <FormLabel>Email</FormLabel>
                            <FormControl
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <FormControl.Feedback type="invalid">{errors.email}</FormControl.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={12}>
                        <FormGroup className="submit_btn">
                            <Button
                                variant="success"
                                type="submit"
                                disabled={loading}
                                className="mt-3"
                            >
                                {loading ? (
                                    <><Spinner animation="border" size="sm" /> Submitting...</>
                                ) : (
                                    isEditMode ? submitButtonText : "Submit Donation"
                                )}
                            </Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default FormWithContact;