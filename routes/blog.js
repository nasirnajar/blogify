//http://localohost/8000/blog
const { Router } = require("express");
//importing the multer for clean file uploads locally
const multer = require("multer");
//path module...
const path = require("path");
//importing the blogs Schema -model
const Blog = require("../models/blog");
//importing the comments schema-model
const Comment = require("../models/comment");
//instance of router...from Router()
const router = Router();
//in local storage..
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));//the uploaded file will be saved in public folder...inside uploads
  },
  //the file named is formatted as (currentdate-originalfilename)...
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },

});
//ensuring local upload
const upload = multer({ storage: storage });
//this router gets us the addnew-blog form...from the views/blog.ejs ..we are also sending user details
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});
//...rendering blogs with particluar blogid....
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});
///...This adds a new comment only when the user is logged in..
router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
//...The router for adding a new blog...when the user is logged in..
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
