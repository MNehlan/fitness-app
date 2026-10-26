import app from "./app.js";
import pool from "./db.js";
import { env } from "./config/env.js";

const PORT = env.PORT ?? 5000;

async function startServer() {
    try {
        const result = await pool.query(
            "SELECT current_database() AS database, current_user AS username",
        );

        console.log("Database connection successful:", result.rows[0]);
    } catch (error) {
        console.error("Database connection failed", error);
        process.exitCode = 1;
        return;
    }

    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    let isShutdown = false;

    process.on("SIGINT", () => {
        if (isShutdown) return;
        isShutdown = true;
        server.close(async () => {
            try {
                await pool.end();
                console.log("Shutdown completed");
            } catch (error) {
                console.error("Error during shutdown", error);
            }
        });
    });
}

startServer();
