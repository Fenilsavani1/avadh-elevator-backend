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
    Site_Supervisor: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        // enum: [1, 2, 3],  // 1: pending, 2: approved, 3: rejected
        default: 0
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Project = mongoose.model('project', ProjectSchema);


//* Elevator Schema *//
const ElevatorSchema = new mongoose.Schema({

    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true,
    },
    type_of_elevator: {
        type: String,
        required: true,
    },
    operation_type: {
        type: String,
        default: null,
    },
    passenger_capacity: {
        type: String,
        default: null,
    },
    speed: {
        type: String,
        required: true,
    },
    no_of_floors: {
        type: String,
        required: true,
    },
    stops: {
        type: String,
        required: true,
    },
    opening_type: {
        type: String,
        required: true,
    },
    lift_well_width: {
        type: Number,
        required: true,
    },
    car_enclouser_type: {
        type: String,
        required: true,
    },
    car_flooring_type: {
        type: String,
        required: true,
    },
    car_door_type: {
        type: String,
        required: true,
    },
    landing_door_type: {
        type: String,
        required: true,
    },
    clear_opening_height: {
        type: Number,
        required: true,
    },
    clear_opening_width: {
        type: Number,
        required: true,
    },
    false_ceiling: {
        type: String,
        required: true,
    },
    ms_door_frames: {
        type: String,
        required: true,
    },
    ard_system: {
        type: Boolean,
        required: true,
        default: false,
    },
    overload_sensor: {
        type: Boolean,
        required: true,
        default: false,
    },
    telephone: {
        type: Boolean,
        required: true,
        default: false,
    },
    fan_blower: {
        type: String,
        required: true,
    },
    lop_cop: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default:0,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Elevators = mongoose.model('elevator', ElevatorSchema);


//* Pre Installation Steps Schema *//

const PreInstallationSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lift_details: {
        type: String,
        default: null,
    },
    lift_shaft_plaster: {
        type: Boolean,
        default: false,
    },
    pit_water_ppc: {
        type: Boolean,
        default: false,
    },
    machine_room_pcc: {
        type: Boolean,
        required: true,
    },
    lift_machine_clean: {
        type: Boolean,
        required: true,
    },
    whitewash_wiring: {
        type: Boolean,
        required: true,
    },
    machine_room_ladder_door_window: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const PreInstallation = mongoose.model('pre_installation', PreInstallationSchema);


//* Material Set Information Schema *//

const MaterialItemSchema = new mongoose.Schema({
    partName: {
        type: String,
        required: true
    },
    brandName: {
        type: String,  
        required: true
    },
    orderDetailsWithQty: {
        type: String,
        required: true
    },
    received: {
        type: Boolean,
        default: false
    },
    remarks: {
        type: String,
        default: null
    }
}, { _id: false });


const MaterialSetSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true,
    },
    materialSetTitle: {
        type: String,
        required: true
    },
    vendorOrderList: {
        type: [MaterialItemSchema],
        default: []
    }
}, {
    timestamps: true,
    versionKey: false
});

const MaterialSet = mongoose.model('material_set', MaterialSetSchema);


const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    company_name: {
        type: String,
        required: true,
        trim: true,
    },
    mobile_number: {
        type: String,
        required: true,
        match: /^\+?[0-9]{10,15}$/ // Optional + and 10–15 digits
    }
}, {
    timestamps: true,
    versionKey: false
});

const Vendor = mongoose.model("vendor", VendorSchema);



module.exports = {
    Project,
    Elevators,
    PreInstallation,
    MaterialSet,
    Vendor
};
