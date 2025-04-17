import api from './api';

interface LoginParams {
    username: string;
    password: string;
}

export const login = async (data: LoginParams) => {
    const response = await api.post('/login', data);
    return response.data;
};