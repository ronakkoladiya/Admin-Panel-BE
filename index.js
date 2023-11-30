const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const routes = require("./routes/index");
const {config} = require("./config/env");
const connectionDb = require("./config/dbConnection");

const main = async () => {
    try {
        config();
        await connectionDb();
        const app = express();

        app.use(cors());
        app.use(bodyParser.json());
        app.use(routes);

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log({Error: error.message});
    }
};

main().then();