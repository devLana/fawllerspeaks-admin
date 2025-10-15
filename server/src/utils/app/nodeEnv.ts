type Node_Env = "development" | "production" | "test" | "demo";

export const nodeEnv: Node_Env = process.env.NODE_ENV as Node_Env;
