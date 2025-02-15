import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import VehicleCard from "./VehicleCard";
const VehiclesManager = () => {
    const [vehicles, setVehicles] = useState([]);
    useEffect(() => {
        const fetchVehicles = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get("http://localhost:8080/api/vehicles/my-vehicles", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setVehicles(res.data);
            } catch (error) {
                console.error("Failed to fetch vehicles", error);
            }
        };
    
        fetchVehicles();
    }, []);

    return (
        <div>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Xe Đang Bán</h2>
            <div className="flex m-4 p-6 gap-4">
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle}/>
                ))}
            </div>
        </section>
        </div>
      );
}

export default VehiclesManager;