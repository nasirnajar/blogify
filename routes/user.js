const { Router } = require("express");
const User = require("../models/user");

const router = Router();
//...router to render the signin page when clicked on create acc in the navbar-of homepage
router.get("/signin", (req, res) => {
  return res.render("signin");
});
////...router to render the signup page when clicked on create acc in the navbar-of homepage .
router.get("/signup", (req, res) => {
  return res.render("signup");
});

//...router to render the login page ...
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password); //Authentication of email asn
    //password...
    //if successfully signup then direct to the home-page
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});
//route to logout when logged in...this clears the token..
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});
//...router to render  the signup page when the user clicks on signup ...
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

//for uploading profile pic...
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploadProfile/`)); //the uploaded file will be saved in public folder...inside uploads
  },
  //the file named is formatted as (currentdate-originalfilename)...
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
//ensuring local upload
const upload = multer({ storage: storage });

router.get("/uploadProfile", (req, res) => {
  
  return res.render("", {
    user: req.user,
  });
});

module.exports = router;
