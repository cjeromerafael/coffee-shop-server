import http from "http";
import url from "url";
import connection from "./db.js";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Allow CORS (so React can connect)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // LOGIN Route: /login?username=admin&password=1234
  if (parsedUrl.pathname === "/login" && req.method === "GET") {
    const { username, password } = parsedUrl.query;

    connection.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      (err, results) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Database error" }));
          return;
        }

        if (results.length > 0) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false }));
        }
      }
    );
  } 
  // SIGNUP Route: /signup (POST)
  else if (parsedUrl.pathname === "/signup" && req.method === "POST") {
    let body = "";

    // Collect POST data
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { username, password } = JSON.parse(body);

        // Check if username already exists
        connection.query(
          "SELECT * FROM users WHERE username = ?",
          [username],
          (err, results) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, error: "Database error" }));
              return;
            }

            if (results.length > 0) {
              res.writeHead(409, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, error: "Username already exists" }));
              return;
            }

            // Insert new user
            connection.query(
              "INSERT INTO users (username, password) VALUES (?, ?)",
              [username, password],
              (err2, result) => {
                if (err2) {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ success: false, error: "Insert failed" }));
                  return;
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
              }
            );
          }
        );
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
      }
    });
  } 
  // 404 for everything else
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
