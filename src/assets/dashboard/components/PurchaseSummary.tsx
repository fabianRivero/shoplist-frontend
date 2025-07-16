import axios from "axios";
import { useEffect, useState } from "react";

const PurchaseSummary = () => {
    const [data, setData] = useState([]);

    const API_URL = "http://localhost:3000/api/purchases";

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("token:", token);
        if(!token){
            console.log("no se encontró token")
            return;
        }


        const fetchData = async () => {
            const response = await axios.get(API_URL);
            setData(response.data);
        };
        fetchData();
    }, []);
    return(
        <div>
            {/* {data.map(item => (
                <div key={item.id}>

                </div>
            ))} */}
        </div>
    )
}

export default PurchaseSummary;