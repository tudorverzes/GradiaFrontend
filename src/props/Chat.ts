import {Message} from "./Message";

export interface Chat {
    id: number;
    title: string;
    type: string;
    style: string;
    paperTitle: string | null;
    messages: Message[];
}

export interface ShortChat {
    id: number;
    title: string;
    type: string;
    timestamp: string;
}

export interface StartChat {
    text: string;
    style: string;
}