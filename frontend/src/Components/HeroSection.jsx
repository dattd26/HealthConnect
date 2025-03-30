import React from "react";

const HeroSection = () => {
    return (
        <div class="hero">
        <div class="hero-content">
            <h1>Khám bệnh trực tuyến - Tiện lợi, An toàn, Chuyên nghiệp</h1>
            <p>Kết nối với bác sĩ hàng đầu chỉ sau 5 phút, mọi lúc mọi nơi.</p>
            <button class="cta-button">Đặt lịch ngay</button>
        </div>
        <div class="hero-image">
            <img src="telemedicine-illustration.png" alt="Video call với bác sĩ"/>
        </div>
        </div>
    );
};

export default HeroSection;