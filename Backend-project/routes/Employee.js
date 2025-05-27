const express = require('express');
const router = express.Router();
const Employee = require('../Models/Employee');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

// Get all employees
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const employees = await Employee.find().populate('department');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
});

// Get single employee
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('department');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error: error.message });
    }
});

// Create employee
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const {
            employeeNumber,
            firstName,
            lastName,
            position,
            address,
            telephone,
            gender,
            hiredDate,
            department
        } = req.body;

        const existingEmployee = await Employee.findOne({ employeeNumber });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee number already exists' });
        }

        const employee = new Employee({
            employeeNumber,
            firstName,
            lastName,
            position,
            address,
            telephone,
            gender,
            hiredDate,
            department
        });

        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
});

// Update employee
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const {
            employeeNumber,
            firstName,
            lastName,
            position,
            address,
            telephone,
            gender,
            hiredDate,
            department
        } = req.body;

        employee.employeeNumber = employeeNumber;
        employee.firstName = firstName;
        employee.lastName = lastName;
        employee.position = position;
        employee.address = address;
        employee.telephone = telephone;
        employee.gender = gender;
        employee.hiredDate = hiredDate;
        employee.department = department;

        await employee.save();
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});

// Delete employee
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
});

module.exports = router;
