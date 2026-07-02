import dotenv from "dotenv";

function loadEnv() {
    dotenv.config();
    console.log("environment variables loaded")
}
loadEnv();
const serverConfig = {
    PORT: Number(process.env.PORT),
    DB_URI: process.env.DB_URI
};

export default serverConfig;