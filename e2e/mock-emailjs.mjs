// Minimal stand-in for the EmailJS REST API, used only by the E2E suite.
//
//   POST /api/v1.0/email/send   records the request; replies 200 "OK", or 400 when
//                               template_params.from_name contains "[reject]"
//   GET  /__requests            recorded requests as JSON
//   GET  /health                readiness probe
//
// Usage: node e2e/mock-emailjs.mjs <port>

import { createServer } from "node:http";

const port = Number(process.argv[2] ?? 3199);
const requests = [];

createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") return res.end("ok");
  if (req.method === "GET" && req.url === "/__requests") {
    res.setHeader("content-type", "application/json");
    return res.end(JSON.stringify(requests));
  }
  if (req.method === "POST" && req.url === "/api/v1.0/email/send") {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      let body = null;
      try {
        body = JSON.parse(raw);
      } catch {}
      requests.push({ contentType: req.headers["content-type"], body });
      if (String(body?.template_params?.from_name ?? "").includes("[reject]")) {
        res.statusCode = 400;
        return res.end("The template ID is invalid");
      }
      res.end("OK");
    });
    return;
  }
  res.statusCode = 404;
  res.end();
}).listen(port, () => console.log(`mock emailjs on ${port}`));
