const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//job post schema
const jobSchema = new Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        employer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        applicants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {timestamps: true}
);


const Job = mongoose.model('Job', jobSchema);
module.exports = Job;