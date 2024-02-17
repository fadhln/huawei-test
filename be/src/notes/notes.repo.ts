import { CreateNotesModel, NotesModel } from "./notes.model";

export class NotesRepo {
  private data: NotesModel[];

  constructor(data: NotesModel[]) {
    this.data = data;
  }

  readAll() {
    return this.data;
  }

  create(newNoteData: CreateNotesModel) {
    const now = new Date();
    const id = this.data.length + 1;
    const newNote: NotesModel = {
      ...newNoteData,
      id,
      createdAt: now.toISOString(),
    };
    this.data.push(newNote);

    return this.data.findIndex((note) => note.id === id) !== -1;
  }
}
