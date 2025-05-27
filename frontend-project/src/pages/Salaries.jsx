import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee: '',
    grossSalary: '',
    totalDeduction: '',
    netSalary: '',
    month: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/salaries', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSalaries(response.data);
    } catch (error) {
      toast.error('Failed to fetch salaries');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Calculate net salary if gross salary or total deduction changes
      if (name === 'grossSalary' || name === 'totalDeduction') {
        const gross = name === 'grossSalary' ? value : prev.grossSalary;
        const deduction = name === 'totalDeduction' ? value : prev.totalDeduction;
        newData.netSalary = gross - deduction;
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/salaries/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Salary record updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/salaries', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Salary record added successfully');
      }
      setFormData({
        employee: '',
        grossSalary: '',
        totalDeduction: '',
        netSalary: '',
        month: ''
      });
      setEditingId(null);
      fetchSalaries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (salary) => {
    setFormData({
      employee: salary.employee._id,
      grossSalary: salary.grossSalary,
      totalDeduction: salary.totalDeduction,
      netSalary: salary.netSalary,
      month: salary.month
    });
    setEditingId(salary._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/salaries/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Salary record deleted successfully');
        fetchSalaries();
      } catch (error) {
        toast.error('Failed to delete salary record');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Salary Management</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Employee</label>
            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {`${employee.firstName} ${employee.lastName}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Month</label>
            <input
              type="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Gross Salary</label>
            <input
              type="number"
              name="grossSalary"
              value={formData.grossSalary}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Total Deduction</label>
            <input
              type="number"
              name="totalDeduction"
              value={formData.totalDeduction}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Net Salary</label>
            <input
              type="number"
              name="netSalary"
              value={formData.netSalary}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editingId ? 'Update Salary Record' : 'Add Salary Record'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deduction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salaries.map((salary) => (
              <tr key={salary._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {`${salary.employee.firstName} ${salary.employee.lastName}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(salary.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${salary.grossSalary}</td>
                <td className="px-6 py-4 whitespace-nowrap">${salary.totalDeduction}</td>
                <td className="px-6 py-4 whitespace-nowrap">${salary.netSalary}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(salary)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(salary._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salaries; 