import {React, useState, useEffect} from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoggedIn(false); return
        }
        fetch("http://localhost:8080/api/auth/check-token", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
        })
        .then((response) => {
            if (response.status == 200)
                setIsLoggedIn(true);
            else {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
            }
        })
        .catch(() => {
            setIsLoggedIn(false);
            localStorage.removeItem("token");
          });
        console.log(token);
        setIsLoggedIn(!!token);
    }, []);
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        window.location.href = "/";
    };
    return (
        <header className="bg-orange-600 text-white p-4">
              <div className="container mx-auto flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Xe Cũ</h1>
                  <nav>
                      <ul className="flex justify-center items-center gap-4">
                          <li><Link to="/">Trang chủ</Link></li>
                          <li><Link to="/vehicles-manager">Xe bán</Link></li>
                          { (!isLoggedIn) ? (
                                <>
                                    <li><Link to="/login">Đăng nhập</Link></li>
                                    <li><Link to="/register">Đăng ký</Link></li> 
                                </>
                            ) : (
                                <>
                                    {/* <li><Link to="/profile">Hồ sơ</Link></li> */}
                                    <li><Link to="/sell-vehicle" className="bg-green-500 px-3 py-1 rounded hover:bg-green-700">Bán xe</Link></li>
                                    <li >
                                        <button
                                            onClick={handleLogout}
                                            className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Đăng xuất
                                        </button>
                                    </li>
                                </>
                            ) 
                        }
                      </ul>
                  </nav>
              </div>
          </header>
    );
}

export default Header;