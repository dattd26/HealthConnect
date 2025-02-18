import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login.jsx';
import { useLocation } from 'react-router-dom';
import PatientDashboard from './Components/PatientDashboard.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HeroSection from './Components/HeroSection.jsx';
import Header from './Components/Header.jsx';
import FeaturesSection from './Components/FeaturesSection.jsx';
import HowItWorks from './Components/HowItWorks.jsx';
import Footer from './Components/Footer.jsx';
import "./styles/styles.css"

const App = () => {
    const location = useLocation();
    const vehicle = location.state ? location.state.vehicle : null;
  return (
    <>
        <Header />
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        
        <Footer />

        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    </>
  );
};

// ReactDOM.render(<App />, document.getElementById('root'));

export default App;
