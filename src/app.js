require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./db_universal');
const flairRoutes = require('./routes/flairRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();


// API Routes
app.use('/api/cp360/datascience/scheduly', flairRoutes);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Default route
app.get('/', (req, res) => {
    res.send({ message: 'CP360 Data Science Scheduly API is running...' });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
