import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import htmlParser from 'html-react-parser';
import '../styles/dashboard.css'
import * as FaIcons from 'react-icons/fa'
import Grid from '@mui/material/Grid';

export default function Dashboard() {

    axios.defaults.withCredentials = true;

    const obj = useParams();
    const id2 = obj.id;
    const [userInfo, setUserInfo] = useState([]);

    const getUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/info/${id2}`);
            // console.log(response.data);
            setUserInfo(response.data);
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    return (
        <div>
            {userInfo.map((el, key) => (
                <div key={key}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <div style={{ display: "flex", flexDirection: "column", border: "0.1vw solid black", margin: "5vw", paddingTop: "0vw", borderRadius: "1.5vw" }} className="card2">
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <div>
                                        <img src={el.profile_image_url ? el.profile_image_url : require('./user.jpg')} style={{ width: "10vw", height: "auto", marginTop: "1.5vw", marginBottom: "3vw", borderRadius: "150px" }} />
                                    </div>
                                </div>
                                <div style={{ fontSize: "1.2vw", display: "flex", marginLeft: "1.2vw", alignItems: "center", marginBottom: "1vw" }}>
                                    <FaIcons.FaHashtag size={20} style={{ marginRight: "1vw" }} />{el.id}
                                </div>
                                <div style={{ fontSize: "1.2vw", display: "flex", marginLeft: "1.2vw", alignItems: "center", marginBottom: "1vw" }}>
                                    <FaIcons.FaLocationArrow size={20} style={{ marginRight: "1vw" }} />{el.location}
                                </div>
                                <div style={{ fontSize: "1.2vw", display: "flex", marginLeft: "1.2vw", alignItems: "center", marginBottom: "0.5vw", fontWeight: "550" }}>
                                    <FaIcons.FaClock size={20} style={{ marginRight: "1vw" }} /> Last accessed On
                                </div>
                                <div style={{ fontSize: "1.2vw", display: "flex", marginLeft: "1.2vw", alignItems: "center", marginBottom: "3vw" }}>
                                    {el.date2}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={7.5} style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ marginTop: "3.5vw", textAlign: "left", fontSize: "3vw", marginBottom: "1vw" }}>{el.display_name}</div>
                            <div style={{ display: "flex", justifyContent: "left", paddingLeft: "0vw", fontSize: "1.2vw", paddingBottom: "1vw" }}>
                                <div style={{ display: "flex", justifyContent: "left", marginRight: "0.2vw" }}><FaIcons.FaUser size={20} /></div> <div style={{ marginTop: "-0.35vw", marginLeft: "0vw", display: "flex" }}>Member since  <div style={{ marginLeft: "0.5vw", fontWeight: "550" }}>{el.date}</div></div>
                            </div>
                            <Grid container>
                                <Grid item xs={6.5}>
                                    <div style={{ fontSize: "2vw", textAlign: "left", marginBottom: "1vw" }}>About Me</div>
                                    <div style={{ textAlign: "left", border: "0.1vw solid black", padding: "1vw", borderRadius: "0.8vw", fontSize: "1vw" }} className="card2">{el.about_me != null ? htmlParser(el.about_me) : "N/A"}</div>
                                </Grid>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={4.5}>
                                    <div style={{ fontSize: "2vw", textAlign: "left", marginBottom: "1vw" }}>Stats</div>
                                    <div style={{ textAlign: "left", border: "0.1vw solid black", padding: "1vw", borderRadius: "0.8vw", fontSize: "1vw" }} className="card2">
                                        UpVotes : {el.up_votes} <br /><br />
                                        DownVotes : {el.down_votes} <br /><br />
                                        Views : {el.views} <br /><br />
                                        Reputation : {el.reputation}
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                    <hr></hr>

                </div>

            ))}
        </div>
    )
}
