const express = require('express');
const multer = require('multer');
const path = require('path');
const Seed = require('../models/Seed');

const router = express.Router();

// Setup storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Route to register seeds
router.post('/register', upload.single('image'), async (req, res) => {
    const { seedName, seedType, description, createdBy, createdByEmail } = req.body;
    const image = req.file ? req.file.path : '';

    try {
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        // Validate required fields
        if (!seedName || !seedType || !createdBy || !createdByEmail) {
            return res.status(400).json({ 
                error: 'Missing required fields', 
                details: 'seedName, seedType, createdBy, and createdByEmail are required' 
            });
        }

        // Validate ObjectId format
        if (!createdBy.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                error: 'Invalid user ID format', 
                details: 'Please log in again to get a valid user ID' 
            });
        }

        // Create a new seed instance
        const newSeed = new Seed({
            seedName,
            seedType,
            image,
            description,
            createdBy,
            createdByEmail,
        });

        await newSeed.save();

        res.status(201).json({ message: 'Seed registered successfully', seed: newSeed });
    } catch (error) {
        console.error('Error registering seed:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation error', 
                details: error.message 
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to register seed', 
            details: 'Internal server error' 
        });
    }
});

router.get('/owner/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const seeds = await Seed.find({ createdBy: id }); // Assuming createdBy is the user ID
        res.status(200).json(seeds);
    } catch (error) {
        console.error('Error fetching seeds:', error);
        res.status(500).json({ error: 'Failed to fetch seeds' });
    }
});

// Route to get all seeds
router.get('/all', async (req, res) => {
    try {
        const seeds = await Seed.find({});
        res.status(200).json(seeds);
    } catch (error) {
        console.error('Error fetching seeds:', error);
        res.status(500).json({ error: 'Failed to fetch seeds' });
    }
});


module.exports = router;
