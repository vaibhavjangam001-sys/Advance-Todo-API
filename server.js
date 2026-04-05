import http from "http";
import fs from "fs";

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ IMPORTANT for preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  const data = JSON.parse(fs.readFileSync("./Todo.json", "utf-8"));

  // ✅ GET ALL
  if (req.url === "/Todos" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(data));
  }

  // ✅ DELETE
  if (req.url.startsWith("/Todos/") && req.method === "DELETE") {
    const id = req.url.split("/")[2];

    data.Todos = data.Todos.filter((item) => item.id != id);

    fs.writeFileSync("./Todo.json", JSON.stringify(data, null, 2));

    res.writeHead(200);
    return res.end(JSON.stringify({ message: "Deleted" }));
  }

  // ✅ PATCH (UPDATE)
  if (req.url.startsWith("/Todos/") && req.method === "PATCH") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      const id = req.url.split("/")[2];
      const updatedData = JSON.parse(body);

      data.Todos = data.Todos.map((item) =>
        item.id == id ? { ...item, ...updatedData } : item
      );

      fs.writeFileSync("./Todo.json", JSON.stringify(data, null, 2));

      res.writeHead(200);
      res.end(JSON.stringify({ message: "Updated" }));
    });

    return;
  }

  // ❌ NOT FOUND
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});