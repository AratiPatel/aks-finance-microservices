const http = require("http");

const SERVICE_NAME = "accounts-service";
const PORT = process.env.PORT || 8081;

const server = http.createServer((req, res) => {

  // Health check (used by Kubernetes)
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      status: "UP",
      service: SERVICE_NAME
    }));
  }

  // Finance endpoint
  if (req.url === "/api/accounts") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      accountId: "ACC12345",
      customerName: "John Doe",
      balance: 5400,
      currency: "CAD"
    }));
  }

  // Default response
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Endpoint not found" }));
});

server.listen(PORT, () => {
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
});
