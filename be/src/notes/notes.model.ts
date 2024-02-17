interface CreateNotesModel {
  notes: string;
  name: string;
  email: string;
  phone: string;
}

interface NotesModel extends CreateNotesModel {
  id: number;
  createdAt: string;
}

interface ReadNotesModel extends NotesModel {
  distanceToNow: string;
}

export { CreateNotesModel, NotesModel, ReadNotesModel };
