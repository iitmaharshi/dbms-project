import pool from '../config/database_connection.js';

const queryMaker = (array,option)=>{

    var arr = [];

    array.forEach(el => {
        arr.push(el.tag_name);
    });

    // console.log(arr)

    const string = "select * from posts where ";
    var newString;
    var i;
    for(i=0;i<arr.length;i++){
        if(i == 0){
            newString = string.concat(`tags like '%<${arr[i]}>%' and `);
        }
        else{
            newString = newString.concat(`tags like '%<${arr[i]}>%' and `);
        }
    }
    const length = newString.length;
    newString = newString.slice(0,length-5);
    if(option === 'time'){
        newString = newString.concat(" order by creation_date desc");
    }
    else if(option === 'upvotes'){
        newString = newString.concat(" order by score desc");
    }
    return newString;
}

export const getPostsById = async (req,res)=>{
    try {
        const {searchBy,array,option} = req.body;
        var getPosts;
        // console.log(array);
        if(searchBy === 'tag'){
            const string = queryMaker(array,option);
            // console.log(string)
            getPosts = await pool.query(string);
        }
        else{
            if(option === 'time'){
                getPosts = await pool.query("select * from posts where owner_user_id = $1 order by creation_date desc",[array]);
            }
            else if(option === 'upvotes'){
                getPosts = await pool.query("select * from posts where owner_user_id = $1 order by score desc",[array]);
            }
            else{
                getPosts = await pool.query("select * from posts where owner_user_id = $1",[array]);
            }
        }
        if(getPosts.rowCount === 0){
            console.log("here")
            return res.sendStatus(500);
        }
        res.json(getPosts.rows);
        
    } catch (error) {
        console.log(error)
    }
}

export const getTop = async (req,res)=>{
    try {
        const getTop = await pool.query("select * from posts where post_type_id = 1 order by score desc limit 10");
        // console.log(getTop);
        res.json(getTop.rows);
    } catch (error) {
        console.log(error)
    }
}

export const getPostByTag = async (req,res)=>{
    try {
        // console.log("here")
        const {tag} = req.params;
        const query = "%"+tag+"%";
        const getPosts = await pool.query("select * from posts where tags like $1",[query]);
        res.json(getPosts.rows);
    } catch (error) {
        console.log(error);
    }
}

const TagExtractor = (tags)=>{
   var tagString = "";
   tags.forEach((el)=>{
    tagString = tagString.concat(`<${el.tag_name}>`)
   })

   return tagString;
}

export const addPostByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, tags, body, postTypeId } = req.body;

        const tagString = TagExtractor(tags);
        // console.log(tagString);

        const newPost = await pool.query("INSERT INTO posts(owner_user_id,post_type_id,score,title,tags,content_license,body,creation_date) values($1,$5,0,$2,$3,'No licencse',$4,now()) RETURNING *;",[id,title,tagString,body,postTypeId]);

        res.json(newPost.rows);
    } catch (err) {
        console.error(err.message);
    }
};

export const addPostByID2 = async (req, res) => {
    try {
        const { id } = req.params;
        const { body, postTypeId, parentId } = req.body;

        const newPost = await pool.query("INSERT INTO posts(owner_user_id,post_type_id,score,parent_id,content_license,body,creation_date) values($1,$2,0,$3,'No licencse',$4,now()) RETURNING *;",[id,postTypeId,parentId,body]);

        res.json(newPost.rows);
    } catch (err) {
        console.error(err.message);
    }
};

export const editPostById = async (req,res)=>{
    try {
        const {title,body,tags} = req.body;
        const post_id = req.params;
        const response = await pool.query("update posts set title = $1,body = $2,tags = $3 where id = $4",[title,body,TagExtractor(tags),post_id.post_id]);
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
    }
}

export const getPostbyId =  async (req,res)=>{
    try {
        const {id} = req.params;
        const getPost = await pool.query("select * from posts where id = $1",[id]);
        // console.log(getPost.rows);
        res.send(getPost.rows);
    } catch (error) {
        console.log(error);
    }
}

export const getOwnPosts = async (req,res)=>{
    try {
        const {id} = req.params;
        const response = await pool.query('select * from posts where owner_user_id = $1 and post_type_id=1',[id]);
        // console.log(response.rows);
        res.json(response.rows);
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req,res)=>{
    try {
        const {id} = req.params;
        const response = await pool.query('delete from posts where id = $1',[id]);
        if(response.rowCount !== 0){
            console.log("here")
           return res.sendStatus(200);
        }
        return res.sendStatus(403);
        
    } catch (error) {
        console.log(error);
    }
}

export const getPostAnswersbyId =  async (req,res)=>{
    try {
        const {id} = req.params;
        const getPost = await pool.query("select * from posts where parent_id = $1 and post_type_id = '2' order by score desc",[id]);
        // console.log(getPost.rows);
        res.send(getPost.rows);
    } catch (error) {
        console.log(error);
    }
}

