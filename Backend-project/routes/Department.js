const express = require('express');
const router = express.Router();
const Department = require('../Models/Department');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

// Get all departments
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error: error.message });
    }
});

// Get single department
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching department', error: error.message });
    }
});

// Create department
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { departmentCode, departmentName, grossSalary } = req.body;

        const existingDepartment = await Department.findOne({ departmentCode });
        if (existingDepartment) {
            return res.status(400).json({ message: 'Department code already exists' });
        }

        const department = new Department({
            departmentCode,
            departmentName,
            grossSalary
        });

        await department.save();
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Error creating department', error: error.message });
    }
});

// Update department
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const updatedDepartment = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating department', error: error.message });
    }
});

// Delete department
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        await Department.findByIdAndDelete(req.params.id);
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting department', error: error.message });
    }
});

module.exports = router; 