const express = require("express");
const { posts } = require("../models")
const { likes } = require("../models")
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

//1. 게시글 작성
router.post("/", authMiddleware, async (req, res) => {
    console.log(res.locals.users)
    const { title, content } = req.body;
    const { userId, nickname } = res.locals.users;
    // body에 작성할 user의 정보 및 게시물의 title, content를 포함해서 받아온다.
    await posts.create({ userId, nickname, title, content });
    //async / await문 통해서 동기 처리함으로써, DB에 등록 전까지 대기상태가됨.
    res.status(201).json({
        "message" : "게시글을 생성하였습니다."
    }) //status 201 의 경우 요청이 성공적이며 무언가 생성되었음을 알리는 코드이기에 사용
});

//2. 게시글 전체 조회 
router.get("/", async (req, res) => {

    const postlist = await posts.findAll({
        attributes: {exclude : ['content']},
        order: [['createdAt', 'DESC']]
    }); 

    res.json({ "data" : postlist })
})
//6. 좋아요 누른 게시글 찾기
router.get("/like", authMiddleware, async (req, res) => {
    const { userId } = res.locals.users;
    
    const postlike = await posts.findAll({
        where: { userId },
        order: ['likesCount']
    })

    res.json ({"data": postlike})
})

//3. 게시글 상세보기
router.get("/:postId", async (req, res) => {
    const {postId} = req.params;
    //postId값 을 params에 담아서 가져옴
    const postdetail = await posts.findOne({
        where: {
            postId
        }
    })
       
    res.json({ "data" : postdetail});
});


//4. 게시글 수정하기
router.put("/:postId", authMiddleware, async (req, res) => {
    const {postId} = req.params;
    const {title, content} = req.body;
    const {userId} = res.locals.users;
    

    await posts.update({
        title,
        content,
    },{
        where:{
            userId,
            postId,
        }
    })
    res.status(201).json({"message": "게시글을 수정하였습니다."})
});


//5. 게시글 삭제하기
router.delete("/:postId", authMiddleware, async (req, res) => {
    const {postId} = req.params;
    const {userId} = res.locals.users;
    
    await posts.destroy({
        where:{
            postId,
            userId,
        }
    })
    res.json({"message": "게시글을 삭제하였습니다."})
});

//7. 게시글 좋아요 누르기
router.put("/:postId/like", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.users;

    const postLikeOne = await posts.findOne({where: {postId}})
    //포스트DB에서 좋아요 누를 해당 포스트 가져오기
    const userlike = await likes.findOne({where: { postId,userId }})
    //좋어요DB에서 좋아요한 기록있는지 찾기

    if (!userlike) {

        await postLikeOne.increment({likesCount: 1}, {where : { postId, userId }})
        await likes.create({userId, postId})
        res.json({"message": "게시글에 좋아요를 등록하였습니다."})

    } else {

        await postLikeOne.increment({likesCount: -1}, {where: {postId, userId}})
        await likes.destroy({where: {userId, postId}})
        res.json({"message": "게시글에 좋아요를 취소하였습니다."})

    }   
})


module.exports = router; // router를 모듈로써 내보냄