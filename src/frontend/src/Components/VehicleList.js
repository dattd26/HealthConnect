import React, {useEffect, useState} from "react";
import axios from "axios";
import VehicleCard from "./VehicleCard";

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const token = localStorage.getItem('token');
    useEffect ( () => {
        axios.get("http://localhost:8080/api/vehicles", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setVehicles(response.data);
            })
            .catch(err => {
                console.error("Loi khi gui req lay danh sach xe", err);
            })
    }, []);

    return (
        <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Xe Nổi Bật</h2>
            <div className="flex m-4 p-6 gap-4">
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle}/>
                ))}
            </div>
        </section>
    );
}

export default VehicleList;