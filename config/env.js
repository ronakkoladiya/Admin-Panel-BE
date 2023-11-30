const dotenv = require('dotenv');

const config = () => {
    try {
        dotenv.config();
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    config
}