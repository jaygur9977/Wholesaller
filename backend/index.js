
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv'); // for environment variables

// Initialize environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json());  // To parse JSON bodies
app.use(cors());  // Allow cross-origin requests

// Set up multer for handling file uploads
const upload = multer({ 
  dest: 'uploads/', // Directory to store uploaded files
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wholesaler_app', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Create the User model
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  fullName: { type: String, required: true },
  basePrice: { type: String, required: true },
  shopName: { type: String, required: true },
  category: { type: String, required: true },
  shopPhoto: { type: String, required: true }, 
  state: { type: String },
  city: { type: String },
  pincode: { type: String },
  address: { type: String }
}));

// User registration route (signup) with file upload
app.post('/api/users/register', upload.single('shopPhoto'), async (req, res) => {
  try {
    const { email, password, role, fullName, shopName, basePrice, category, state, city, pincode, address } = req.body;

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Handle the uploaded shop photo (file)
    const shopPhoto = req.file ? `/uploads/${req.file.filename}` : null; // Store relative path to the file

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      email,
      password: hashedPassword, // Store the hashed password
      role,
      fullName,
      basePrice,
      shopName,
      category,
      shopPhoto,  // Store the file path in the database
      state,
      city,
      pincode,
      address
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration', details: error.message });
  }
});

// Enhanced search route with better filtering
app.get('/api/users/search', async (req, res) => {
    try {
      const { searchQuery, categories, states, cities } = req.query;
  
      // Build the search filter
      const filter = { role: 'wholesaler' }; // Only show wholesalers
  
      // Handle search query
      if (searchQuery) {
        filter.$or = [
          { fullName: { $regex: searchQuery, $options: 'i' } },
          { shopName: { $regex: searchQuery, $options: 'i' } },
          { category: { $regex: searchQuery, $options: 'i' } }
        ];
      }
  
      // Handle category filter (can be array or single value)
      if (categories) {
        const categoryList = Array.isArray(categories) ? categories : [categories];
        if (categoryList.length > 0) {
          filter.category = { $in: categoryList };
        }
      }
  
      // Handle state filter
      if (states) {
        const stateList = Array.isArray(states) ? states : [states];
        if (stateList.length > 0) {
          filter.state = { $in: stateList };
        }
      }
  
      // Handle city filter
      if (cities) {
        const cityList = Array.isArray(cities) ? cities : [cities];
        if (cityList.length > 0) {
          filter.city = { $in: cityList };
        }
      }
  
      // Find wholesalers with pagination
      const wholesalers = await User.find(filter)
        .select('-password') // Exclude sensitive data
        .sort({ shopName: 1 }); // Sort alphabetically
  
      // Get available filter options based on current filters
      const availableCategories = await User.distinct('category', filter);
      const availableStates = await User.distinct('state', filter);
      const availableCities = await User.distinct('city', filter);
  
      res.status(200).json({
        success: true,
        count: wholesalers.length,
        data: wholesalers,
        filters: {
          categories: availableCategories,
          states: availableStates,
          cities: availableCities
        }
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during search',
        details: error.message
      });
    }
});

// Error handling for file uploads
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error (e.g., file size limit exceeded)
    return res.status(400).json({ error: err.message });
  }
  // Other errors
  res.status(500).json({ error: 'An error occurred' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
