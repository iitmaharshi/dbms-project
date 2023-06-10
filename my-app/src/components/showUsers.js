import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';
import axios from 'axios'

export default function DisplayUsers() {

    const [data, setData] = useState([]);
    const [data2, setData2] = useState('');
    const [data3,setData3] = useState([]);

    useEffect(()=>{
        getUsers();
    },[]);

    useEffect(() => {
        handleClick();
    }, [data2]);

    const getUsers = async ()=>{
        try {
            const response = await axios.get(`http://localhost:5000/getNames`);
            setData3(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleClick = async () => {
        try {
            if(data2.length > 0){
                setData([]);
                const response = await axios.get(`http://localhost:5000/names/${data2}`);
                console.log(response.data);
                setData(response.data);
            }
        } catch (error) {
            console.log("here " + error);
        }
    };

    const select = ()=>{
        if(data2.length > 0){
            return data;
        } 
        else{
            return data3;
        }
    }

    return (
        <div>

            <TextField
                style={{ width: "35vw", height: "3vw", borderRadius: "0.3vw", marginRight: "0.5vw", fontSize: "1.15vw",marginBottom:"3vw",marginTop:"2vw" }}
                id="outlined-required"
                label="Search Display Names"
                value={data2}
                onChange={(e) => { setData2(e.target.value) }}
            /> 

            <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                {select().map((el, key) => (
                    <Grid key={key} item xs={4} className='autocomplete'>
                        <div className="container" id="gfg" style={{
                            height: "190px",
                            borderRadius: "10px",
                            width: "70%",
                            border: "1px solid black",
                            display: "flex",
                            alignItems: "stretch",
                            backgroundColor: "pink",
                            boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)"
                        }}>
                            <div className="item-1" style={{
                                width: "30%",
                                height: "50%",
                                display: "flex",
                                margin: "1px",
                                padding: "3px"
                            }}>

                                {el.profile_image_url ? <img src={el.profile_image_url}
                                    alt="" style={{
                                        maxHeight: "100%",
                                        maxWidth: "100%",
                                        height: "auto",
                                        borderRadius: "10px"
                                    }}></img> : <img src={require('./user.jpg')}
                                        alt="" style={{
                                            maxHeight: "100%",
                                            maxWidth: "100%",
                                            height: "auto",
                                            borderRadius: "50px"
                                        }}></img>}

                            </div>
                            <div className="item-2" style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                height: "92%",
                                margin: "7px",
                                padding: "6px",
                                borderLeft: "1px solid black",
                                justifyContent: "space-around"
                            }}>
                                <div className="user_info1" style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    fontFamily: "Times New Roman,Times,serif", fontSize: "x-large", fontWeight: "bold", color: "darkblue"
                                }}><Link to={`/dashboard/${el.id}`} style={{ textDecoration: "none", color: "darkblue" }}>
                                        {el.display_name}</Link>
                                </div>
                                <div className="user_info" style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    fontFamily: "Times New Roman,Times,serif", fontSize: "large", color: "darkblue"
                                }}>
                                    Account id: {el.account_id}
                                </div>
                                <div className="user_info" style={{
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                    Reputation: {el.reputation}
                                </div>
                                <div className="user_info" style={{
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                    Views: {el.views}
                                </div>
                            </div>
                        </div>
                    </Grid>
                ))}
            </Grid>

        </div>
    )
}
