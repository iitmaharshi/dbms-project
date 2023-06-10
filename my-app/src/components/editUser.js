import React, { useState, Fragment, useEffect, useRef } from "react";
import axios from 'axios';
import { useNavigate,useLocation,useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import "../styles/editUser.css"

const EditUser = () => {
    const location1 = useLocation();
    const editor = useRef(null);
    const id = location1.state.id;
    console.log(id)
    const navigate = useNavigate();
    const [userName, setUsername] = useState("");
    const [newUserName, setNewUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassowrd] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [URL, SETURL] = useState("");
    const [location, setLocation] = useState("");
    const [text, setText] = useState("");
    const [isIncorrectUsername, setIsIncorrectUsername] = useState(false);
    const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);
    const [isIncorrectNewPassword, setIsIncorrectNewPassword] = useState(false);
    const [isConfirm, setIsConfirm] = useState(true);
    const [isDisplayName, setIsDisplayName] = useState(true);
    const [enable, setEnable] = useState(false);


    const resetFlags = () => {
        setEnable(false);
        setIsDisplayName(true);
        setIsConfirm(true);
        setIsIncorrectNewPassword(false);
        setIsIncorrectPassword(false);
        setIsIncorrectUsername(false);
    };

    const checkUserName = async () => {
        try {
            if (userName === newUserName) {
                setIsIncorrectUsername(false);
                return false;
            }
            else if (newUserName.length === 0) {
                setIsIncorrectUsername(true);
                return true;
            }
            else {
                const response = await axios.post("http://localhost:5000/isUser", {
                    username: newUserName
                });
                if (response.msg = "OK") {
                    setIsIncorrectUsername(false);
                    return false;
                }
            }
        } catch (error) {
            if (error.response.msg = "user exists already!") {
                setIsIncorrectUsername(true);
                return true
            }
            console.error(error.message);
        }
    }

    // const checkPassword = () => {

    //     if (oldPassword == password) setIsIncorrectPassword(false);
    //     else setIsIncorrectPassword(true);
    // };

    // const checkNewPassword = () => {
    //     if (newPassword.length === 0) {
    //         setIsIncorrectNewPassword(true);
    //         console.log("1: " + isIncorrectNewPassword);
    //         console.log(newPassword.length);
    //     }
    //     else {
    //         setIsIncorrectNewPassword(false);
    //         console.log("2:" + isIncorrectNewPassword);

    //         if (newPassword === confirmPassword) setIsConfirm(true);
    //         else setIsConfirm(false);
    //     }
    // }

    const getInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/info/${id}`);
            const data = response.data[0];
            setUsername(data["username"]);
            setNewUsername(data["username"]);
            setOldPassword(data["password"]);
            setDisplayName(data["display_name"]);
            SETURL(data["profile_image_url"]);
            setLocation(data["location"]);
            setText(data["about_me"]);
        } catch (err) {
            console.error(err.message);
        }
    };

    const onSubmitForm = async e => {
        e.preventDefault();

        if (enable) {
            try {
                var isPassword;
                var isNewPassword;
                var iscon;
                var isDiplay;
                // check User Name
                var isUser = await checkUserName();
                
                // check display name
                if (displayName.length === 0)
                {
                    setIsDisplayName(false);
                    isDiplay = false;
                }
                else
                {
                    setIsDisplayName(true);
                    isDiplay = true;
                }

                // checkPassword
                if (oldPassword == password) {
                    setIsIncorrectPassword(false);
                    isPassword = false;
                } 
                else 
                {
                    setIsIncorrectPassword(true)
                    isPassword = true;
                }

                // checkNewPassword
                if (newPassword.length === 0) {
                    setIsIncorrectNewPassword(true);
                    isNewPassword = true;
                }
                else {
                    setIsIncorrectNewPassword(false);
                    isNewPassword = false;

                    if (newPassword === confirmPassword) {
                        setIsConfirm(true);
                        iscon = true;
                    }
                    else
                    {
                        setIsConfirm(false);
                        iscon = false;
                    }
                }

                if ((!isUser) && (iscon) && (!isNewPassword) && (!isPassword) && isDiplay) {
                    const response = await axios.put(`http://localhost:5000/edituser/${id}`, {
                        URL: URL,
                        displayName: displayName,
                        location: location,
                        username: newUserName,
                        password: newPassword,
                        aboutMe: text
                    });
                    console.log(response);
                    resetFlags();
                    navigate(`/dashboard/${id}`);
                }
                else {
                    console.log("Invalid Input");
                }
            }
            catch (error) {
                console.error(error.message);
            }
        }
        else {
            try {
                const response = await axios.put(`http://localhost:5000/edituser/${id}`, {
                    URL: URL,
                    displayName: displayName,
                    location: location,
                    username: userName,
                    password: oldPassword,
                    aboutMe: text
                });
                console.log(response);
                resetFlags();
                navigate(`/dashboard/${id}`);
            }
            catch (error) {
                console.error(error.message);
            }
        }
    }

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <Fragment>
            <div className="editUserMainContainer">
                <h1>Edit User Profile Page</h1>
                <hr className="editUser-border" />
                <Button
                    variant="contained"
                    onClick={() => setEnable(!enable)}
                >
                    {(enable) ? "Disable " : "Enable "}Edit Login Details
                </Button>
                <form className="editUser-threeForms" onSubmit={onSubmitForm} >
                    <div className="editUser-displayInfo editUser-form">
                        <h3 style={{ fontFamily: "'Merriweather', serif", textAlign: "center", marginBottom: "40px" }}>User display information</h3>
                        <h5 style={{ fontFamily: "'Merriweather', serif", marginBottom: "20px" }}>Profile photo URL</h5>
                        <TextField
                            id="outlined-search"
                            label="photo URL"
                            type="search"
                            style={{ margin: "0 0 1rem 0" }}
                            value={URL}
                            onChange={e => SETURL(e.target.value)}
                        />
                        <h5 style={{ fontFamily: "'Merriweather', serif", marginBottom: "20px" }}>Display Name</h5>
                        <TextField
                            id="outlined-search"
                            error={!isDisplayName}
                            helperText={isDisplayName ? "" : "This field is mandatory"}
                            label="Display Name"
                            type="search"
                            style={{ margin: "0 0 1rem 0" }}
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                        />
                        <h5 style={{ fontFamily: "'Merriweather', serif", marginBottom: "20px" }}>Location</h5>
                        <TextField
                            id="outlined-search"
                            label="Location"
                            type="search"
                            style={{ margin: "0 0 1rem 0" }}
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="editUser-login editUser-form" style={!enable ? { background: "#E8E2E2" } : {}}>
                        <h3 style={{ fontFamily: "'Merriweather', serif", textAlign: "center", marginBottom: "40px" }}>Login information</h3>
                        <h5 style={{ fontFamily: "'Merriweather', serif", marginBottom: "20px" }}>Username</h5>
                        <TextField
                            disabled={!enable}
                            error={isIncorrectUsername}
                            helperText={isIncorrectUsername ? "Enter a valid non empty username which does not exist" : ""}
                            id="outlined-search"
                            label="Username"
                            type="search"
                            style={{ margin: "0 0 1rem 0" }}
                            value={newUserName}
                            onChange={e => setNewUsername(e.target.value)}
                        />
                        <h5 style={{ fontFamily: "'Merriweather', serif", marginBottom: "20px" }}>Old password</h5>
                        <TextField
                            disabled={!enable}
                            error={isIncorrectPassword}
                            helperText={isIncorrectPassword ? "Enter correct old password" : ""}
                            id="outlined-search"
                            label="Old password"
                            type="password"
                            style={{ margin: "0 0 1rem 0" }}
                            onChange={e => setPassowrd(e.target.value)}
                        />
                        <h5 style={{ fontFamily: "'Merriweather', serif", marginBottom: "20px" }}>New Password</h5>
                        <TextField
                            disabled={!enable}
                            error={isIncorrectNewPassword}
                            helperText={isIncorrectNewPassword ? "Enter a non empty password" : ""}
                            id="outlined-search"
                            label="New password"
                            defaultValue=""
                            type="password"
                            style={{ margin: "0 0 1rem 0" }}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <h5 style={{ fontFamily: "'Merriweather', serif", marginBottom: "20px" }}>Confirm new Password</h5>
                        <TextField
                            disabled={!enable}
                            error={!isConfirm}
                            helperText={isConfirm ? "":"The password does not match with the above"}
                            id="outlined-search"
                            label="Confirm password"
                            type="password"
                            style={{ margin: "0 0 1rem 0" }}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="editUser-aboutMe editUser-form">
                        <h3 style={{ fontFamily: "'Merriweather', serif", textAlign: "center", marginBottom: "40px" }}>About ME</h3>
                        <JoditEditor
                            style={{ margin: "1rem 0 1rem 0" }}
                            ref={editor}
                            value={text}
                            onChange={newContent => setText(newContent)}
                        />
                    </div>
                    <div className="editUser-button">
                        <Button style={{ margin: "0.5rem 0 1rem 0", fontSize: "1.2vw" }} size="large" variant="contained" type="submit">Submit</Button>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default EditUser;