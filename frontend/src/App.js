import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRouter from './Components/common/AppRouter.jsx';
import Header from './Components/layout/Header';
import Footer from './Components/layout/Footer';

const App = () => {
  return (
    <>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
};

// ReactDOM.render(<App />, document.getElementById('root'));

export default App;
