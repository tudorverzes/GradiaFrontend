import axios from 'axios';


const baseUrl = 'https://localhost:7245/api/account';

export const loginApi = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${baseUrl}/login`, {username: username, password: password});
        return response.data;
    }
    catch (err) {
        throw err;
    }
}

export const registerApi = async (username: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${baseUrl}/register`, {username: username, email: email, password: password});
        return response.data;
    }
    catch (err) {
        throw err;
    }
}