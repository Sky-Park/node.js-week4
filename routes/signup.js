const express = require("express");
const router = express.Router();
const { users } = require("../models")
const Joi = require('joi');

router.get("/", async (req, res) => {
    
    const user = await users.findAll();

    console.log(JSON.stringify(user, null, 2));
    
    res.status(200).send({message: "localhost:3000/api/signup get"})
})
//api 되는지 확인용

router.post("/", async (req, res) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = (authorization || "").split(" ");

    if (tokenValue || tokenType === "Bearer") {
      res.status(401).send({
        errorMessage: "이미 로그인 되어있습니다.",
      });
      return;
    }

    const { nickname, password, confirmPassword } = req.body;

    const validId = await Joi.object().keys({
        nickname : Joi.string().alphanum().min(3).max(30)
    })

    const validPw = await Joi.object().keys({
        password : Joi.string().alphanum().min(4)
    })
   

    if (password !== confirmPassword) {
        res.status(400).send({
          errorMessage: "비밀번호가 비밀번호 확인란과 동일하지 않습니다.",
        });
        return;
    }
    
    const existUsers = await users.findAll({
        where: {
          nickname,
        },
    });
  
    if (existUsers.length) {
        res.status(400).send({
          errorMessage: "이미 가입된 닉네임이 있습니다.",
        });
        return;
    }
    console.log({nickname, password})

    try {
        await validId.validateAsync({nickname})
    }
    catch (err) {
        return res.status(400).send({"message": "닉네임의 형식이 올바르지 않습니다."})
    } 
    
    try {
        if (password.search(nickname) !== -1) {
            return res.status(400).send({"message": "비밀번호에 닉네임과 같은값이 있습니다."})
        }
        await validPw.validateAsync({password})
    }
    catch (err) {
        return res.status(400).send({"message": "비밀번호의 형식이 올바르지 않습니다"})
    }
    
    await users.create({ nickname, password });

    res.status(201).send({ message: "회원 가입에 성공하였습니다." });
    
});


module.exports = router; // router를 모듈로써 내보냄