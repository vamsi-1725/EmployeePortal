import React, { useState,useEffect } from 'react';
import "../CSS/ContentPage.css";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ContentPage = () => {

    const nav = useNavigate();
    const [sel,setSel]=useState("")
    // const [selectBox, setSelectBox] = useState("");
    const selected=useSelector(state => state.selectedDate)
    

  useEffect(()=>{
        setSel(selected);
        console.log("::::selected::::",selected);

    },[selected])

    useEffect(() => {
        if (sel) {
            nav(`/Home/${sel}`);
        }
    }, [sel]);

 const selectChangeHandler = (e) => {

   const selectedOption = e.target?.value;
    setSel(selectedOption);
        
    }

    return (
        <div>
            <div className='selectBox'>
                {/* <select className='selectBox-ele' onChange={selectChangeHandler} value={sel}> */}
                <div className='selectBox-ele'>
            <input
                type="text"
                className="w-full placeholder-gray-400 text-gray-900 p-4"
                placeholder="Search"
                // onChange={search}
                // value={query}
            />
            <button className="bg-white p-4">🔍</button>
        </div>
                {/* </select> */}
            </div>
        </div>
    );
};

export default ContentPage;
