import mongoose from "mongoose";
import noteModel from "../../DB/Models/note.model.js";
import { badRequestResponse, notFoundResponse, unauthorizedResponse } from "../../Common/Response.js";

export async function CreateNote(userId, noteData) {
  const { title, content } = noteData;

  if (!title || !content) {
    badRequestResponse("Title and content are required");
  }

  await noteModel.create({
    title,
    content,
    userId,
  });

  return;
}

export async function UpdateNote(userId, noteId, updateData) {
  const note = await noteModel.findById(noteId);

  if (!note) {
    notFoundResponse("Note not found");
  }

  if (note?.userId.toString() !== userId) {
    unauthorizedResponse("You are not the owner");
  }

  if (updateData?.title !== undefined) {
    note.title = updateData.title;
  }

  if (updateData?.content !== undefined) {
    note.content = updateData.content;
  }

  await note.save();

  return note;
}

export async function ReplaceNote(userId, noteId, newData) {
  const note = await noteModel.findById(noteId);

  if (!note) {
    badRequestResponse("Note not found");
  }

  if (note.userId.toString() !== userId) {
    unauthorizedResponse("You are not the owner");
  }

  const { title, content } = newData;

  if (!title || !content) {
    badRequestResponse("Title and content are required");
  }

  const replacedNote = await noteModel.findByIdAndUpdate(
    noteId,
    {
      title,
      content,
      userId,
    },
    {
      new: true,
      overwrite: true,
      runValidators: true,
    },
  );

  return replacedNote;
}

export async function UpdateAllNotes(userId, newTitle) {
  if (!newTitle) {
    badRequestResponse("New title is required");
  }

  const result = await noteModel.updateMany(
    { userId },
    { title: newTitle },
    { runValidators: true },
  );

  if (result.matchedCount === 0) {
    notFoundResponse("No note found");
  }

  return;
}

export async function DeleteNote(userId, noteId) {
  const note = await noteModel.findById(noteId);

  if (!note) {
    notFoundResponse("Note not found");
  }

  if (note.userId.toString() !== userId) {
    unauthorizedResponse("You are not the owner");
  }

  await note.deleteOne();

  return note;
}

export async function PaginateAndSortNotes(userId, page, limit) {
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;

  const skip = (pageNumber - 1) * limitNumber;

  const notes = await noteModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  return notes;
}

export async function GetNoteById(userId, noteId) {
  const note = await noteModel.findById(noteId);

  if (!note) {
    notFoundResponse("Note not found");
  }

  if (note.userId.toString() !== userId) {
    unauthorizedResponse("You are not the owner");
  }

  return note;
}

export async function GetNoteByContent(userId, content) {
  if (!content) {
    badRequestResponse("Content is required");
  }

  content = content.replace("-", " ");

  const note = await noteModel.findOne({
    userId,
    content,
  });

  if (!note) {
    notFoundResponse("No note found");
  }

  return note;
}

export async function GetNotesWithUser(userId) {
  const notes = await noteModel
    .find({ userId })
    .select("title userId createdAt")
    .populate({
      path: "userId",
      select: "email",
    });

  return notes;
}

export async function AggregateNotes(userId, title) {
  const matchStage = {
    userId: new mongoose.Types.ObjectId(userId),
  };
  
  if (title) {
    matchStage.title = title;
  }

  const notes = await noteModel.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },

    { $unwind: "$user" },

    {
      $project: {
        title: 1,
        userId: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ]);

  return notes;
}

export async function DeleteAllNotes(userId) {

  const result = await noteModel.deleteMany({ userId });

  if (result.deletedCount === 0) {
    notFoundResponse("No note found");
  }

  return;
}