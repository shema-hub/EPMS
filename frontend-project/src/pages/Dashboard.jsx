import React from 'react';
import Layout from '../components/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p>Welcome to the Employee Payroll Management System.</p>
        <p>Use the navigation links above to access different sections.</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
