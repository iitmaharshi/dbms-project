import axios from 'axios';
import React, { Fragment, useRef } from "react";
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Button } from "@mui/material";
import { Grid } from '@mui/material';
import htmlParser from 'html-react-parser';
import * as FacIcons from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import JoditEditor from 'jodit-react';
import '../styles/addPost.css';
import PropTypes from 'prop-types';

export default function ShowPost() {

    const obj = useParams();
    const id = obj.id;

    const location = useLocation();
    const uid = location.state?.id;

    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [tags, setTags] = useState([]);
    const [body, setBody] = useState("");
    const [flag, setFlag] = useState(true);
    const [isReadMore, setIsReadMore] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const dataForDisplay = expanded ? data2 : data2.slice(0, 4);
    const editor = useRef(null);
    const navigate = useNavigate();

    const toggleReadMore = (id) => {
        const x = 'setr'+id;
        x(!('r'+id))
    };

    useEffect(() => {
        getPost();
    }, []);

    useEffect(() => {
        change();
    }, [data]);

    const getPost = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getPost/${id}`);
            console.log("PostQuestion")
            setData(response.data);
            console.log(response.data);
            const response2 = await axios.get(`http://localhost:5000/getPostAnswers/${id}`);
            console.log("PostAnswers")
            setData2(response2.data);
            console.log(response2.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    const change = () => {
        var newTags = []
        data.forEach(e => {
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

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            if (body.length > 0) {
                const response = await axios.post(`http://localhost:5000/addPostById2/${uid}`, {
                    body: body,
                    postTypeId: 2,
                    parentId: id
                });
                console.log(response);
                window.location.reload();
                setFlag(true);
            }
            else {
                setFlag(false);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div>
            <div style={{ marginTop: "3vw", display: "flex", justifyContent: "center" }}>
                <Grid container>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10} style={{ border: "0.1vw solid black" }}>
                        {data.map((el, key) => (
                            <div key={key} style={{ padding: "1vw" }}>
                                <div style={{ fontSize: "1.5vw", textAlign: "left", fontWeight: "500", marginBottom: "0.4vw" }}>{el.title}</div>
                                <Grid container>
                                    <Grid item xs={8}>
                                        <div style={{ textAlign: "left", display: "flex", fontSize: "0.8vw" }}>
                                            {tags.length > 0 && tags[key] != null ? tags[key].map((el2, key2) => (
                                                <div key={key2} style={{ backgroundColor: "DodgerBlue", marginLeft: "0.4vw", padding: "0.3vw", borderRadius: "0.5vw", color: "white" }}>{el2}</div>
                                            )) : <h4>No Tags</h4>}
                                        </div>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <div style={{ fontSize: "1.2vw" }}>
                                            Posted by <Link to={`/dashboard/${el.owner_user_id}`}>{el.owner_user_id != null ? el.owner_user_id : el.owner_display_name}</Link>
                                        </div>
                                        <div style={{ marginLeft: "-3vw", fontSize: "1.1vw" }}><FacIcons.FaEye size={23} /> {el.view_count}</div>
                                    </Grid>
                                </Grid>
                                <hr style={{ paddingLeft: "0vw" }} />
                                <div style={{ textAlign: "left", fontSize: "1vw" }}>
                                    {el.body !== null ? htmlParser(el.body) : "No Body"}
                                </div>
                            </div>
                        ))}
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
            </div>
            {data.map((el, key) => (
                <h2 style={{ marginTop: "2vw", textAlign: "left", marginLeft: "8vw", marginBottom: "3vw" }}>Answers({el.answer_count}):</h2>
            ))}
            <div>
                {dataForDisplay.map((el, key) => (
                    <Grid key={key} container rowSpacing={3}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={10}>

                            <div key={key} style={{ padding: "1vw", margin: "10px", border: "0.1vw solid black" }}>
                                <div style={{ fontSize: "1.5vw", textAlign: "left", fontWeight: "500", marginBottom: "0.4vw" }}>{el.title}</div>
                                <Grid container>
                                    <Grid item xs={8} style={{ fontSize: "1.2vw", textAlign: "left" }}>
                                        Score : {el.score}
                                    </Grid>
                                    <Grid item xs={4} >
                                        <div style={{ fontSize: "1.2vw" }}>
                                            Answered by <Link to={`/dashboard/${el.owner_user_id}`}>{el.owner_user_id != null ? el.owner_user_id : el.owner_display_name}</Link>
                                        </div>
                                        {/* <div style={{marginLeft:"-3vw",fontSize:"1.1vw"}}><FacIcons.FaEye size={23} /> {el.view_count}</div> */}
                                    </Grid>
                                </Grid>
                                <hr style={{ paddingLeft: "0vw" }} />
                                <div style={{ textAlign: "left", fontSize: "1vw" }}>
                                    {el.body !== null ? htmlParser(el.body) : "No Body"}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                ))}
                <Button size="large" variant="contained" onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Show Less' : 'Show More'}
                </Button>
            </div>
            <Grid container>
                <Grid item xs={2}></Grid>
                <Grid item xs={10}>
                    <Fragment>
                        {flag ? "" : <p style={{ fontSize: "3vw", fontWeight: "550", color: "red" }}>All Fields are mandatory</p>}
                        <div>
                            <form onSubmit={onSubmitForm} className="addPost-Form-container" style={{marginRight:"auto",marginTop:"5vw"}}>
                                <div className="addPost-titleBar-container">
                                    <div className="addPost-elementsHead">Your Answer:</div>
                                    <JoditEditor
                                        ref={editor}
                                        value={body}
                                        onChange={newContent => setBody(newContent)}
                                    />
                                    <Button style={{ marginTop: "1vw", fontSize: "0.8vw" }} size="large" variant="contained" type="submit">Submit</Button>
                                </div>
                                <div>
                                    
                                </div>
                            </form>
                        </div>
                    </Fragment>
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        </div>

    )
}
ShowPost.propTypes = {
    data: PropTypes.array
};
