import React, { useEffect, useState } from 'react'
import logoWhite from '../../assets/images/logo-white.svg';
import loginImage from '../../assets/images/login-image.png';
import employeeService from '../../core/services/employee.service';
import AuthContext from "../../core/context/AuthProvider";
import { useContext } from "react";
import { GoogleLogin, useGoogleLogin  } from '@react-oauth/google';
import { useNavigate  } from 'react-router-dom';
import Cookies from 'js-cookie';



  export default function Login() {

    const [mailInput, setMailInput] = useState('');
    const {tokenContext, setTokenContext} = useContext(AuthContext)

    useEffect(()=>{

    }, [])

    const navigateTo = useNavigate();

    const tryToLogin = useGoogleLogin({
      onSuccess: (codeResponse) => googleLogin(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

  const googleLogin = async (res) => {
    console.log(res.access_token)
    employeeService.loginWithGoogleAsync(res.access_token).then(myRes => {
      
      console.log(myRes)
      //Cookies.set("token", myRes.token, {expires:1})
      //setTokenContext(myRes.token)
      navigateTo("/home")
      
    })

  }

    
    return (
      <div className="bg-green">
          <button className="skip-link" type="button">
            Skip to content
          </button>
          <main className="main">
            <section className="login-block">
              <div className="login-block__wrap">
                <div className="login-block__logo-holder">
                  <img className="login-block__logo" src={logoWhite} alt="Logo" />
                </div>
                <h1 className="login-block__title h1">
                  <span className="bright-green">TODO</span> App | Login
                </h1>
                {/*<GoogleLogin onSuccess={responseMessage} onError={errorMessage} />*/}

                <button className="login-block__button" type="button" onClick={() => tryToLogin()}>
      <svg className="login-block__button-icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 490 500" style={{enableBackground: 'new 0 0 490 500'}} xmlSpace="preserve">
        <style type="text/css">
          {`.st0 {
              fill: #4285F4;
            }
            .st1 {
              fill: #34A853;
            }
            .st2 {
              fill: #FBBC05;
            }
            .st3 {
              fill: #EA4335;
            }`}
        </style>
        <path className="st0" d="M490,255.7c0-17.7-1.6-34.8-4.5-51.1H250v96.7h134.5c-5.8,31.3-23.4,57.7-49.9,75.5v62.7h80.8 C462.7,395.9,490,331.8,490,255.7z" />
        <path className="st1" d="M250,500c67.5,0,124.1-22.4,165.5-60.6l-80.8-62.7c-22.4,15-51,23.9-84.7,23.9c-65.1,0-120.2-44-139.9-103.1 H26.6v64.8C67.7,444,152.3,500,250,500z" />
        <path className="st2" d="M110.1,297.5c-5-15-7.8-31-7.8-47.5c0-16.5,2.8-32.5,7.8-47.5v-64.8H26.6C9.7,171.5,0,209.7,0,250 c0,40.3,9.7,78.5,26.6,112.3L110.1,297.5z" />
        <path className="st3" d="M250,99.4c36.7,0,69.7,12.6,95.6,37.4l71.7-71.7C374,24.8,317.4,0,250,0C152.3,0,67.7,56,26.6,137.7l83.5,64.8 C129.8,143.4,184.9,99.4,250,99.4z" />
      </svg>
      Continue with Google
    </button>
                <div className="login-block__image-holder">
                  <img className="login-block__image" src={loginImage} alt="Decorative image" />
                </div>
              </div>
            </section>
          </main>
      </div>
    );
  }
