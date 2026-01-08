//...requiring the mongoose for creating schema of a typical blog..
const { Schema, model } = require("mongoose");
//blog will have a title,body,cover-image,created-by(user id of that person who created the blog)
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
//naming it 
const Blog = model("blog", blogSchema);

module.exports = Blog;
