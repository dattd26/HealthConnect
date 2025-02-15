import logo from './logo.svg';
import './App.css';
import Headers from './Components/Header.js';
import VehicleList from './Components/VehicleList.js';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login.jsx';
import SellVehicle from './Components/SellVehicle.js';
import VehiclesManager from './Components/VehiclesManage.js';
import SearchFilter from './Components/SearchFilter.js';
import ChatRoom from './Components/ChatRoom.jsx';
import { useLocation } from 'react-router-dom';
import PatientDashboard from './Components/PatientDashboard.jsx';
const App = () => {
    const location = useLocation();
    const vehicle = location.state ? location.state.vehicle : null;
  return (
    <Routes>
        {/* <Route path="/" element={<div>
            <Headers />
            <main className="container mx-auto p-4">
                <SearchFilter />
                <VehicleList />
                <section>
                    <h2 className="text-xl font-bold mb-4">Tin Tức Mới Nhất</h2>
                    <div className="space-y-4">
                        <div className="border p-4 rounded">
                            <h3 className="text-lg font-bold">Khuyến Mãi Tháng 10</h3>
                            <p className="text-gray-700">Nhận ngay ưu đãi lên đến 50 triệu VND khi mua xe trong tháng 10.</p>
                        </div>
                        <div className="border p-4 rounded">
                            <h3 className="text-lg font-bold">Xe Mới Về</h3>
                            <p className="text-gray-700">Cập nhật những mẫu xe mới nhất vừa về tại showroom.</p>
                        </div>
                        <div className="border p-4 rounded">
                            <h3 className="text-lg font-bold">Hướng Dẫn Bảo Dưỡng Xe</h3>
                            <p className="text-gray-700">Những mẹo nhỏ giúp bạn bảo dưỡng xe tốt hơn.</ p>                               </div>
                    </div>
                </section>
            </main>
            <footer className="bg-orange-600 text-white p-4 mt-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2023 Xe Cũ Huế. All rights reserved.</p>
                </div>
            </footer>
        </div>}/> */}
        

         <Route path="/login" element={<Login />} />
         <Route path="/dashboard" element={<PatientDashboard />} />
         {/* <Route path="/sell-vehicle" element={<SellVehicle />} />
         <Route path="/vehicles-manager" element={<VehiclesManager />} />
         <Route path='/chat-room' element={<ChatRoom senderUsername={localStorage.getItem("user")} receiverUsername={(vehicle ? vehicle.owner : null)}/>}/> */}
      </Routes>
  );
};

// ReactDOM.render(<App />, document.getElementById('root'));

export default App;
