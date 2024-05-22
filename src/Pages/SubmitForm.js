import React, { useEffect, useState } from 'react';
import { empDetailsSubmit } from './EmployeeDetailsInputs';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import "../CSS/SubmitForm.css";


const SubmitForm = () => {
    const [inputData, setInputData] = useState({});
    const [empDetailsEdit, setEmpDetailsEdit] = useState(empDetailsSubmit);
    const [errors, setErrors] = useState({});

    // const [selectBox, setSelectBox] = useState(false)
    const [randomData, setRandomData] = useState('');

    useEffect(() => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        
       for (let i = 0; i < 3; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        for (let i = 0; i < 2; i++) {
            result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

        setRandomData(result);
        console.log("randomData:::", result);
    }, [])

    const onChangeHandler = (e) => {
        const { name, value, checked, type, files } = e.target;
        const inputField = empDetailsEdit.find(ele => ele.name === name);
        let error = '';

        if (type === "checkbox") {
            const existingValues = inputField.value || [];
            if (checked) {
                existingValues.push(value);
            } else {
                const index = existingValues.indexOf(value);
                if (index !== -1) {
                    existingValues.splice(index, 1);
                }
            }
            inputField.value = existingValues;
            setInputData(prevInputData => ({ ...prevInputData, [name]: existingValues }));
        } else if (type === "file") {
            if (files && files.length > 0) {
                const file = files[0];
                setInputData(prevInputData => ({ ...prevInputData, [name]: file }));
            }
        } else {
            inputField.value = value;
            if (type !== "radio" && value.trim() === "") {
                error = inputField.errMsg;
            }
            else {
                console.log(":::", [value].includes(value));
                // if()
                setInputData(prevInputData => ({ ...prevInputData, [name]: value }));
                // setSelectBox(true);
                // if (inputData[name].includes(value)){

                // }
            }

        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };




    const submitHandler = () => {
        // e.preventDefault();
        const e_pwd = randomData;
        let isValid = true;
        const newErrors = {};
        const name=inputData.e_name
        const  email=inputData.e_email
        const serviceId = 'service_1z6g35a';
        const templateId = 'template_wwbn91k';
        const userId = '5dCYy2nTf2hjOK451';
        const templateParams = {
            to_Subject:'Employee Credentials', 
            to_email:email,
            to_name:name,
            from_name:'Vensai',   
            message:e_pwd
        };
       
        // console.log(empDetailsEdit)
        empDetailsEdit.forEach(input => {
            if (input.value === "" || (Array.isArray(input.value) && input.value.length === 0)) {
                newErrors[input.name] = input.errMsg;
                isValid = false;
            }
            else {
                isValid = true
            }
        });

        setErrors(newErrors);

        try {
            if (isValid) {
                const formData = new FormData();
                Object.entries(inputData).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                formData.append("e_pwd", e_pwd);
                axios.post(`http://192.168.2.126:3002/empDetails/post-empDetails`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(res => {
                        setEmpDetailsEdit(empDetailsSubmit.map(ele => {
                           
                            return { ...ele, value: "" || [] }

                        }));
                        // setSelectBox(false);
                        setInputData({});

                        alert("Data added successfully...");
                        console.log("Response:", res.data);
                        emailjs.send(serviceId, templateId, templateParams, userId)
                        .then((res) => {
                            console.log('Email sent successfully!');
                            
                        })
                        .catch((error) => {
                            console.error('Error sending email:', error);
                        });
                    })
                    .catch(err => console.log(err))


            }
        }
        catch (error) {
            console.error("Error:", error);
        }

     
    };

    return (
        <div className='content-p'>
            <table className='emp-form-table'>
                <tbody>
                    {empDetailsEdit?.map((ele, i) => (
                        <tr key={i}>
                            <td className='td-label'>
                                {ele?.label === "Family Inforamation" ? <span></span> : null}
                                {ele?.label} {ele.label === "Family Inforamation" ? <span> :</span> : <span style={{ color: "red" }}>*</span>}
                            </td>
                            <td className='td-input'>
                                {ele.type === "file" ? null : ele.type === "radio" ?
                                    <>
                                        {ele?.Options.map((option, index) => (
                                            <div key={index}>
                                                <input name={ele.name} onChange={onChangeHandler} type={ele.type} value={option} />
                                                <label>{option}</label>
                                            </div>
                                        ))}
                                        <span className="error">{errors[ele.name]}</span>
                                    </>
                                    :
                                    ele?.type === "select" ? null :
                                        ele?.label !== "Family Inforamation" &&
                                        <React.Fragment>
                                            <input name={ele.name} onChange={onChangeHandler} value={ele.value} type={ele.type} className='inputField' />
                                            <span className="error">{errors[ele.name]}</span>
                                        </React.Fragment>
                                }
                                {
                                    ele?.type === "select" &&
                                    <React.Fragment>
                                        <select className='inputField' onChange={onChangeHandler} name={ele.name}>
                                            <option value="">Select</option>
                                            {ele?.Options.map((option, index) => (
                                                <option value={option} key={index}>{option}</option>
                                            ))}
                                        </select>
                                        <span className="error">{errors[ele.name]}</span>
                                    </React.Fragment>
                                }
                                {ele?.type === "file" &&
                                    <React.Fragment>
                                        <input type={ele?.type} name={ele.name} accept="image/*" onChange={onChangeHandler} />
                                    </React.Fragment>
                                }
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td className='td-label'>
                            <button onClick={submitHandler} className='table-btn'>New register</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SubmitForm;
