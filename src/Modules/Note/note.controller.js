import express from "express";
import { authenticate } from "../../Middlewares/auth.middlewares.js";
import {
  AggregateNotes,
  CreateNote,
  DeleteAllNotes,
  DeleteNote,
  GetNoteByContent,
  GetNoteById,
  GetNotesWithUser,
  PaginateAndSortNotes,
  ReplaceNote,
  UpdateAllNotes,
  UpdateNote,
} from "./note.service.js";
import { successResponse } from "../../Common/Response.js";

const noteRouter = express.Router();
noteRouter.post("/", authenticate, async (req, res) => {
  await CreateNote(req.userId, req.body);
  successResponse({res, message: "Note created", statusCode: 201});
});

noteRouter.get("/paginate-sort", authenticate, async (req, res) => {
  const { page, limit } = req.query;

  const notes = await PaginateAndSortNotes(req.userId, page, limit);

  successResponse({res, data: notes, message: "Paginated and sorted notes" });
});

noteRouter.get("/note-by-content", authenticate, async (req, res) => {
  const note = await GetNoteByContent(req.userId, req.query.content);

  successResponse({res, data: note});
});

noteRouter.get("/note-with-user", authenticate, async (req, res) => {
  const notes = await GetNotesWithUser(req.userId);

  successResponse({res, data: notes});
});

noteRouter.get("/aggregate", authenticate, async (req, res) => {
  const notes = await AggregateNotes(req.userId, req.query.title);

  successResponse({res, data: notes});
});

noteRouter.delete("/", authenticate, async (req, res) => {
  await DeleteAllNotes(req.userId);

  successResponse({res, message: "Deleted"});
});

noteRouter.put("/replace/:noteId", authenticate, async (req, res) => {
  const replacedNote = await ReplaceNote(
    req.userId,
    req.params.noteId,
    req.body,
  );

  successResponse({res, data: replacedNote});
});

noteRouter.patch("/all", authenticate, async (req, res) => {
  await UpdateAllNotes(req.userId, req.body.title);

  successResponse({res, message: "All notes updated"});
});

noteRouter.patch("/update/:noteId", authenticate, async (req, res) => {
  const updatedNote = await UpdateNote(req.userId, req.params.noteId, req.body);

  successResponse({res, data: updatedNote});
});

noteRouter.delete("/:noteId", authenticate, async (req, res) => {
  const deletedNote = await DeleteNote(req.userId, req.params.noteId);

  successResponse({res, data: deletedNote});
});

noteRouter.get("/:id", authenticate, async (req, res) => {
  const note = await GetNoteById(req.userId, req.params.id);

  successResponse({res, data: note});
});

export default noteRouter;