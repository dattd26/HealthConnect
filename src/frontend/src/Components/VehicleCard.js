import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const VehicleCard = ({ vehicle }) => {
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();
    const handleChatClick = () => {
        navigate("/chat-room", { state: { vehicle } });
    };
    return (
        <div
            className="border p-4 rounded flex flex-col relative"
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
        >
            <img
                src={vehicle.imageUrl}
                alt="Hình ảnh xe ô tô màu đỏ, đời 2020, đang đỗ trong bãi xe"
                className="mb-4 w-60 h-80 object-cover rounded"
            />
            <h3 className="text-lg font-bold w-60">
                {vehicle.brand + " " + vehicle.model + " " + vehicle.year}
            </h3>
            <p className="text-gray-700 w-60">Giá: {vehicle.price} VND</p>

            {/* Hiển thị thông tin khi di chuột */}
            {showDetails && (
                <div className="absolute top-0 left-0 bg-white p-4 rounded-lg shadow-lg w-full transition-opacity duration-300 opacity-100">
                    <p className="text-sm text-gray-800 mb-2">
                        <span className="font-semibold text-blue-500">Mô tả:</span> {vehicle.description}
                    </p>
                    <p className="text-sm text-gray-800">
                        <span className="font-semibold text-green-500">Chủ sở hữu:</span> {vehicle.owner}
                    </p>
                    <button
                        onClick={handleChatClick}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
                        >
                        Nhắn tin
                    </button>


                    {/* {showChat && <ChatRoom senderUsername={localStorage.getItem("user")} receiverUsername={vehicle.owner} />} */}
                </div>
            )}

        </div>
    );
};

export default VehicleCard;