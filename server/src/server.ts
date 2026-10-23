import "dotenv/config";
import app from "./app.js";
import pool from "./db.js";

const PORT = process.env.PORT;

try {
  const result = await pool.query(
    "SELECT current_database() AS database, current_user AS username",
  );

  console.log("Database connection successful:", result.rows[0]);
} catch (error) {
  console.error("Database connection failed", error);
  process.exitCode = 1;
} 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
