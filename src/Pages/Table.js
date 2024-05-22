import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import "../CSS/Table.css";
import { useDispatch, useSelector } from 'react-redux';
// import ViewProfile from './ViewProfile';

const Table = () => {
    const dispatch = useDispatch();
    const [getEmpData, setGetEmpData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [dataset, setDataset] = useState([])



    const navigate = useNavigate()
    const handleview = (data) => {
        console.log(":::", dataset)
        dispatch({type:"SELECTED-DATA",payload:"viewProfile"})
        dataset.map((ele) => {
            if (ele.e_id === data.e_id) {
                console.log('data:', ele)
                dispatch({ type: "DETAILS", payload: ele });

            }
        })
        // console.log("data:",dataset)
        navigate('/Home/ViewProfile')
    }


    const handleDelete = async (data) => {
        
        if (window.confirm("Are u sure u want to Delete")) {

            setGetEmpData(getEmpData.filter(emp => emp.e_id !== data.e_id));
            await axios
                .delete(`http://192.168.2.126:3002/empDetails/delete-empDetails?e_id=${data.e_id}`).then(
                    () => {

                    })
                .catch((err) => {
                    console.log("error")
                    alert("Id not found")
                })
        }

    };
    const handleEdit = (data) => {
        dispatch({type:"SELECTED-DATA",payload:"edit"})
        console.log(data.e_id)
        dataset.map((ele) => {
            if (ele.e_id === data.e_id) {

                dispatch({ type: "EditDetails", payload: ele });

            }
        })
        navigate('/Home/edit')
    }
    useEffect(() => {
        axios.get("http://192.168.2.126:3002/empDetails/getAll-empDetails")
            .then(res => {
                setDataset(res.data.data);
                console.log("::::",res.data.data)
            }).catch(err => console.log(err));
    }, [])

    useEffect(() => {
        axios.get("http://192.168.2.126:3002/empDetails/getAll-empDetails")
            .then(res => {
                const getData = res.data.data;
                // setDataset(res.data.data)
                const filteredData = getData.map(ele => {
                    delete ele.e_anniversarydate;
                    delete ele.e_bloodgroup;
                    delete ele.e_bod;
                    delete ele.e_fathername;
                    delete ele.e_gender;
                    delete ele.e_mothername;
                    delete ele.e_pwd;
                    ele.e_joining= ele.e_joining?.split('T')[0];
                    ele.e_relieving=ele.e_relieving?.split('T')[0];
                    ele.e_updateddate=ele.e_updateddate?.split('T')[0]
                    return ele;
                });
                
                setGetEmpData(filteredData);
            }).catch(err => console.log(err));
    }, []);

    useEffect(() => {
        console.log("getEmpData:::", getEmpData)
    }, [getEmpData]);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = getEmpData?.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const viewPageHandler = (ele) => {
        console.log("eleData::", ele);
    }


    return (
        <div>
            <div className='ViewPage-table'>
                <table className='tableData' border="1" style={{ borderRadius: "20px", borderCollapse: "collapse" }}>
                    <thead>
                        {/* {getEmpData?.length > 0 && ( */}
                        <tr>
                            {/* {Object.keys(getEmpData[0]).map((items, i) => ( */}
                            <th style={{ padding: "5px" }}>Id</th>
                            <th style={{ padding: "5px" }}>Name</th>
                            <th style={{ padding: "5px" }}>Email</th>
                            <th style={{ padding: "5px" }}>Role</th>
                            <th style={{ padding: "5px" }}>Contact</th>
                            <th style={{ padding: "5px" }}>Project Name</th>
                            <th style={{ padding: "5px" }}>Joining date</th>
                            <th style={{ padding: "5px" }}>Relieving date</th>
                            <th style={{ padding: "5px" }}>Photo</th>
                            <th style={{ padding: "5px" }}>Status</th>
                            <th style={{ padding: "5px" }}>Recently updated date</th>
                            {/* ))} */}
                        </tr>
                        {/* )} */}
                    </thead>
                    <tbody>
                        {getEmpData?.length > 0 && currentRows.map((ele, i) => (
                            <tr key={i}>
                                {Object.entries(ele).map(([key, value], index) => (
                                    <td className='table-td' key={index}>
                                        {key === "e_photo" ? (
                                            <img height="30px" width="30px" src={`data:image/jpeg;base64,${arrayBufferToBase64(value?.data)}`} alt="Employee Photo" />
                                        ) : (
                                            value
                                        
                                        )}

                                    

                                    </td>
                                ))}
                                <td>
                                    <button onClick={() => handleview(ele)} style={{ backgroundColor: "orange", color: "white", padding: "5px", borderStyle: "none", borderRadius: "4px" }}>View</button>

                                    &nbsp;&nbsp;
                                    <button onClick={() => { handleEdit(ele) }} style={{ backgroundColor: "blue", color: "white", padding: "5px", borderStyle: "none", borderRadius: "4px" }}>Edit</button>
                                    &nbsp;&nbsp;

                                    <button onClick={() => { handleDelete(ele) }} style={{ backgroundColor: "red", color: "white", padding: "5px", borderStyle: "none", borderRadius: "4px" }}>Delete</button>

                                </td>

                            </tr>
                        ))}
                
                        
                    </tbody>
                </table>
            </div>
            <div >
                <ul className="viewPageTable-pagination">
                    {Array.from({ length: Math.ceil(getEmpData?.length / rowsPerPage) }, (_, i) => i + 1).map(number => (
                        <li className='pagination-item' key={number}>
                        <a className='pagination-link' href="#" onClick={() => paginate(number)}>{number}</a>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default Table;





