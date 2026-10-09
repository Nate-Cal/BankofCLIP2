import { Service } from "./Services";
import type { LoginResponse, RegisterResponse } from "../contracts/auth";

export class AuthService extends Service{

    async login(email:string, password:string): Promise<LoginResponse> {
        await this.wait();
        if (email === this.db.user.email && password === "password123") 
            return { ok: true, data: {...this.db.user } };
        return { ok: false, error: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect." } };
    }

    async register(name:string, email:string, password:string): Promise<RegisterResponse> {
        await this.wait();
        if (email === this.db.user.email) {
            return { ok: false, error: { code: "EMAIL_TAKEN", message: "That email is already registered." } };
        }
        return { ok: true, data: { id: "u2", name, email } };
    }

}