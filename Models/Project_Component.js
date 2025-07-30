const mongoose = require('mongoose');

//* Project Schema *//
const ProjectSchema = new mongoose.Schema({
    site_name: {
        type: String,
        required: true,
    },
    aggrement_no: {
        type: String,
        default: null,
    },
    aggrement_date: {
        type: Date,
        default: null,
    },
    site_address: {
        type: String,
        required: true,
    },
    client_name: {
        type: String,
        required: true,
    },
    client_mobile: {
        type: String,
        required: true,
    },
    client_email: {
        type: String,
        required: true,
    },
    gst_no: {
        type: Number,
        required: true,
    },
    payment_amount: {
        type: Number,
        required: true,
    },
    additional_notes: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending',
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Project = mongoose.model('project', ProjectSchema);





module.exports = {
    Project,

};
