const http = require("http");

const SERVICE_NAME = "gateway-service";
const PORT = parseInt(process.env.PORT || "8080", 10);

// Internal service base URLs (Kubernetes service DNS)
const ACCOUNTS_URL = process.env.ACCOUNTS_URL || "http://accounts-service";
const PAYMENTS_URL = process.env.PAYMENTS_URL || "http://payments-service";
const TRANSACTIONS_URL = process.env.TRANSACTIONS_URL || "http://transactions-service";
const AUTH_URL = process.env.AUTH_URL || "http://auth-service";


function proxyGet(baseUrl, path, res) {
  try {
    const upstreamUrl = new URL(path, baseUrl);

    const options = {
      hostname: upstreamUrl.hostname,
      port: upstreamUrl.port || 80,        // because your k8s Services expose port 80
      path: upstreamUrl.pathname + upstreamUrl.search,
      method: "GET",
      timeout: 5000,
      headers: {
        "Accept": "application/json",
      },
    };

    const upstreamReq = http.request(options, (upstreamRes) => {
      let body = "";

      upstreamRes.on("data", (chunk) => (body += chunk));
      upstreamRes.on("end", () => {
        res.writeHead(upstreamRes.statusCode || 200, {
          "Content-Type": upstreamRes.headers["content-type"] || "application/json",
        });
        res.end(body);
      });
    });

    upstreamReq.on("timeout", () => {
      upstreamReq.destroy(new Error("Upstream request timeout"));
    });

    upstreamReq.on("error", (err) => {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Bad Gateway",
          service: SERVICE_NAME,
          upstream: `${baseUrl}${path}`,
          details: err.message,
        })
      );
    });

    upstreamReq.end();
  } catch (e) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Gateway error", details: e.message }));
  }
}

const server = http.createServer((req, res) => {
  // Health check (for Kubernetes probes)
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "UP", service: SERVICE_NAME }));
  }

  // Home/info
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        message: "API Gateway Running",
        routes: {
          "/api/accounts": "accounts-service",
          "/api/payments": "payments-service",
          "/api/transactions": "transactions-service",
          "/api/auth": "auth-service",
        },
      })
    );
  }

  // Routes (gateway forwards to internal services)
  if (req.method === "GET" && req.url === "/api/accounts") {
    return proxyGet(ACCOUNTS_URL, "/api/accounts", res);
  }

  if (req.method === "GET" && req.url === "/api/payments") {
    return proxyGet(PAYMENTS_URL, "/api/payments", res);
  }

  if (req.method === "GET" && req.url === "/api/transactions") {
    return proxyGet(TRANSACTIONS_URL, "/api/transactions", res);
  }

  if (req.method === "GET" && req.url === "/api/auth") {
    return proxyGet(AUTH_URL, "/api/auth", res);
  }

  // Not found
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found", path: req.url }));
});

server.listen(PORT, () => {
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
  console.log(`ACCOUNTS_URL=${ACCOUNTS_URL}`);
  console.log(`PAYMENTS_URL=${PAYMENTS_URL}`);
  console.log(`TRANSACTIONS_URL=${TRANSACTIONS_URL}`);
  console.log(`AUTH_URL=${AUTH_URL}`);
});
