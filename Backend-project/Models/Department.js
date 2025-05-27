const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentCode: {
        type: String,
        required: true,
        unique: true
    },
    departmentName: {
        type: String,
        required: true
    },
    grossSalary: {
        type: Number,
        required: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for employees in department
departmentSchema.virtual('employees', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'department'
});

// Virtual for total department salary
departmentSchema.virtual('totalDepartmentSalary').get(async function() {
    const employees = await this.model('Employee').countDocuments({ department: this._id });
    return employees * this.grossSalary;
});

module.exports = mongoose.model('Department', departmentSchema); 