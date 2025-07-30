const mongoose = require('mongoose');


const StaticDataSchema = new mongoose.Schema({
  id:{
    type:Number,
    required:true,
  },
  data_name: {
    type: String,
    required: true,
  },
   type: {
    type: Number,
    required: true,
  },
}, {
  versionKey: false,
});

const Static_Data_Schema = mongoose.model('Static_data_schema', StaticDataSchema);

/** Export all models */
module.exports = {
  Static_Data_Schema
};
