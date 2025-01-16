import {useEffect, useState} from "react";
import {ShortChat} from "../props/Chat";
import {useAuth} from "../context/useAuth";
import {deleteChatApi, getChatsApi, startChatApi, submitPaperApi} from "../api/ChatApi";
import {AxiosError} from "axios";
import {useIonRouter} from "@ionic/react";

export const useChats = () => {
    const [chats, setChats] = useState<ShortChat[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { loggedIn } = useAuth();

    const router = useIonRouter();

    const fetchChats = async () => {
        if (!loggedIn) {
            setError('User is not logged in');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await getChatsApi().then(
                response => {
                    setChats(response);
                });
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data ?? 'An error occurred');
            } else {
                setError('An error occurred');
            }
        } finally {
            setLoading(false);
        }
    }

    const deleteChat = async (chatId: number) => {
        setLoading(true);
        setError(null);
        try {
            await deleteChatApi(chatId).then(
                response => {
                    setChats(chats => chats.filter(chat => chat.id !== chatId));
                });
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data ?? 'An error occurred');
            } else {
                setError('An error occurred');
            }
        } finally {
            setLoading(false);
        }
    }

    const startChat = async (text: string, style: string): Promise<number | null> => {
        setLoading(true);
        setError(null);

        const validStyles = ['academic', 'formal', 'informal', 'humorous'];
        if (!validStyles.includes(style)) {
            setError('Invalid style');
            setLoading(false);
            return null;
        }

        if (text.trim().length < 1) {
            setError('Text must be at least 1 character long');
            setLoading(false);
            return null;
        }

        try {
            const response = await startChatApi(text, style);
            setLoading(false);

            return response.id ?? null;
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data ?? 'An error occurred');
            } else {
                setError('An error occurred');
            }
        } finally {
            setLoading(false);
        }

        return null;
    };


    const startPaperAnalysis = async (file: File | null, style: string): Promise<number | null> => {
        setLoading(true);
        setError(null);

        const validStyles = ['academic', 'formal', 'informal', 'humorous'];
        if (!validStyles.includes(style)) {
            setError('Invalid style');
            setLoading(false);
            return null;
        }

        if (!file) {
            setError('No file selected');
            setLoading(false);
            return null;
        }

        if (file.type !== 'application/pdf') {
            setError('File must be a PDF');
            setLoading(false);
            return null;
        }

        try {
            const response = await submitPaperApi(file, style);

            setLoading(false);
            return response.id ?? null; // Ensure we return the ID if available
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data ?? 'An error occurred');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }

        return null;
    };


    const refreshChats = async () => {
        await fetchChats();
    }

    useEffect(() => {
        fetchChats().then();
    }, []);

    return { chats, loading, error, deleteChat, refreshChats, startChat, startPaperAnalysis };
}