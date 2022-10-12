const express = require("express");
const { comments } = require("../models")
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");


//1. 댓글 작성
router.post("/:postId", authMiddleware, async (req, res) => {

    const { postId } = req.params;
    const { comment } = req.body;
    const { userId, nickname} = res.locals.users;

    await comments.create({ userId, postId, nickname, comment }, {
        where:{
            userId,
            postId,
        }
    });

    res.status(201).json({
        "message" : "댓글을 생성하였습니다."
    })
});

//2. 댓글 리스트 전체 조회 
router.get("/:postId", async (req, res) => {
    const {postId} = req.params;
    
    const commentlist = await comments.findAll({
        where:{ postId },
        attributes: {},
        order: [['createdAt', 'DESC']]
    }); 

    res.json({ "data" : commentlist })
})

//3. 댓글 수정하기
router.put("/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;
    const { userId } = res.locals.users;
    
    await comments.update({comment}, {
        where:{
            commentId,
            userId,
        }
    })

    res.status(201).json({"message": "댓글을 수정하였습니다."})
})

//5. 댓글 삭제하기
router.delete("/:commentId", authMiddleware, async (req, res) => {
    const {commentId} = req.params;
    const {userId}= res.locals.users;

    await comments.destroy({
        where:{
            commentId,
            userId,
        }
    });
    
    res.json({"message": "댓글을 삭제하였습니다."})
})

module.exports = router;