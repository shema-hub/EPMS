const express = require('express');
const router = express.Router();
const Salary = require('../Models/Salary');
const Employee = require('../Models/Employee');

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

// Get all salaries
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const salaries = await Salary.find().populate('employee');
        res.json(salaries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salaries', error: error.message });
    }
});

// Get single salary
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id).populate('employee');
        if (!salary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }
        res.json(salary);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salary', error: error.message });
    }
});

// Create salary
router.post('/', isAuthenticated, async (req, res) => {
    try {
        let { grossSalary, totalDeduction, netSalary, month, employee } = req.body;

        // Parse month string to month name and year
        const { monthName, year } = parseMonthYear(month);

        // Check if employee exists
        const employeeExists = await Employee.findById(employee);
        if (!employeeExists) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if salary record already exists for this employee and month/year
        const existingSalary = await Salary.findOne({ employee, month: monthName, year });
        if (existingSalary) {
            return res.status(400).json({ message: 'Salary record already exists for this employee and month/year' });
        }

        const salary = new Salary({
            grossSalary,
            totalDeduction,
            netSalary,
            month: monthName,
            year,
            employee
        });

        await salary.save();
        const populatedSalary = await Salary.findById(salary._id).populate('employee');
        res.status(201).json(populatedSalary);
    } catch (error) {
        res.status(500).json({ message: 'Error creating salary record', error: error.message });
    }
});

// Update salary
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id);
        if (!salary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        let { grossSalary, totalDeduction, netSalary, month, employee } = req.body;

        // Parse month string to month name and year
        const { monthName, year } = parseMonthYear(month);

        salary.grossSalary = grossSalary;
        salary.totalDeduction = totalDeduction;
        salary.netSalary = netSalary;
        salary.month = monthName;
        salary.year = year;
        salary.employee = employee;

        await salary.save();
        const populatedSalary = await Salary.findById(salary._id).populate('employee');
        res.json(populatedSalary);
    } catch (error) {
        res.status(500).json({ message: 'Error updating salary record', error: error.message });
    }
});

// Delete salary
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id);
        if (!salary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        await Salary.findByIdAndDelete(req.params.id);
        res.json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting salary record', error: error.message });
    }
});

// Get salaries by employee
router.get('/employee/:employeeId', isAuthenticated, async (req, res) => {
    try {
        const salaries = await Salary.find({ employee: req.params.employeeId }).populate('employee');
        res.json(salaries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee salaries', error: error.message });
    }
});

module.exports = router;
