import { Request, Response } from "express";
import { CreateNotesModel, NotesModel, ReadNotesModel } from "./notes.model";
import { NotesRepo } from "./notes.repo";
import { compareDesc, formatDistanceToNow, parseISO } from "date-fns";
import { errorResponse, successResponse } from "src/utils/response";
import { isEmailValid, isPhoneValid } from "src/utils";
import { StatusCodes } from "http-status-codes";

export class NotesService {
  private notesRepo: NotesRepo;

  constructor(data: NotesModel[]) {
    this.notesRepo = new NotesRepo(data);
    this.readAll = this.readAll.bind(this);
    this.create = this.create.bind(this);
  }

  readAll(_req: Request, res: Response) {
    const gotData = this.notesRepo.readAll();
    if (gotData.length < 1) {
      return successResponse(res, []);
    }

    gotData.sort((a, b) =>
      compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
    );

    const sendData: ReadNotesModel[] = gotData.map((d) => ({
      ...d,
      distanceToNow: formatDistanceToNow(parseISO(d.createdAt)),
    }));

    return successResponse(res, sendData);
  }

  create(req: Request, res: Response) {
    if (!req.body) {
      return errorResponse(
        res,
        null,
        "Request body is missing",
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    if (!req.body?.notes) {
      return errorResponse(
        res,
        null,
        "Notes is missing",
        StatusCodes.BAD_REQUEST
      );
    }

    const notes = String(req.body?.notes);
    if (notes.length < 3) {
      return errorResponse(
        res,
        null,
        "Notes length cannot be less than 3 characters",
        StatusCodes.BAD_REQUEST
      );
    }

    if (notes.length > 255) {
      return errorResponse(
        res,
        null,
        "Notes length cannot be more than 255 characters"
      );
    }

    if (!req.body?.name) {
      return errorResponse(
        res,
        null,
        "Name is missing",
        StatusCodes.BAD_REQUEST
      );
    }

    const name = String(req.body?.name);
    if (name.length < 1) {
      return errorResponse(res, null, "Name cannot be empty");
    }
    if (name.length > 255) {
      return errorResponse(
        res,
        null,
        "Name length cannot be more than 255 characters"
      );
    }

    if (!req.body?.email) {
      return errorResponse(
        res,
        null,
        "Email is missing",
        StatusCodes.BAD_REQUEST
      );
    }

    const email = String(req.body?.email).toLowerCase();
    if (!isEmailValid(email)) {
      return errorResponse(res, null, "E-mail is not valid");
    }

    if (!req.body?.phone) {
      return errorResponse(
        res,
        null,
        "Phone is missing",
        StatusCodes.BAD_REQUEST
      );
    }

    const phone = String(req.body?.phone);
    if (!isPhoneValid(phone)) {
      return errorResponse(res, null, "Phone number is not valid");
    }

    if (
      !this.notesRepo.create({
        email,
        name,
        notes,
        phone,
      })
    ) {
      return errorResponse(res, null, "Notes is not created");
    }

    return successResponse(res, null, StatusCodes.CREATED);
  }
}
