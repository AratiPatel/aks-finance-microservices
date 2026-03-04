const http = require("http");

const SERVICE_NAME = "auth-service";
const PORT = process.env.PORT || 8084;

const server = http.createServer((req, res) => {

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "UP", service: SERVICE_NAME }));
  }

  if (req.url === "/api/auth") {
  return res.end(JSON.stringify({
    user: "john.doe",
    token: "fake-jwt-token",
    role: "customer"
  }));
}

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
});
