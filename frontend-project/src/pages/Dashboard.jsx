import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalaries: 0,
    totalPayrollProcessed: 0,
  });

  useEffect(() => {
    fetchUser();
    fetchSummary();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
      setUser(response.data);
    } catch {
      toast.error('Failed to fetch user info');
    }
  };

  const fetchSummary = async () => {
    try {
      const [employeesRes, departmentsRes, salariesRes, payrollRes] = await Promise.all([
        axios.get('http://localhost:5000/api/employees', { withCredentials: true }),
        axios.get('http://localhost:5000/api/departments', { withCredentials: true }),
        axios.get('http://localhost:5000/api/salaries', { withCredentials: true }),
        axios.get('http://localhost:5000/api/payroll/summary?month=' + new Date().toISOString().slice(0,7), { withCredentials: true }),
      ]);

      setSummary({
        totalEmployees: employeesRes.data.length,
        totalDepartments: departmentsRes.data.length,
        totalSalaries: salariesRes.data.length,
        totalPayrollProcessed: payrollRes.data.paidPayments || 0,
      });
    } catch {
      toast.error('Failed to fetch summary data');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {user ? `Welcome, ${user.email}` : 'Welcome'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Employees</h3>
            <p className="text-3xl font-bold text-gray-900">{summary.totalEmployees}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Departments</h3>
            <p className="text-3xl font-bold text-gray-900">{summary.totalDepartments}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Salaries</h3>
            <p className="text-3xl font-bold text-gray-900">{summary.totalSalaries}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Payroll Processed</h3>
            <p className="text-3xl font-bold text-gray-900">{summary.totalPayrollProcessed}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
