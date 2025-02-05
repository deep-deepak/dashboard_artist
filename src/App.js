
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import DonationDashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <div className="App">
      <AuthProvider>

        <DonationDashboard />
      </AuthProvider>
    </div>
  );
}

export default App;
