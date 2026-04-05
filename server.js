import http from "http";
import fs from "fs";

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/Todos") && req.method === "GET") {
    const data = fs.readFileSync("./Todo.json", "utf-8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
