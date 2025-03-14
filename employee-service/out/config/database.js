import mysql from "mysql2/promise";
export async function openConnection() {
    const pool = mysql.createPool({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        waitForConnections: true,
        connectionLimit: 10,
    });
    try {
        await pool.query("SELECT 1");
        console.log("Database connected");
    }
    catch (error) {
        console.error("Database connection failed: ", error);
        process.exit(1);
    }
    return pool;
}
export async function closeConnection(pool) {
    if (pool) {
        await pool.end();
        console.log("Database connection closed");
    }
}
