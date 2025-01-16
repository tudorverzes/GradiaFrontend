export interface User {
    username: string;
    role: string;
}

export interface UserRegister {
    username: string;
    email: string;
    password: string;
}

export interface UserLoginResponse {
    username: string;
    token: string;
}