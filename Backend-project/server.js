const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const departmentRoutes = require('./routes/department');
// Add payrollRoutes import
const salaryRoutes = require('./routes/salary');
const payrollRoutes = require('./routes/payroll');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Update this with your frontend URL
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key', // Change this to a secure secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/payroll', payrollRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/EPMS', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
