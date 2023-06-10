import React, { useState, Fragment, useEffect, useRef } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import '../styles/addUser.css'

const AddUser = () => {
    const [displayName, setDisplayName] = useState("");
    const [isDisplayName, setIsDisplayName] = useState(true);
    const [location, setLocation] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [username, setUsername] = useState("");
    const [isUsername, setIsUsername] = useState(true);
    const [userNameFlag, setUsernameFlag] = useState(true);
    const [password, setPassowrd] = useState("");
    const [isPassword, setIsPassword] = useState(true);
    const [confirmPassword, setConfirmPassowrd] = useState("");
    const [notSamePasswordFlag, setNotSamePasswordFlag] = useState(false);
    const [aboutMe, setAboutMe] = useState("");
    const editor = useRef(null);
    const navigate = useNavigate();

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            if (displayName.length > 0 && username.length > 0 && password.length > 0) {
                setIsPassword(true);
                setIsUsername(true);
                setIsDisplayName(true);
                if (password === confirmPassword) {
                    setNotSamePasswordFlag(false);
                    const response = await axios.post('http://localhost:5000/addUser', {
                        displayName: displayName,
                        location: location,
                        photoUrl: photoUrl,
                        AboutMe: aboutMe,
                        userName: username,
                        password: password
                    });
                    console.log(response);
                    navigate('/createUser');
                    setUsernameFlag(true);
                }
                else {
                    setNotSamePasswordFlag(true);
                }
            }
            else {
                if (displayName.length === 0) setIsDisplayName(false);
                if (username.length === 0) setIsUsername(false);
                if (password.length === 0) setIsPassword(false);
            }
        } catch (err) {
            if (err.response.msg = "user exists already!") {
                setUsernameFlag(false);
            }
            console.error(err.message);
        }
    };

    // const onChangeUsername = async e => {
    //     try {
    //         setUsername(e.target.value);
    //     } catch (err) {
    //         console.error(err.message);
    //     }
    // };

    return (
        <Fragment>
            <div className="Adduser-container">
                <h1 className="addUser-header">Sign Up</h1>
                <hr className="addUser-line" />
                <form onSubmit={onSubmitForm}>
                    <div className="addUser-inputBox">
                        <div className="addUser-inputform">
                            <div className="addUser-title">Enter your display name</div>
                            <TextField
                                error={!isDisplayName}
                                id="outlined-search"
                                label="display name"
                                type="search"
                                style={{ margin: "1rem 0 1rem 0" }}
                                onChange={(e) => { setDisplayName(e.target.value); setIsDisplayName(true) }}
                                helperText={isDisplayName? "":"This field is mandatory"}
                            />
                            <div className="addUser-title">Enter your location</div>
                            <TextField
                                id="outlined-search"
                                label="location"
                                type="search"
                                style={{ margin: "1rem 0 1rem 0" }}
                                onChange={(e) => { setLocation(e.target.value) }}
                            />
                            <div className="addUser-title">Enter URL of your picture</div>
                            <TextField
                                id="outlined-search"
                                label="photo Url"
                                type="search"
                                style={{ margin: "1rem 0 1rem 0" }}
                                onChange={(e) => { setPhotoUrl(e.target.value) }}
                            />
                        </div>
                        <div className="addUser-inputform">
                            <div className="addUser-title">Enter your username </div>
                            <TextField
                                error={!userNameFlag || !isUsername} id="outlined-search" label="username" type="search" style={{ margin: "1rem 0 1rem 0" }} onChange={(e) => { setUsername(e.target.value); setUsernameFlag(true); setIsUsername(true) }} helperText={userNameFlag ? isUsername ? "" : "This field is mandatory" : "username already exists"}
                            />
                            <div className="addUser-title">Enter your password </div>
                            <TextField error={!isPassword} id="password" label="password" type="password" style={{ margin: "1rem 0 1rem 0" }} onChange={(e) => { setPassowrd(e.target.value); setIsPassword(true) }} helperText={isPassword ? "" : "This field is mandatory"} />
                            <div className="addUser-title">Confirm password</div>
                            <TextField error={notSamePasswordFlag ? true : false} id="password" label="confirm password" type="password" style={{ margin: "1rem 0 1rem 0" }}
                                onChange={(e) => { setConfirmPassowrd(e.target.value); setNotSamePasswordFlag(false) }}
                                helperText={notSamePasswordFlag ? "This does not matches with password" : ""}
                            />
                        </div>
                    </div>
                    <div className="addUser-inputBox">
                        <div className="addUser-inputform">
                            <div className="addUser-title2">Tell us something about yourself</div>
                            <JoditEditor
                                style={{ margin: "1rem 0 1rem 0" }}
                                ref={editor}
                                onChange={newContent => setAboutMe(newContent)}
                            />
                        </div>
                    </div>
                    <Button style={{ margin: "0.5rem 0 1rem 0", fontSize: "1.2vw" }} size="large" variant="contained" type="submit">Submit</Button>
                </form>
            </div>
        </Fragment>
    );
};

export default AddUser;