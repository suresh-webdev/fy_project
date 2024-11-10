// Import the necessary packages
const express = require('express');
const cors = require('cors');

// Create an Express app
const app = express();

// Enable CORS to allow requests from your React frontend
app.use(cors());

// Mock database (In a real-world app, you'd use MongoDB, MySQL, etc.)
const users = [
  {
    user_id: '4',
    name: 'John Doe',
    oee: {
      availability: 85,
      performance: 90,
      maintenance: 92,
    },
    performance: {
      totalCount: 100,
      sopViolation: 5,
      target: 120,
    }
  },
  // You can add more users here
];

// GET endpoint to fetch user data by user_id
app.get('/api/user/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Find the user by user_id
  const user = users.find(u => u.user_id === userId);

  if (user) {
    // Send back the user data as JSON
    res.json(user);
  } else {
    // Return an error if the user is not found
    res.status(404).json({ error: 'User not found' });
  }
});

// Set up the backend to listen on port 6000
app.listen(5500, () => {
  console.log('Server is running on http://localhost:6000');
});
