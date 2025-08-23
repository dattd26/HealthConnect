import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRouter from './Components/common/AppRouter.jsx';
import Header from './Components/layout/Header';
import Footer from './Components/layout/Footer';
import ToastProvider from './Components/common/Toast';
import ErrorBoundary from './Components/common/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary fallbackMessage="Ứng dụng gặp lỗi. Vui lòng tải lại trang.">
      <ToastProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <AppRouter />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

// ReactDOM.render(<App />, document.getElementById('root'));

export default App;
