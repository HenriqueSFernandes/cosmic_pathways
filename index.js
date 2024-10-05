import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/main", (_req, res) => {
  res.sendFile(path.join(__dirname, "views", "main.html"));
});

app.get("/credits", (_req, res) => {
  res.sendFile(path.join(__dirname, "views", "credits.html"));
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

