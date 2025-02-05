import { api } from "./api";



export const contactService = {
    submitForm: async (formData) => {
        try {
            const response = await api.post('/contact', formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getContact: async () => {
        try {
            const response = await api.get('/contact');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    deleteContact: async (id) => {
        try {
            const response = await api.delete(`/contact/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    updateContact: async (id, data) => {
        try {
            const response = await api.put(`/contacts/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};