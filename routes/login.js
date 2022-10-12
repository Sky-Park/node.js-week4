const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { users } = require("../models")

 
router.post("/", async (req, res) => {
    const { nickname, password } = req.body;
  
    const user = await users.findOne({ where: { nickname, password } });
  
    if (!user) {
      res.status(400).send({
        errorMessage: "닉네임 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }
  
    const token = jwt.sign({ userId: user.userId }, "my-secret-key");
    res.send({
        token,
    });
});

module.exports = router; // router를 모듈로써 내보냄