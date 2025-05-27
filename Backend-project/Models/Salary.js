const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    grossSalary: {
        type: Number,
        required: true,
        min: 0
    },
    totalDeduction: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(value) {
                return value <= this.grossSalary;
            },
            message: 'Total deduction cannot be greater than gross salary'
        }
    },
    netSalary: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(value) {
                return value === this.grossSalary - this.totalDeduction;
            },
            message: 'Net salary must be equal to gross salary minus total deduction'
        }
    },
    month: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                const months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                return months.includes(value);
            },
            message: 'Invalid month'
        }
    },
    year: {
        type: Number,
        required: true,
        min: 2000,
        max: new Date().getFullYear()
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index to ensure unique salary per employee per month per year
salarySchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

// Virtual for department through employee
salarySchema.virtual('department', {
    ref: 'Department',
    localField: 'employee',
    foreignField: '_id',
    justOne: true
});

// Pre-save middleware to calculate net salary
salarySchema.pre('save', function(next) {
    this.netSalary = this.grossSalary - this.totalDeduction;
    next();
});

module.exports = mongoose.model('Salary', salarySchema); 