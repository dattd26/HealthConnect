import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./SearchFilter.css"
import VehicleCard from './VehicleCard';
const brandsAndModels = {
    "motorcycle" : {
         "Honda" : ["Winner X", "Wave", "Dream", "Future", "SH", "Vision"],
         "Yamaha": ["Exciter", "Sirius", "FZ", "Janus", "NVX"]
    },
    "car": {
         "Honda": ["CITY RS", "Civic", "Accord", "Camry"]
    }
 };
const SellVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filters, setFilters] = useState({
        keyword: null,
        type: null,
        brand: null,
        model: null,
        minPrice: null,
        maxPrice: null
    });
    // const [types, setTypes] = useState([]);
    // const [brands, setBrands] = useState([]);
    // const [models, setModels] = useState([]);

    // const handleTypesChange = () => {
        
    // };
    const [error, setError] = useState('');
    // useEffect(() => {
    //     fetchVehicles();
    // }, []);

    // const fetchVehicles = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/vehicles');
    //         setVehicles(response.data);
    //     } catch (err) {
    //         setError('Failed to fetch vehicles');
    //     }
    // };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vehicles/search', {
                params: {
                    keyword: filters.keyword || null,
                    type: filters.type || null,
                    brand: filters.brand || null,
                    model: filters.model || null,
                    minPrice: filters.minPrice || null,
                    maxPrice: filters.maxPrice || null
                },
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            setVehicles(response.data);
            setError(null)
        } catch (err) {
            setError('Failed to fetch filtered vehicles');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleClearFilters = (e) => {
      setFilters({
        keyword: "",
        type: "",
        brand: "",
        model: "",
        minPrice: "",
        maxPrice: ""
      });  
    };
    return (
        <div className="sell-vehicles-container">
            <h2>Tim kiem xe</h2>

            {/* Form tìm kiếm */}
            <div className="search-filters">
                <input
                    type="text"
                    name="keyword"
                    placeholder="Tìm kiếm theo tên xe"
                    value={filters.keyword}
                    onChange={handleChange}
                />
                <select name="type" value={filters.type} onChange={handleChange}>
                    <option value="">Loại xe</option>
                    {Object.keys(brandsAndModels).map((vehicleType, index) => {
                       return <option value={vehicleType}>{vehicleType}</option>
                    })}
                    {/* <option value="">Loại xe</option>
                    <option value="car">Ô tô</option>
                    <option value="motorcycle">Xe máy</option> */} 
                </select>
                <select name="brand" value={filters.brand} onChange={handleChange}>
                    <option value="">Hãng xe</option>
                    {(filters.type && brandsAndModels[filters.type]) ? (Object.keys(brandsAndModels[filters.type]).map((brand) => {
                       return <option value={brand}>{brand}</option>
                    })) : null}
                </select>
                <select name="model" value={filters.model} onChange={handleChange}>
                    <option value="">Mẫu xe</option>
                    {((filters.type && filters.brand) && brandsAndModels[filters.type][filters.brand]) ? (brandsAndModels[filters.type][filters.brand].map((model) => {
                       return <option value={model}>{model}</option>
                    })) : null}
                </select>
                
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Giá tối thiểu"
                    value={filters.minPrice}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Giá tối đa"
                    value={filters.maxPrice}
                    onChange={handleChange}
                />
               <div className="flex gap-2 filter-buttons">
                <button onClick={handleSearch}>Tìm kiếm</button>
                <button onClick={handleClearFilters} className="clear-button">
                    Xóa bộ lọc
                </button>
            </div>
            </div>

            {/* Hiển thị danh sách xe */}
            {error && <p className="error">{error}</p>}
            <div className="flex m-4 p-6 gap-4 vehicles-list">
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle}/>
                    ))
                ) : (
                    <p>Không có xe nào phù hợp</p>
                )}
            </div>
        </div>
    );
};

export default SellVehicles;
