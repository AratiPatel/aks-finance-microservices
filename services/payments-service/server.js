const http = require("http");

const SERVICE_NAME = "payments-service";
const PORT = process.env.PORT || 8082;

const server = http.createServer((req, res) => {

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "UP", service: SERVICE_NAME }));
  }

  if (req.url === "/api/payments") {
    return res.end(JSON.stringify({
      paymentId: "PAY123",
      status: "SUCCESS",
      amount: 250,
      currency: "CAD"
    }));
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
});
