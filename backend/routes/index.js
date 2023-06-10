import express from 'express';
import pool from '../config/database_connection.js';
import { addPostByID, getPostsById, getPostByTag, getTop, getPostbyId, getOwnPosts, deletePost, editPostById, addPostByID2, getPostAnswersbyId} from '../controllers/posts.js';
import { getTags,getUserDisplayNames,getUserInfo,login,logout,refreshToken,getUserDisplayNames2, checkStatus, addUser, isUsername, editUser} from '../controllers/users.js';
import { verifyToken,Testing } from '../middleware/verifyToken.js';
import bcrypt from 'bcrypt'

const router = express.Router();

router.get('/tag/:id',getTags);
router.get('/getNames', getUserDisplayNames2);
router.get('/names/:id',getUserDisplayNames);
router.get('/info/:id',getUserInfo);

router.post('/addPostById2/:id',addPostByID2);
router.get('/getPostAnswers/:id', getPostAnswersbyId);
router.post('/getPostsById',getPostsById);
router.get('/getTop',getTop);
router.get('/getPostByTag/:tag',getPostByTag);
router.post('/addPostById/:id',addPostByID);
router.get('/getPost/:id',getPostbyId);
router.get('/getOwnPosts/:id',getOwnPosts);
router.delete('/deletePost/:id',deletePost);
router.put('/editPostByID/:post_id',editPostById);
router.post('/isUser',isUsername);
router.put("/edituser/:id",editUser);

router.post('/addUser',addUser);
router.post('/login',login);
router.get('/checkStatus/:id',checkStatus);
router.get('/try',(req,res)=>{
    console.log(req.accessToken)
    res.json(req.accessToken)
})
router.delete('/logout/:id',logout);

router.get('/refreshToken',refreshToken);
router.get('/verifyToken',verifyToken,Testing);

router.get('/test',async(req,res)=>{
    try {
        const getresponse = await pool.query("select * from users");
        const rows = getresponse.rows;
        var i;
        const salt = await bcrypt.genSalt(10);
        for(i=0;i<getresponse.rowCount;i++){
            const string = await bcrypt.hash("user"+rows[i].id,salt)
            await pool.query("update users set password = $1 where id = $2",[string,rows[i].id]);
        }

        res.sendStatus(200);

    } catch (error) {
        console.log(error)
    }
})

export default router;