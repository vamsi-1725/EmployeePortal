
import { useSelector } from 'react-redux';
import "../CSS/profile.css";

const ViewProfile = () => {
    
    const getData = useSelector(state => state.profileDetails);
    console.log("Details::::", getData);
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };
    const det = Object.entries(getData).filter(([key, value]) =>

    
        key !== 'e_photo');
    console.log(det)
    
    return (

        // <div>
        <div className='container'>
            {/* <div className="container1">
                <div className="card1">
                    <img height="350px" src={`data:image/jpeg;base64,${arrayBufferToBase64(getData?.e_photo?.data)}`} alt="Employee Photo" style={{ width: '105%' }} />
                    <h1>{getData.e_name}</h1>
                    <p className="title">{getData.e_role}</p>

                </div>
            </div> */}
            <div className="container2">
                <div className="card2">
                    <div style={{position:"absolute", left:"340px", top:"20px"}}>
                    <img   className="img"src={`data:image/jpeg;base64,${arrayBufferToBase64(getData?.e_photo?.data)}`} alt="Employee Photo" style={{ width: '100px',height:'100px' }} /> 
                    </div>
                    <div>
                        <table style={{marginTop:"50px"}}>
                            <thead>
                           </thead>
                            <tbody >
                                {det.map(([key, value]) => (
                                    <tr>
                                        <td style={{ fontFamily: "Times New Roman", padding: "6px",fontWeight:"bold"}}> {key.replace('e_', '').toUpperCase()}:</td>
                                        <td style={{ fontFamily: "Times New Roman", padding: "6px" }}>{value}</td>
                                    </tr>

                                ))}


                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ViewProfile;

