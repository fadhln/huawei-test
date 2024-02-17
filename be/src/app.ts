import express from "express";
import { default as notesHandler } from "./notes/notes.handler";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/ping", (_req, res) => {
  res.send("pong");
});
app.use("/notes", notesHandler);

export default app;
