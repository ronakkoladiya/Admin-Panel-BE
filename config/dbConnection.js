const mongoose = require("mongoose");

const connectionDb = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING).then(() => {
            console.log("Database has connected!");
        });
    } catch (err) {
        process.exit(1);
    }
};
module.exports = connectionDb;
