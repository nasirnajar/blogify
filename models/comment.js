//creating the schema for a typical comment ..
const { Schema, model } = require("mongoose");
//comment must have content...
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "blog",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
//..naming the export mdoule as Comment..
const Comment = model("comment", commentSchema);

module.exports = Comment;
