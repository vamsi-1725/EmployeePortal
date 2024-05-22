import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/Loginpage.css';
import {  useNavigate } from 'react-router-dom';


function Loginpage() {
  const [errors, setErrors] = useState({});
  const [val, setVal] = useState({});
  const [details, setDetails] = useState({
    e_email: '',
    e_pwd: ''
  });
  const navigate = useNavigate(); 

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
    setVal({});
    if(value===""){
      if(name==="e_email")
        {
          errors.e_email="Email required"
        }
        if(name==="e_pwd")
          {
            errors.e_pwd="Password required"
          }
    }else {
      errors[name] = "";
  }
  };

  const Clicked = async (e) => {
    e.preventDefault();
    let isValid = true;
        const newErrors = {};

        if (details.e_email === "") {
            newErrors.e_email = 'Email required';
            isValid = false;
        }
        if (details.e_pwd === "") {
            newErrors.e_pwd = 'Password required';
            isValid = false;
        }
    console.log(details.e_pwd)
    setErrors(newErrors);
   
   
    if (isValid) {
    try {
      const { data } = await axios
        .post('http://192.168.2.126:3002/empDetails/login-empDetails/', details);
      console.log(data.data[0]);
      setDetails({
        e_email:"",
        e_pwd:''
      })
      navigate('/Home')
    }
    catch (err) {
      if (err.response) {
        const Err = {};
        
        if (err.response.status === 404) {
          // alert('Error 404: Not Found');
          
          Err.errors = 'Username or Password Invalid';
          setDetails({
            e_email:"",
            e_pwd:''
          })
       
        }
        setVal(Err);
      }
      
    }
    
    }
   

  };

  return (
    
    <div style={{fontFamily:"'Times New Roman', Times, serif"}} className='card-container'>
      <div className="card">
        <h1>Login Page</h1>
        <form>
          <table style={{fontFamily:"'Times New Roman', Times, serif"}}>
            <tr><td></td>
            <td> {val.errors && <span style={{ color: 'red' }}> {val.errors}</span>}</td></tr>
            <tr>
              <td><label>User Name</label></td>
              <td>
                <input style={{fontFamily:"'Times New Roman', Times, serif"}} type='text' name='e_email' placeholder='Enter Email' value={details.e_email} onChange={changeHandler} />
                </td>
            </tr>
            <tr>
              <td></td>
              <td>{errors.e_email && <span style={{ color: 'red' }}> {errors.e_email}</span>}<br /></td>
            </tr>
              <tr>
              <td><label>Password</label></td>
              <td><input type='text' style={{fontFamily:"'Times New Roman', Times, serif"}} name='e_pwd' placeholder='Enter password' value={details.e_pwd} onChange={changeHandler} /></td>
            </tr>
            <tr>
               <td> </td>
              <td>{errors.e_pwd && <span style={{ color: 'red', fontFamily:"'Times New Roman', Times, serif" }}> {errors.e_pwd}</span>}<br /></td>
            </tr>
            <tr><td></td>
              <td>
                <button style={{backgroundColor:"skyblue", padding:"4px",fontFamily:"'Times New Roman', Times, serif", borderStyle:"none", borderRadius:"3px"}} onClick={Clicked}>Login</button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td><a href='#' className='forget'>Forget Password</a></td>
            </tr>
          </table>
        </form>
      </div>
    </div>
  );
}

export default Loginpage;
