import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import secureLocalStorage from 'react-secure-storage';

import 'bootstrap/dist/css/bootstrap.css';

const Login = () => {
    const {setAuth,auth} = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg,setMsg] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
 
    const Auth = async (e) => {
        e.preventDefault();
        try {
            const response  = await axios.post('http://localhost:5000/login', {
                username: username,
                password: password
            })
            console.log("Logged in successfully");
            console.log(response.data.id);
            secureLocalStorage.setItem('isAuth',true);
            navigate('/home',{
                state :{
                    accessToken : response.data.accessToken
                }
            })
        } catch (error) {
          console.log("here");
            if(error.response){
              setMsg(error.response.data.msg)
            }
        }
    }
 
    return (
        <section className="vh-100 bg-primary">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white" style={{borderRadius:"1rem"}}>
                <div className="card-body p-5 text-center">
      
                  <div className="mb-md-5 mt-md-4 pb-5">
      
                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                    <p className="text-white-50 mb-5">Please enter your Username and password!</p>
        
                    <div className="form-outline form-white mb-4">
                      <input type="email" id="typeEmailX" className="form-control form-control-lg" value={username} onChange={(e)=>{setUsername(e.target.value)}} />
                      <label className="form-label" htmlFor="typeEmailX">Username</label>
                    </div>
      
                    <div className="form-outline form-white mb-4">
                      <input type="password" id="typePasswordX" className="form-control form-control-lg" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                      <label className="form-label" htmlFor="typePasswordX">Password</label>
                    </div>
                    <p className='text-white-20 mb-5'>{msg}</p>
      
                    <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>


                    <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={Auth}>Login</button>

                  </div>
      
                  <div>
                    <p className="mb-0">Don't have an account? <a href="/createUser" className="text-white-50 fw-bold">Sign Up</a>
                    </p>
                  </div>
      
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> 
    );
}
 
export default Login;