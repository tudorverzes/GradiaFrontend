import {Analysis} from "./Analysis";

export interface Message {
    id: number;
    body: string;
    timestamp: string;
    isSentByUser: boolean;
    analysis: Analysis | null;
}