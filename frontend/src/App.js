import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppRouter } from './Components/AppRouter.jsx';

const App = () => {

  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </>
  );
};

// ReactDOM.render(<App />, document.getElementById('root'));

export default App;
