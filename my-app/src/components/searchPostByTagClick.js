import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
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

export default function SeacrhPostByTagClick() {

  const obj = useParams();
  const tag = obj.tag;
  let i=0;

  const [data, setData] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    change();
  }, [data]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/getPostByTag/${tag}`);
      // console.log(response.data);
      setData(response.data);
    } catch (error) {
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

  return (
    <div>
      <h1>Posts Tagged with {tag}</h1><br/>


      {data.map((el, key) => (
        <div key={key} style={{ width: "55vw", marginLeft: "auto", marginRight: "auto", marginBottom: "2vw", border: "0.2vw solid black", borderRadius: "0.4vw" }} className="box">
          <Grid container>
            <Grid item xs={3} style={{ textAlign: "right", padding: "2vw", fontSize: "1.25vw", borderRight: "0.1vw solid black" }}>
              {el.score}  <br />
              {el.view_count}  views <br />
              {el.answer_count}  answers <br />
              {key}
            </Grid>
            <Grid item xs={9} style={{ fontSize: "1.2vw", paddingTop: "2vw" }}>
              <div style={{ textAlign: "left", paddingLeft: "0.5vw", color: "black" }}>{el.title ? el.title : "No title"}</div><br />
              <Grid container>
                <Grid item xs={8}>
                  <div style={{ textAlign: "left", display: "flex", fontSize: "0.7vw" }}>
                    {tags.length > 0 && tags[key] != null ? tags[key].map((el2, key2) => (
                      <div key={key2} style={{ backgroundColor: "DodgerBlue", marginLeft: "0.4vw", padding: "0.3vw", borderRadius: "0.5vw", color: "white"}}>{el2}</div>
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
      ))}

    </div>
  )
}
