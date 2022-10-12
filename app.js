const express = require("express"); //Express.js 사용할거다~~
const port = 3000; //포트는 3000번 쓸거다~
const app = express(); //app은 express 함수 사용할거다 라는 객체 선언
const router = require("./routes/index.js")



app.use(express.json());
//body-parser 사용하기위해 선언

app.use('/api', router)
// api 루트로 들어오는건 전부 router 거쳐간다~~


app.listen(port, () => {
    console.log(port, '포트로 서버 열림')
});
//서버 여는 명령어