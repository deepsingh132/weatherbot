import { Context } from "grammy";

// Define session data structure
export interface MySession {
  step?: "city" | "frequency" | "update_city" | "update_frequency";
  city?: string;
}

export interface MyContext extends Context {
  session: MySession;
}
