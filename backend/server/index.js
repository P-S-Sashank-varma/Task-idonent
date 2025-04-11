const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
require('dotenv').config();
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Use CORS middleware
app.use(cors()); // This will allow all origins. You can configure it to allow specific origins.

app.use(express.json());

const mongoURI = 'mongodb://127.0.0.1:27017/taskidovenet'; // MongoDB URI (local)

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Use the task routes
app.use('/api/tasks', taskRoutes);

// Sample endpoint to check if the API is running
app.get('/', (req, res) => {
  res.send("Task Mate API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
