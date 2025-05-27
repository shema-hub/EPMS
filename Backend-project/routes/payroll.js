const express = require('express');
const router = express.Router();
const Employee = require('../Models/Employee');
const Salary = require('../Models/Salary');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

// Helper to parse month string "YYYY-MM" to { monthName, year }
function parseMonthYear(monthStr) {
    const [yearStr, monthNumStr] = monthStr.split('-');
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthNumStr, 10);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = months[monthNum - 1];
    return { monthName, year };
}

// GET /api/payroll/summary?month=YYYY-MM
router.get('/summary', isAuthenticated, async (req, res) => {
    try {
        const monthParam = req.query.month;
        if (!monthParam) {
            return res.status(400).json({ message: 'Month parameter is required' });
        }
        const { monthName, year } = parseMonthYear(monthParam);

        const totalEmployees = await Employee.countDocuments();
        const salaries = await Salary.find({ month: monthName, year }).populate('employee');

        const totalSalary = salaries.reduce((sum, s) => sum + s.netSalary, 0);
        const paidPayments = salaries.filter(s => s.status === 'Paid').length;
        const pendingPayments = salaries.filter(s => s.status === 'Pending').length;

        // Prepare recent payments data
        const recentPayments = salaries
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, 10)
            .map(s => ({
                _id: s._id,
                employeeName: s.employee ? `${s.employee.firstName} ${s.employee.lastName}` : 'Unknown',
                amount: s.netSalary,
                paymentDate: s.updatedAt,
                status: s.status || 'Pending'
            }));

        res.json({
            totalEmployees,
            totalSalary,
            paidPayments,
            pendingPayments,
            recentPayments
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payroll summary', error: error.message });
    }
});

// POST /api/payroll/process
router.post('/process', isAuthenticated, async (req, res) => {
    try {
        const { month } = req.body;
        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }
        const { monthName, year } = parseMonthYear(month);

        // Find all salaries for the month and year
        const salaries = await Salary.find({ month: monthName, year });

        // Mark all salaries as Paid and update paymentDate
        const now = new Date();
        for (const salary of salaries) {
            salary.status = 'Paid';
            salary.paymentDate = now;
            await salary.save();
        }

        res.json({ message: 'Payroll processed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payroll', error: error.message });
    }
});

module.exports = router;
