import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const SellVehicle = () => {
    const [vehicleDetails, setVehicleDetails] = useState({
        brand: "",
        model: "",
        price: null,
        year: null,
        type: "",
        description: "",
        owner: "",
        imageUrl: null,
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        // Lấy owner từ localStorage nếu có
        const owner = localStorage.getItem("user");
        if (owner) {
            setVehicleDetails((prevDetails) => ({
                ...prevDetails,
                owner: owner, // Cập nhật owner từ localStorage
            }));
        }
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVehicleDetails( {...vehicleDetails, [name]: value}, );
    };

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "XeCuHue"); // ten Upload Preset
  
      try {
          const response = await fetch(
              "https://api.cloudinary.com/v1_1/dohgfj5aa/image/upload",
              {
                  method: "POST",
                  body: formData,
              }
          );
  
          const data = await response.json();
          console.log("Uploaded image URL:", data.secure_url);

          setVehicleDetails((prevDetails) => ({
              ...prevDetails,
              imageUrl: data.secure_url,
          }));

      } catch (error) {
          console.error("Error uploading image:", error);
      }
  };
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for(const key in vehicleDetails) {
            formData.append(key, vehicleDetails[key]);
        }
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post("http://localhost:8080/api/vehicles", formData, {
                headers: { 'Content-Type': "multipart/form-data",
                  'Authorization': `Bearer ${token}`,
                },
            }); 
            console.log(res);
            localStorage.setItem('')
            navigate("/")
        } catch (error) {
            setError("Đăng bán xe không thành công!");
        }

    }
    
    return (
        <div className="sell-car-container">
          <h2>Bán Xe</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label htmlFor="brand">Hãng xe:</label>
              <input
                id="brand"
                type="text"
                name="brand"
                value={vehicleDetails.brand}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="model">Mẫu xe:</label>
              <input
                id="model"
                type="text"
                name="model"
                value={vehicleDetails.model}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="year">Năm sản xuất:</label>
              <input
                id="year"
                type="number"
                name="year"
                value={vehicleDetails.year}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="type">Loại xe:</label>
              <input
                id="type"
                type="text"
                name="type"
                value={vehicleDetails.type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="price">Giá:</label>
              <input
                id="price"
                type="number"
                name="price"
                value={vehicleDetails.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Mô tả:</label>
              <textarea
                id="description"
                name="description"
                value={vehicleDetails.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="image">Hình ảnh xe:</label>
              <input
                id="image"
                type="file"
                name="image"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit">Đăng bán xe</button>
          </form>
        </div>
      );
}

export default SellVehicle;