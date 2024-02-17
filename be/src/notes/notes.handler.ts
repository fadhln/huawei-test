import { Router } from "express";
import { NotesModel } from "./notes.model";
import { NotesService } from "./notes.service";

const notesData: NotesModel[] = [];

const notesService = new NotesService(notesData);
const router = Router();

router.get("/", notesService.readAll).post("/", notesService.create);
export default router;
