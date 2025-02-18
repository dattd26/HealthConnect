import React from "react";

const FeaturesSection = () => {
    return (
        <div class="features">
            <div class="feature-card">
                <img src="video-call-icon.svg" alt="Video Call"/>
                <h3>Tư vấn qua Video</h3>
                <p>Gặp bác sĩ trực tiếp qua chất lượng hình ảnh HD.</p>
            </div>
            <div class="feature-card">
                <img src="prescription-icon.svg" alt="E-Prescription"/>
                <h3>Đơn thuốc điện tử</h3>
                <p>Nhận đơn thuốc số hóa, gửi trực tiếp đến nhà thuốc.</p>
            </div>
            <div class="feature-card">
                <img src="payment-icon.svg" alt="Secure Payment"/>
                <h3>Thanh toán an toàn</h3>
                <p>Hỗ trợ Visa, Mastercard, MoMo, ZaloPay.</p>
            </div>
        </div>
    )
};

export default FeaturesSection;