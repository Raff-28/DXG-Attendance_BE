import dotenv from "dotenv";
export function setupEnv() {
    try {
        dotenv.config();
    }
    catch (error) {
        console.error("Failed to load environment variables", error);
        process.exit(1);
    }
}
