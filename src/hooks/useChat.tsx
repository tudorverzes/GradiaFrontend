import {useCallback, useEffect, useState} from "react";
import {Chat} from "../props/Chat";
import {getChatApi, sendMessageApi} from "../api/ChatApi";
import {AxiosError} from "axios";

export const useChat = (id: number) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchChat = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await getChatApi(id).then(
                response => {
                    console.log(response);
                    setChat(response);
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
    }, [id]);

    const sendMessage = async (message: string) => {
        if (!chat) {
            setError('Chat not found');
            return
        }

        setLoading(true);
        setError(null);
        try {
            await sendMessageApi(chat.id, message).then(
                response => {
                    const newMessages = response.messages;
                    const orderedMessages = newMessages.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
                    setChat({...chat, messages: orderedMessages});
                });
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                setError(err.response?.data ?? 'An error occurred');
            } else {
                setError('An error occurred');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchChat().then();
    }, [fetchChat]);

    return {chat, loading, error, sendMessage};
}