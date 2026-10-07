import { wait, fail, db } from "../utils/Database";


export const AuthService = {



  async login(email: string, password: string) {
    await wait();

    if (email === db.user.email && password === "password123") {
      return { ok: true, data: db.user };
    }

    return fail("INVALID_CREDENTIALS", "Email or password is incorrect.");
  },


  

  async register(name: string, email: string, password: string) {
    await wait();

    if (email === db.user.email || password === "password123") {
      return fail("EMAIL_TAKEN", "That email is already registered.");
    }

    return { ok: true, data: { id: "u2", name, email } };
  }
};
