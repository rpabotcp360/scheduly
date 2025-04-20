require('dotenv').config({ 
    path: path.resolve(__dirname, '../.env')
  });
  
const sql = require('mssql');

// Database configuration from .env file
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_UNIVERSAL,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true, // Use encryption if required
    }
};


// Function to connect to the database
const connectDB = async () => {
    try {
        let pool = await sql.connect(dbConfig);
        console.log("✅ Connected to MS SQL Server and DB is Universal");
        return pool;
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
    }
};

module.exports = { connectDB, sql };
