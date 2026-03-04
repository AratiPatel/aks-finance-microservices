const http = require("http");

const SERVICE_NAME = "transactions-service";
const PORT = process.env.PORT || 8083;


const server = http.createServer((req, res) => {

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "UP", service: SERVICE_NAME }));
  }

  if (req.url === "/api/transactions") {
  return res.end(JSON.stringify({
    transactionId: "TXN001",
    type: "DEBIT",
    amount: 120,
    status: "COMPLETED"
  }));
}


  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
});
