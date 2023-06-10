import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";

export default function Auth() {

    axios.defaults.withCredentials = true;

    const navigate = useNavigate();
    const [token, setToken] = useState();
    const [expire, setExpire] = useState(0);
    const [id, setId] = useState('');

    const axiosJWT = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    });

    axiosJWT.interceptors.request.use(async (config) => {
            const response = await axios.get('http://localhost:5000/refreshToken');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setExpire(decoded.exp);
            setId(decoded.id);
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    useEffect(()=>{
        verifyToken();
    })

    const verifyToken = async () => {
        try {
            const response = await axiosJWT.get('http://localhost:5000/verifyToken');
            setId(response.data.id)
        } catch (error) {
            console.log("From here");
            navigate('/');
        }
    }
}
