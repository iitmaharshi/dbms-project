import React, { useState, Fragment, useEffect, useRef } from "react";
import axios from 'axios';
import { useNavigate, useParams,useLocation } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import JoditEditor from 'jodit-react';
import '../styles/addPost.css';


const AddPost = () => {
    const location = useLocation();

    const id = location.state.id;

    const [query2, setQuery2] = useState([]);
    const [tags2, setTags2] = useState([]);
    const [data2, setData2] = useState([]);
    const [body, setBody] = useState("");
    const [title, setTitle] = useState("");
    const [flag, setFlag] = useState(true);
    const editor = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        handleClick2();
    }, [query2])

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

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            if (title.length > 0 && body.length > 0 && tags2.length > 0) {
                const response = await axios.post(`http://localhost:5000/addPostById/${id}`, {
                    title: title,
                    body: body,
                    postTypeId: 1,
                    tags: data2
                });
                console.log(response);
                setFlag(true);
                navigate('/home');
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
            <h1 style={{ fontSize: "5vw", fontWeight: "600" }}>Create Posts</h1>
            {flag ? "" : <p style={{fontSize:"3vw",fontWeight:"550",color:"red"}}>All Fields are mandatory</p>}
            <div>
                <form onSubmit={onSubmitForm} className="addPost-Form-container">

                    <div className="addPost-titleBar-container">
                        <div className="addPost-elementsHead">Enter Title</div>
                        <TextField id="outlined-search" label="Enter Title" style={{ width: "52vw" }} type="search" onChange={(e) => { setTitle(e.target.value) }} />
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
                            options={tags2}
                            getOptionLabel={(option) => option.tag_name}
                            onInputChange={(event, value, reason) => {
                                // console.log(value);
                                setQuery2(value)
                            }}
                            onChange={(event, value) => { setData2(value); setQuery2([]) }}
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

export default AddPost;