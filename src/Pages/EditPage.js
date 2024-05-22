import React, { useState,useEffect } from 'react';
import "../CSS/EditPage.css";
import { empDetailsSubmit } from './EmployeeDetailsInputs';
import axios from 'axios';
import { useSelector } from 'react-redux';


const initialData = {
    e_id: '',
    e_name: '',
    e_email: '',
    e_role: '',
    e_contact: '',
    e_gender: [],
    e_projectname: '',
    e_joining: '',
    e_relieving: '',
    e_bloodgroup: '',
    e_photo: '',
    e_status: [],
    e_updateddate: '',
    e_bod: '',
    e_anniversarydate: '',
    e_fathername: '',
    e_mothername: ''
};

const EditPage = () => {
    const [inputData, setInputData] = useState(initialData);
    const [isBtnValid, setIsBtnValid] = useState(false);
  
    const getData = useSelector(state => state.profileDetails);
    // console.log("editDetails:", getData);
useEffect(()=>{
    
    console.log("editDetails:", getData);
    let editdata=Object.keys(getData)
    if(editdata?.length>0){
        setInputData(getData)
        setIsBtnValid(true);
    }
    
    let data=getData.e_joining
    console.log(data?.split('T')[0]);
        setInputData(prevState => ({
            ...prevState,
            e_joining: getData.e_joining?.split('T')[0],
            e_relieving:getData.e_relieving?.split('T')[0],
            e_updateddate:getData.e_updateddate?.split('T')[0],
            e_bod:getData.e_bod?.split('T')[0],
            e_anniversarydate:getData.e_anniversarydate?.split('T')[0]
        }));      
},[])


    const onChangeHandler = (e) => {
        const { name, value, checked, type, files } = e.target;
        let newValue = value;
        if (type === "checkbox") {
            if (!inputData[name]) {
                newValue = [value];
            }
            else {
                if (inputData[name].includes(value)) {
                    newValue = inputData[name].filter(item => item !== value);
                } else {
                    newValue = [...inputData[name], value];
                }
            }
        } else if (type === "file") {
            if (files && files.length > 0) {
                const file = files[0];
                newValue = file;
            }
        }

        setInputData(prevData => ({ ...prevData, [name]: newValue }));
    };

    const editHandler = () => {
        axios.get(`http://192.168.2.126:3002/empDetails/get-empDetails?e_id=${inputData.e_id}`)
            .then(res => {
                setIsBtnValid(true);
                const fetchedData = res.data.data[0];
                const formattedData = { ...fetchedData };

                const dateFields = ["e_joining", "e_relieving", "e_updateddate", "e_bod", "e_anniversarydate"];
                dateFields.forEach(field => {
                    if (formattedData[field]) {
                        formattedData[field] = new Date(formattedData[field]).toISOString().split('T')[0];
                    }
                });
                console.log("formatted:::::",formattedData)
                let fordata=Object.keys(formattedData).length
                if(fordata>0){
                    setInputData(formattedData);
                }
                else{
                    alert('Id not found')
                    setIsBtnValid(false)
                    
                }
                
            })
            .catch(error => {
                console.log("Error fetching employee details:", error);
            });
    };

    const updateHandler = () => {
        try {
            const formData = new FormData();
            Object.entries(inputData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            axios.put(`http://192.168.2.126:3002/empDetails/update-empDetails`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                setIsBtnValid(false);
                setInputData(initialData);
                alert("Data updated Successfully..");
            });
        } catch (error) {
            console.error("Error updating data:", error);
            alert("An error occurred while updating data");
        }
    };

    return (
        <div className='content-p'>
            <table className='emp-form-table' width="80%">
                <tbody>
                    {empDetailsSubmit.map((ele, i) => (
                        <tr key={i}>
                            <td className='td-label'>
                                {ele.label} {ele.label === "Family Inforamation" ? <span> :</span> : <span style={{ color: "red" }}>*</span>}
                            </td>
                            <td className='td-input'>
                                {ele.type === "file" ? null : ele.type === "radio" ?
                                    <>
                                        {ele.Options.map((option, index) => (
                                            <div key={index}>
                                                <input
                                                    name={ele.name}
                                                    onChange={onChangeHandler}
                                                    type={ele.type}
                                                    value={option}
                                                    checked={inputData[ele.name] && inputData[ele.name].includes(option)}
                                                />
                                                <label>{option}</label>
                                            </div>
                                        ))}
                                        {/* <span className="error">{errors[ele.name]}</span> */}
                                    </>
                                    :
                                    ele.type === "select" ? null :
                                        ele.label !== "Family Inforamation" &&
                                        <React.Fragment>
                                            <input
                                                name={ele.name}
                                                onChange={onChangeHandler}
                                                value={inputData[ele.name]}
                                                type={ele.type}
                                                className='inputField'
                                            />
                                            {/* <span className="error">{errors[ele.name]}</span> */}
                                        </React.Fragment>
                                }
                                {
                                    ele.type === "select" &&
                                    <React.Fragment>
                                        <select
                                            className='inputField'
                                            onChange={onChangeHandler}
                                            name={ele.name}
                                            value={inputData[ele.name] || ""}
                                            >
                                            <option value="">Select</option>
                                            {ele.Options.map((option, index) => (
                                                <option value={option} key={index}>{option}</option>
                                            ))}
                                        </select>
                                        {/* <span className="error">{errors[ele.name]}</span> */}
                                    </React.Fragment>
                                }
                                {ele.type === "file" &&
                                    <React.Fragment>
                                        <input
                                            type={ele.type}
                                            name={ele.name}
                                            accept="image/*"
                                            onChange={onChangeHandler}
                                        />
                                    </React.Fragment>
                                }
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td style={{marginBottom:"20px"}} className='td-label'>
                            {
                                isBtnValid ? <button onClick={updateHandler} className='table-btn-update'>Update</button>
                                    : <button onClick={editHandler} className='table-btn-edit'>Edit</button>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EditPage;






