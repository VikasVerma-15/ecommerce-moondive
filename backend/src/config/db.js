import mongoose from "mongoose";
import serverConfig from "./index.js";
import logger from "./logger.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(serverConfig.DB_URI);
        logger.info(`MongoDB Connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
