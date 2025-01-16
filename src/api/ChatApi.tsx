import axios from 'axios';
import {Chat, ShortChat, StartChat} from "../props/Chat";

const baseUrl = 'https://localhost:7245/api/chat';

export const getChatsApi = async () => {
    try {
        const response = await axios.get<ShortChat[]>(`${baseUrl}`);
        return response.data;
    }
    catch (err) {
        throw err;
    }
}

export const getChatApi = async (chatId: number) => {
    try {
        const response = await axios.get<Chat>(`${baseUrl}/${chatId}`);
        return response.data;
    }
    catch (err) {
        throw err;
    }
}

export const deleteChatApi = async (chatId: number) => {
    try {
        await axios.delete(`${baseUrl}/${chatId}`);
    }
    catch (err) {
        throw err;
    }
}

export const startChatApi = async (text: string, style: string) => {
    try {
        const response = await axios.post<Chat>(`${baseUrl}/chat`, {text: text, style: style});
        return response.data;
    }
    catch (err) {
        throw err;
    }
}

export const submitPaperApi = async (file: File, style: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('style', style);
        const response = await axios.post(`${baseUrl}/paper-analysis`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const sendMessageApi = async (chatId: number, text: string) => {
    try {
        const response = await axios.post<Chat>(`${baseUrl}/${chatId}`, {body: text});
        return response.data;
    }
    catch (err) {
        throw err;
    }
}