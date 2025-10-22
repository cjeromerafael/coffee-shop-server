// db.js
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",      // Default for XAMPP
  database: "coffee_shop_db",
  port: 3307
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

export default connection;
