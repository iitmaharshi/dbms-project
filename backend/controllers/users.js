import pool from '../config/database_connection.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const getTags = async (req,res)=>{ // searching tag names
    try{
        var {id} = req.params;
            if(!id) return res.send("Type something");
            var string = '%'+id+'%'
            const getResult = await pool.query("select * from tags where tag_name like $1 order by tag_name limit 100",[string]);
            res.json(getResult.rows);
    }
    catch(err){
        console.log(err+"here2");
    }
}

export const getUserDisplayNames = async (req,res)=>{ // searching user display names
    try{
            var {id} = req.params;
            var string = '%'+id+'%'
            const getResult = await pool.query("select * from users where display_name ilike $1 order by display_name limit 100",[string]);
            res.json(getResult.rows);
    }
    catch(err){
        console.log(err+"here2");
    }
}

export const getUserDisplayNames2 = async (req,res)=>{
    try{
        const getResult = await pool.query("select * from users order by reputation desc limit 100");
        res.json(getResult.rows);
    }
    catch(err){
        console.log(err+"here2");
    }
}

export const getUserInfo = async (req,res)=>{ // getting user info
    try {
        const {id} = req.params;
        const getResult = await pool.query("select *,TO_CHAR(creation_date,'Day,DD Month yyyy') as date,TO_CHAR(last_access_date,'Day,DD Month yyyy, HH24:MI:SS') as date2 from users where id = $1",[id]);
        res.json(getResult.rows)
        // console.log(getResult.rows)
    } catch (error) {
        console.log(error)
    }
}

export const logout = async(req,res)=>{ // logout
    try {
        // console.log(req.cookies);
        const refreshToken = req.cookies.refreshToken;
        
        const getUser = await pool.query("select * from users where refreshToken = $1",[refreshToken]);
        const user = getUser.rows;
        
        await pool.query("update users set refreshToken = null,last_access_date=now() where id = $1",[user[0].id]);

        res.clearCookie('refreshToken');
        res.sendStatus(200);
        console.log("done");

    } catch (error) {
        console.log(error)
    }
}

export const login = async (req,res)=>{ // login
    try {
        const {username,password} = req.body
        const user = await pool.query("select * from users where username = $1",[username]);
        const row = user.rows;
        // console.log(row[0].password);

        

        if(password !== row[0].password) return res.status(400).json({msg:"Wrong username-password combination"});

        const id = row[0].id;

        const accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '360s'
        });

        const refreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });

        await pool.query("update users set refreshToken = $1 where id = $2",[refreshToken,id]);

        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge:24*60*60*1000,
        });
        res.json({ accessToken,id });

    } catch (error) {
        console.log(error)
    }
}

export const refreshToken = async (req,res)=>{
    try {
    const cookies = req.cookies;

    if(!cookies) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;

    if(!refreshToken) return res.sendStatus(403);

    const getUser = await pool.query("select * from users where refreshToken = $1",[refreshToken])
    if(!getUser) return res.sendStatus(403);

    const Newuser = getUser.rows
    const user = Newuser[0];

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) {console.log(err); return res.sendStatus(403);}
            const accessToken = jwt.sign({"id":user.id},process.env.ACCESS_TOKEN_SECRET,{
                expiresIn :'3600s'
            });
            // console.log(user.id)
            res.json({accessToken})
            // console.log("Done2")
        }
    )
    }
    catch (error) {
        console.log(error)
    }
}

export const checkStatus = async (req,res)=>{
    try {
        const id1 = req.params;
        const id = id1.id
        if(id === undefined) return res.sendStatus(403);
        const response = await pool.query("select * from users where id = $1 and refreshToken is not null",[id]);

        if(response.rowCount !== 0){
            res.sendStatus(200);
        }
        else{
            res.sendStatus(403);
        }
    } catch (error) {
        // console.log(error)
    }
}

export const addUser = async (req, res) => {
    try {
        const { displayName, location, photoUrl, AboutMe, userName, password } = req.body;

        const countExist = await (await pool.query("Select count(id) AS count from users where username = $1",[userName])).rows[0].count;

        // const countExist = 0;

        if (countExist >= 1)
        {
            res.status(400).json({msg:"user exists already!"});
        }
        else
        {
        const newUser = await pool.query("INSERT INTO users(reputation,creation_date, last_access_date,display_name,location,profile_image_url,username,password,about_me) VALUES(0,now(),now(),$1,$2,$3,$4,$5,$6) RETURNING *", [displayName, location, photoUrl, userName, password, AboutMe]);

        res.json(newUser.rows);
        }
    } catch (err) {
        console.error(err.message);
    }
};

export const isUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const countUsers = await (await pool.query("Select count(id) AS count from users where username = $1", [username])).rows[0].count;
        if (countUsers >= 1) {
            res.status(400).json({ msg: "user exists already!" });
        }
        else {
            res.json("OK");
        }
    } catch (err) {
        console.error(err.message);
    }
};

export const editUser = async (req, res) => {
    try {
        const { URL, displayName, location, username, password, aboutMe } = req.body;
        const { id } = req.params;
        const updatedUser = await pool.query("Update users set (profile_image_url,display_name ,location,username,password,about_me ) = ($1,$2,$3,$4,$5,$6) WHERE id = $7 RETURNING *", [URL, displayName, location, username, password , aboutMe, id]);

        res.json(updatedUser.rows);
    } catch (error) {
        console.error(error.message);
    }
};