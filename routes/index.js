const express =  require("express");
const router = express.Router();
const postsRouter = require("./posts.js");
const commentsRouter = require("./comments.js")
const signupRouter = require("./signup.js")
const loginRouter = require("./login.js")

router.use("/posts", postsRouter);
router.use("/signup", signupRouter);
router.use("/comments", commentsRouter);
router.use("/login",loginRouter);

module.exports = router;