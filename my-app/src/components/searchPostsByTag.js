import React from 'react'
import { useState, useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';

export default function SearchPosts() {

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;

    const [query, setQuery] = useState('');
    const [query2, setQuery2] = useState([])
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [flag, setFlag] = useState(false);
    const [option, setOption] = useState('time');
    const [tags, setTags] = useState([]);
    const [tags2, setTags2] = useState([]);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        handleClick();
    }, [])

    useEffect(() => {
        handleClick2();
    }, [query2]);

    useEffect(() => {
        handleClick3();
    }, []);

    useEffect(() => {
        change();
    }, [data]);

    const handleClick = async () => {
        try {
            if (data2.length > 0) {
                const response = await axios.post(`http://localhost:5000/getPostsById`, { searchBy: 'tag', array: data2, option: option });
                if (response.status === 200) {
                    setData(response.data);
                    setFlag(true);
                }
            }

        } catch (error) {
            setFlag(false)
            console.log(error.response);
        }
    }

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

    const handleClick3 = async () => {
        try {
            if (query.length > 0) {
                const response = await axios.post(`http://localhost:5000/getPostsById`, { searchBy: 'userID', array: query, option: option })
                setData(response.data);
                setFlag(true)
            }
        } catch (error) {
            setFlag(false)
            console.log(error.response)
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

    const handleSwitch = () => {
        setChecked(!checked);
    }

    const goToPost = (x)=>{
        navigate(`/home/showPost/${x}`,{
            state:{
                id:id
            }
        });
    }

    return (
        <div>
            <h1>Search for posts here</h1> <br />
            <div style={{ marginBottom: "4vw" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", marginRight: "0.5vw" }}>
                        <Switch
                            checked={checked}
                            onClick={handleSwitch}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        {!checked ? "By Tag" : "By UserID"}
                    </div>

                    <FormControl required size='medium' sx={{ mr: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-required-label">Sort By</InputLabel>
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={option}
                            label="Sort By"
                            onChange={(e) => { setOption(e.target.value) }}
                        >
                            <MenuItem value={"none"}>None</MenuItem>
                            <MenuItem value={"time"}>Time</MenuItem>
                            <MenuItem value={"upvotes"}>Upvotes</MenuItem>
                        </Select>
                        <FormHelperText>Required</FormHelperText>
                    </FormControl>

                    <div>
                        {!checked ? <div style={{ display: "flex" }}> <Autocomplete
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
                            style={{ width: "35vw" }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Search By Tags"
                                    placeholder="Tags"
                                />
                            )}

                        /> <Button variant="contained" size='large' style={{ height: "2.8vw", marginLeft: "0.5vw", top: "1px" }} onClick={handleClick}>Search</Button></div> :
                            <div style={{ display: "flex" }}> <TextField
                                style={{ width: "35vw", height: "3vw", borderRadius: "0.3vw", marginRight: "0.5vw", fontSize: "1.15vw" }}
                                id="outlined-required"
                                label="Search By UserID"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); }}
                            />
                                <Button variant="contained" size='large' style={{ height: "2.8vw", marginLeft: "0vw", top: "1px" }} onClick={handleClick3}>Search</Button>
                            </div>
                        }
                    </div>
                </div>
            </div>


            {flag === true && data.length > 0 ?
                data.map((el, key) => (
                    <div key={key} style={{ width: "55vw", marginLeft: "auto", marginRight: "auto", marginBottom: "2vw", border: "0.2vw solid black", borderRadius: "0.4vw" }} className="box">
                        <Grid container>
                            <Grid item xs={3} style={{ textAlign: "right", padding: "2vw", fontSize: "1.25vw", borderRight: "0.1vw solid black" }}>
                                {el.score}  <br />
                                {el.view_count}  views <br />
                                {el.answer_count}  answers <br />
                                {/* {key} */}
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: "1.2vw", paddingTop: "2vw" }}>
                                <div style={{ textAlign: "left", paddingLeft: "0.5vw", color: "black",cursor:"pointer" }} onClick={()=>{goToPost(el.id)}}>{el.title ? el.title : "No Title"}</div><br />
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
                        </Grid>
                    </div>
                )) : <h1>No Posts found </h1>
            }
        </div>
    )
}
