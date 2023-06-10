import React, { useState, Fragment, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import JoditEditor from 'jodit-react';
import '../styles/addPost.css';


const EditPost = () => {
    const location = useLocation();
    const post_id = location.state.post_id;
    const id = location.state.id;

    const [post, setPost] = useState([]);
    const [query2, setQuery2] = useState([]);
    const [tags, setTags] = useState([]);
    const [tags2, setTags2] = useState(location.state.tags3);
    const [data2, setData2] = useState(location.state.tags3);
    const [body, setBody] = useState("");
    const [title, setTitle] = useState("");
    const [flag, setFlag] = useState(true);
    const editor = useRef(null);
    const navigate = useNavigate();

    // console.log(tags2)

    useEffect(() => {
        handleClick2();
        console.log("From here\n")
        console.log(data2);
    }, [query2]);

    useEffect(() => {
        getPost();
    }, []);

    useEffect(() => {
        change();
    }, [post]);

    const handleClick2 = async () => {
        try {
            if (query2.length > 0) {
                const response = await axios.get(`http://localhost:5000/tag/${query2}`);
                setTags2(response.data);
            }

        } catch (error) {
            console.log(error.response);
        }
    };

    const getPost = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getPost/${post_id}`);

            // console.log(response.data[0]);
            setTitle(response.data[0].title);
            setBody(response.data[0].body);
            setPost(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const change = () => {
        var newTags = [];
        post.forEach(e => {
            const x = e.tags.split('><');
            x[0] = x[0].replace('<', '');
            x[x.length - 1] = x[x.length - 1].replace('>', '');
            newTags.push(x);
        })
        setTags(newTags[0]);
        // console.log(newTags[0]);
    };

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            if (title.length > 0 && body.length > 0 && tags2.length > 0) {
                const response = await axios.put(`http://localhost:5000/editPostById/${post_id}`, {
                    title: title,
                    body: body,
                    tags: data2
                });
                console.log(response);
                navigate('/home/ownPosts', {
                    state: {
                        id: id
                    }
                });
                setFlag(true);
            }
            else{
                setFlag(false);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <h1 style={{ fontSize: "5vw", fontWeight: "600" }}>Edit Post</h1>
            {flag ? "" : <p style={{fontSize:"3vw",fontWeight:"550",color:"red"}}>All Fields are mandatory</p>}
            <div>
                <form onSubmit={onSubmitForm} className="addPost-Form-container">

                    <div className="addPost-titleBar-container">
                        <div className="addPost-elementsHead">Enter Title</div>
                        <TextField id="outlined-search" value={title} style={{ width: "52vw" }} type="search" onChange={(e) => { setTitle(e.target.value) }} />
                    </div>
                    <div className="addPost-titleBar-container">
                        <div className="addPost-elementsHead">Enter Body</div>
                        <JoditEditor
                            
                            ref={editor}
                            value={body}
                            onChange={newContent => setBody(newContent)}
                        />
                    </div>
                    <div>
                        <Autocomplete
                            multiple
                            id="size-small-standard-multi"
                            size="medium"
                            // value={tags3}
                            defaultValue={tags2}
                            options={tags2}
                            getOptionLabel={(option) => option.tag_name}
                            onInputChange={(event, value, reason) => {
                                // console.log(value);
                                setQuery2(value)
                            }}
                            onChange={(event, value) => { setData2(value);setQuery2([]) }}
                            style={{ width: "54vw" }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Search By Tags"
                                    placeholder="Tags"
                                />
                            )}
                        />
                        <Button style={{ marginTop: "2vw", fontSize: "1.2vw" }} size="large" variant="contained" type="submit">Submit</Button>
                    </div>

                </form>
            </div>
        </Fragment>
    );
};

export default EditPost;