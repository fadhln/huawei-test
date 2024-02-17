import express from "express";
import { NotesModel } from "./notes/notes.model";
import {default as notesHandler} from "./notes/notes.handler";

const app = express();
app.use(express.json())

app.get("/ping", (_req, res) => {
  res.send("pong");
});
app.use("/notes", notesHandler)

export default app;
