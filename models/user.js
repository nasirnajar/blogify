//.using the libriary which is used to hash password...
const { createHmac, randomBytes } = require("crypto");
//..creating the schema for
const { Schema, model } = require("mongoose");
//..requiring the token creater module...
const { createTokenForUser } = require("../services/authentication");
//user will have(fullName,email,salt,pass,profileimage,role):
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  //...before the database takes the new user
  /*Used for things like:

Hashing passwords

Adding timestamps

Validation logic*/

  const user = this;

  if (!user.isModified("password")) return next(); //weather the password is new or changed..

  const salt = await randomBytes(16).toString(); //calling the randomBytesMethod for making salt..
  const hashedPassword = await createHmac("sha256", salt) //use sha256 for doing hashing with secret the
    .update(user.password)
    .digest("hex");
  //changing the password to hashed password and salt to User.salt
  this.salt = salt;
  this.password = hashedPassword;

  next();
});

//
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    //checking the email of the user during login..
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");
    //creating the hash of the password entered by the user the time of login using the salt of the user..
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    //matching the currhash with original in db...
    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
  }
);
//.....exporting the User
const User = model("user", userSchema);

module.exports = User;
