import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {useLocation,useNavigate,Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa'
import Grid from '@mui/material/Grid'


export default function OwnPosts() {

    const location = useLocation();
    const navigate = useNavigate();
    const id = location.state.id;

    const [top, setTop] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        getUserPosts();
    }, []);

    useEffect(() => {
        change();
    }, [top])

    const getUserPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getOwnPosts/${id}`);
            setTop(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    const change = () => {
        var newTags = []
        top.forEach(e => {
            if (e.tags != null) {
                const x = e.tags.split('><');
                x[0] = x[0].replace('<', '');
                x[x.length - 1] = x[x.length - 1].replace('>', '');
                newTags.push(x);
            }
            else {
                newTags.push(null);
            }
        })
        setTags(newTags);
        console.log(newTags)
    }

    const goToEdit = (id1,arr) =>{
        var arr2 = []
        arr.forEach((el)=>{
            var obj = {}
            obj.tag_name = el
            arr2.push(obj)
        })

        // console.log(arr2);

        navigate('/home/editPost',{
            state:{
                post_id:id1,
                tags3 : arr2,
                id: id
            }
        })
    }

    const deletePost = async(id)=>{
        try{
            const option = window.confirm("Are you sure you want to delete this post ???");
            if(option){
                const response = await axios.delete(`http://localhost:5000/deletePost/${id}`);
                console.log(response.data);
            }
            window.location.reload();
        }
        catch(error){
            console.log(error);
        }
    }

    return (
        <div>
            <div style={{marginBottom:"3vw",fontSize:"3vw",fontWeight:"700"}}>
                Your Posts
            </div>
            {top.length > 0 && top.map((el, key) => (
                <div key={key} style={{ width: "60vw", marginLeft: "auto", marginRight: "auto", marginBottom: "2vw", border: "0.2vw solid black", borderRadius: "0.4vw" }} className="box">
                    <Grid container>
                        <Grid item xs={2.4} style={{ textAlign: "right", padding: "2vw", fontSize: "1.25vw", borderRight: "0.1vw solid black" }}>
                            {el.score}  <br />
                            {el.view_count}  views <br />
                            {el.answer_count}  answers
                        </Grid>
                        <Grid item xs={9} style={{ fontSize: "1.2vw", paddingTop: "2vw" }}>
                            <div style={{ textAlign: "left", paddingLeft: "0.5vw", color: "black" }}><Link to={`/home/showPost/${el.id}`} style={{ textDecoration: "none", color: "black" }}>{el.title}</Link></div><br />
                            <Grid container>
                                <Grid item xs={8}>
                                    <div style={{ textAlign: "left", display: "flex", fontSize: "0.7vw" }}>
                                    {tags.length > 0 && tags[key] != null ? tags[key].map((el2, key2) => (
                                                <div key={key2} style={{ backgroundColor: "DodgerBlue", marginLeft: "0.4vw", padding: "0.3vw", borderRadius: "0.5vw", color: "white" }}>{el2}</div>
                                            )) : <h4>No Tags</h4>}
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    Posted by <Link to={`/dashboard/${el.owner_user_id}`}>{el.owner_user_id != null ? el.owner_user_id : el.owner_display_name}</Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={0.2}></Grid>
                        <Grid item xs={0.3}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ marginTop: "2.2vw", marginBottom: "2vw",cursor:"pointer" }} onClick={() => {goToEdit(el.id,tags[key])}}>
                                    <FaIcons.FaPenSquare size={30}/>
                                </div>
                                <div style={{cursor:"pointer"}} onClick={()=>{deletePost(el.id)}}>
                                    <FaIcons.FaTrash size={30} />
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            ))}
            {top.length === 0 && <h1 style={{fontSize:"4vw",marginTop:"3vw"}}>You Dont have any Posts !!!</h1>}
        </div>
    )
}
