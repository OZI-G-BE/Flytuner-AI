// THIS IS THE USER SCHEMA FILE

const mongoose = require("mongoose");

const PrompterSchema = new mongoose.Schema({
    arrayOfPaths: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        default: "scheduled"
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("prompter", PrompterSchema)
// const IpDaySchema = new mongoose.Schema({


//     ip: {
//         type: String,
//         required: true,
//     },


// }, {
//     timestamps: true
// });
// // IpDaySchema.index({ traffic: 1 });


// //IpDaySchema.index({

// // })

// module.exports = IpDayModel = mongoose.model("IpDay", IpDaySchema); // takes in model name and schema