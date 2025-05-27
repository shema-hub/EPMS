import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Layout from './components/Layout';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Salaries from './pages/Salaries';
import Payroll from './pages/Payroll';
import Dashboard from './pages/Dashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <Layout>
                  <Employees />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <PrivateRoute>
                <Layout>
                  <Departments />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/salaries"
            element={
              <PrivateRoute>
                <Layout>
                  <Salaries />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/payroll"
            element={
              <PrivateRoute>
                <Layout>
                  <Payroll />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
