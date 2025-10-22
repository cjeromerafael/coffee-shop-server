// db.js
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "btnzwwriqonxchkpcr8e-mysql.services.clever-cloud.com",
  user: "u5qgxmdcd86v0edg",
  password: "jdtSpbizPOpMG85q7aEN",      
  database: "btnzwwriqonxchkpcr8e",
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

export default connection;
