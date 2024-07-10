const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Import axios for ngrok API call

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error(err);
});

// Ngrok API endpoint
app.get('/ngrok-url', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:4040/api/tunnels');
    const tunnels = response.data.tunnels;
    const httpTunnel = tunnels.find(tunnel => tunnel.proto === 'https'); // Look for HTTPS tunnel
    if (httpTunnel) {
      res.json({ url: httpTunnel.public_url });
    } else {
      res.status(404).json({ message: 'Ngrok HTTPS tunnel not found' });
    }
  } catch (error) {
    console.error('Error fetching ngrok URL:', error.message);
    res.status(500).json({ message: 'Error fetching ngrok URL' });
  }
});

// Define a user schema and model
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
});

const User = mongoose.model('User', UserSchema);

// Define a partner schema and model
const PartnerSchema = new mongoose.Schema({
  company: {
    name: String,
    description: String,
    type_of_organization: String,
    contact: {
      email: String,
      phone_number: String,
      address: {
        street: String,
        city: String,
        state: String,
        zip_code: String,
        country: String
      },
      website: String
    },
    resources_available: [{
      resource_name: String
    }]
  }
});

const Partner = mongoose.model('Partner', PartnerSchema);

// Route to get account details
app.get('/accountDetails', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Routes for authentication
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send(err);
  }
});

// For demonstration purposes, create a route to register users (you can remove this in production)
app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ email, password: hashedPassword, firstName, lastName }); // Save the hashed password
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get partner data
app.get('/partners', async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to add a new partner
app.post('/addPartner', async (req, res) => {
  const { company } = req.body;
  try {
    const newPartner = new Partner({ company });
    await newPartner.save();
    res.json({ message: 'Partner added successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to update an existing partner
app.put('/partners/:id', async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json(partner);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to delete a partner
app.delete('/partners/:id', async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
