import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Clear the token from localStorage first
            localStorage.removeItem('token');
            
            // Then make the logout request to the backend
            await axios.post('/api/auth/logout', {}, {
                withCredentials: true // Important for session cookies
            });
            
            // Clear any other stored data if needed
            sessionStorage.clear();
            
            toast.success('Logged out successfully');
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
            // Even if the server request fails, we should still log the user out locally
            localStorage.removeItem('token');
            sessionStorage.clear();
            toast.error('Error during logout, but you have been logged out');
            navigate('/login', { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow flex ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/" className="absolute  left-26 text-xl font-bold text-indigo-600">
                                    EPMS
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    to="/"
                                    className="border-transparent text-gray-500 hover:border-indigo-600  hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/employees"
                                    className="border-transparent text-gray-500 hover:border-indigo-600 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Employees
                                </Link>
                                <Link
                                    to="/departments"
                                    className="border-transparent text-gray-500 hover:border-indigo-600 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Departments
                                </Link>
                                <Link
                                    to="/salaries"
                                    className="border-transparent text-gray-500 hover:border-indigo-600 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Salaries
                                </Link>
                                <Link
                                    to="/payroll"
                                    className="border-transparent text-gray-500 hover:border-indigo-600 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Payroll
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <button
                                onClick={handleLogout}
                                className=" absolute  right-26  text-gray-50 hover:bg-indigo-800  px-3 py-2 rounded-md text-sm font-medium bg-indigo-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};

export default Layout; 