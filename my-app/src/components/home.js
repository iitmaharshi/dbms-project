import React from 'react'
import { useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import '../styles/home.css'
import * as FaIcons from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { BsFileArrowDown, BsFilePost } from 'react-icons/bs'
import { ImCross } from 'react-icons/im'
import Grid from '@mui/material/Grid'
import secureLocalStorage from 'react-secure-storage';

export default function Home() {

    axios.defaults.withCredentials = true;

    const location = useLocation();
    const navigate = useNavigate();

    const [sidebar, setSidebar] = useState(false);

    const sidebarFunction = () => {
        setSidebar(!sidebar);
    }

    const [token, setToken] = useState(location.state !== null ? location.state.accessToken : null);
    const [expire, setExpire] = useState(0);
    const [top, setTop] = useState([]);
    const [id, setId] = useState('');
    const [tags, setTags] = useState([]);

    const axiosJWT = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    });

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/refreshToken');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setExpire(decoded.exp);
            setId(decoded.id);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    useEffect(() => {
        getTop();
        verifyToken();
    }, [])

    useEffect(() => {
        change();
    }, [top])

    const verifyToken = async () => {
        
        try {
            const response = await axiosJWT.get('http://localhost:5000/verifyToken');
            setId(response.data.id);
        } catch (error) {
            console.log("Errorful");
            console.log(error.response);
            if (error) {
                navigate('/');
            }
        }
    }

    const getTop = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getTop');
            // console.log(response.data);
            setTop(response.data);
        } catch (error) {
            console.log(error.response)
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

    const handler2 = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/logout/${id}`);
            secureLocalStorage.removeItem('isAuth');
            navigate('/');
        } catch (error) {
            console.log(error.response)
        }
    }

    const handler3 = () => {
        navigate('/home/createPost', {
            state: {
                id: id
            }
        })
    }

    const edit = () => {
        navigate('/home/ownPosts', {
            state: {
                id: id
            }
        })
    }

    const editProfile = () => {
        navigate('/editUser', {
            state: {
                id: id
            }
        })
    }

    const linkToShowPost = (eid) => {
        navigate(`/home/showPost/${eid}`, {
            state: {
                id: id
            }
        })
    }
    
    const searchPost = ()=>{
        navigate('/home/posts',{
            state:{
                id:id
            }
        })
    }

    return (
        <div>
            <div style={{ overflow: "hidden" }}>
                <Grid container>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}><div style={{ fontWeight: "600", fontSize: "3vw", textAlign: "center", marginBottom: "2vw", display: "inline-block" }}>Top Questions </div>
                    </Grid>
                    <Grid item xs={4} display="flex" justifyContent="right"><div style={{ marginTop: "2vw", marginRight: "3vw", cursor: "pointer", overflow: "scroll" }} onClick={sidebarFunction}><FaIcons.FaBars size={40} /></div>
                    </Grid>
                </Grid>

                <div style={{ position: "relative" }}>
                    <nav className={sidebar ? 'nav-menu-active' : 'nav-menu'}>
                        <div onClick={sidebarFunction}><ImCross size={40} style={{ color: "white", paddingTop: "1vw", cursor: "pointer" }} /></div>
                        <ul style={{ paddingTop: "4vw" }}>
                            <Link to={`/dashboard/${id}`} style={{ textDecoration: "none" }}>
                                <li className='menu-item a'>
                                    <div style={{ paddingRight: "1.2vw" }}><FaIcons.FaUserAlt /></div>
                                    <div>
                                        Your Profile
                                    </div>
                                </li>
                            </Link>
                            <li className='menu-item a' onClick={() => { editProfile() }}>
                                <div style={{ paddingRight: "1.2vw" }}><FaIcons.FaEdit /></div>
                                <div>
                                    Edit Profile
                                </div>
                            </li>
                            <li className='menu-item b' onClick={edit}>
                                <div style={{ paddingRight: "1.2vw" }}><BsFileArrowDown /></div>
                                <div>
                                    Your Posts
                                </div>
                            </li>
                                <li className='menu-item b' onClick={()=>{searchPost()}}>
                                    <div style={{ paddingRight: "1.2vw" }}><BsFilePost /></div>
                                    <div>
                                        Search Posts
                                    </div>
                                </li>
                            <li className='menu-item d' onClick={handler3}>
                                <div style={{ paddingRight: "1.2vw" }}><FaIcons.FaPager /></div>
                                <div>
                                    Create Post
                                </div>
                            </li>
                            <Link to={`/home/showUsers`} style={{ textDecoration: "none" }}>
                                <li className='menu-item e'>
                                    <div style={{ paddingRight: "1.2vw" }}><FaIcons.FaUserCheck /></div>
                                    <div>
                                        Search Users
                                    </div>
                                </li>
                            </Link>
                            <li className='menu-item c' onClick={handler2}>
                                <div style={{ paddingRight: "1.2vw", marginBottom: "0vw" }}><BiLogOut /></div>
                                <div>
                                    Log Out
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>

                {top.map((el, key) => (
                    <div key={key} style={{ width: "60vw", marginLeft: "auto", marginRight: "auto", marginBottom: "2vw", border: "0.2vw solid black", borderRadius: "0.4vw" }} className="box">
                        <Grid container>
                            <Grid item xs={3} style={{ textAlign: "right", padding: "2vw", fontSize: "1.25vw", borderRight: "0.1vw solid black" }}>
                                {el.score}  <br />
                                {el.view_count}  views <br />
                                {el.answer_count}  answers
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: "1.2vw", paddingTop: "2vw" }}>
                                <div style={{ textAlign: "left", paddingLeft: "0.5vw", color: "black",cursor:"pointer" }} onClick={()=>{linkToShowPost(el.id)}}>{el.title}</div><br />
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
                ))}
            </div>
        </div>
    )
}