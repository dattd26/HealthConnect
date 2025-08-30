import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRouter from './Components/common/AppRouter.jsx';
import Header from './Components/layout/Header';
import Footer from './Components/layout/Footer';
import ToastProvider from './Components/common/Toast';
import ErrorBoundary from './Components/common/ErrorBoundary';
import { useLocation } from 'react-router-dom';

const AppContent = () => {
  const location = useLocation();
  const isDoctorPage = location.pathname.startsWith('/doctor');
  const isPatientPage = location.pathname.startsWith('/profile') || location.pathname.startsWith('/book-appointment') || location.pathname.startsWith('/patient') || location.pathname.startsWith('/all-appointments');
  
  // Ẩn Header và Footer cho các trang có layout riêng
  const shouldShowHeaderFooter = !isDoctorPage && !isPatientPage;

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowHeaderFooter && <Header />}
      <main className="flex-grow">
        <AppRouter />
      </main>
      {shouldShowHeaderFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary fallbackMessage="Ứng dụng gặp lỗi. Vui lòng tải lại trang.">
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
