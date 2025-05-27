import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Payroll = () => {
  const [payrollData, setPayrollData] = useState({
    totalEmployees: 0,
    totalSalary: 0,
    pendingPayments: 0,
    paidPayments: 0,
    recentPayments: []
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayrollData();
  }, [selectedMonth]);

  const fetchPayrollData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/payroll/summary?month=${selectedMonth}`, {
        withCredentials: true
      });
      setPayrollData(response.data);
    } catch {
      toast.error('Failed to fetch payroll data');
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleProcessPayroll = async () => {
    try {
      await axios.post('http://localhost:5000/api/payroll/process', 
        { month: selectedMonth },
        { withCredentials: true }
      );
      toast.success('Payroll processed successfully');
      fetchPayrollData();
      setShowModal(true);
    } catch {
      toast.error('Failed to process payroll');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={handleProcessPayroll}
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Process Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Employees</h3>
          <p className="text-3xl font-bold text-gray-900">{payrollData.totalEmployees}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Salary</h3>
          <p className="text-3xl font-bold text-gray-900">${payrollData.totalSalary}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Pending Payments</h3>
          <p className="text-3xl font-bold text-yellow-600">{payrollData.pendingPayments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Paid Payments</h3>
          <p className="text-3xl font-bold text-green-600">{payrollData.paidPayments}</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded my-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Payments</h2>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payrollData.recentPayments.map((payment) => (
              <tr key={payment._id}>
                <td className="px-6 py-4 whitespace-nowrap">{payment.employeeName}</td>
                <td className="px-6 py-4 whitespace-nowrap">${payment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                      payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-4xl">
            <h2 className="text-xl font-bold mb-4">Payroll for {selectedMonth}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold">Total Employees:</h3>
                <p>{payrollData.totalEmployees}</p>
              </div>
              <div>
                <h3 className="font-semibold">Total Salary:</h3>
                <p>${payrollData.totalSalary}</p>
              </div>
              <div>
                <h3 className="font-semibold">Pending Payments:</h3>
                <p>{payrollData.pendingPayments}</p>
              </div>
              <div>
                <h3 className="font-semibold">Paid Payments:</h3>
                <p>{payrollData.paidPayments}</p>
              </div>
            </div>
            <div className="overflow-auto max-h-96">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Employee</th>
                    <th className="border px-4 py-2">Amount</th>
                    <th className="border px-4 py-2">Payment Date</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.recentPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="border px-4 py-2">{payment.employeeName}</td>
                      <td className="border px-4 py-2">${payment.amount}</td>
                      <td className="border px-4 py-2">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{payment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
