const mongoose = require('mongoose');

const DeliveryListFormSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    name: {
        type: String,   
        required: true
    },
},{
    timestamps: true,
    versionKey: false
})

const DeliveryListForm = mongoose.model('delivery_list_form', DeliveryListFormSchema);
 
const DeliveryListSubFormSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    type: {
        type: String,
        required: true
    },
    parent_form_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'delivery_list_form',
        required: true
    },
    metadata : {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
},{
    timestamps: true,
    versionKey: false
})

const DeliveryListSubForm = mongoose.model('delivery_list_sub_form', DeliveryListSubFormSchema);

const DeliveryListSubFormEntrySchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    parent_sub_form_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'delivery_list_sub_form',
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        required: true  
    },
},{
    timestamps: true,
    versionKey: false
})

const DeliveryListSubFormEntry = mongoose.model('delivery_list_sub_form_entry', DeliveryListSubFormEntrySchema);

module.exports = {
    DeliveryListForm,
    DeliveryListSubForm,
    DeliveryListSubFormEntry
};
