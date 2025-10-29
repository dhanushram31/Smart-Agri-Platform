
const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');

// GET all farms
router.get('/', async (req, res) => {
    try {
        const farms = await Farm.find();
        res.status(200).json(farms);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching farms' });
    }
});

// POST route to create a new farm

// router.post('/', async (req, res) => {
//     // const { user_id, location, crop_type, planting_schedule, soil_type, irrigation_system, size } = req.body;
//     // console.log("Got You ...");
//     try {
//         // const newFarm = new Farm({
//         //     user_id,
//         //     location,
//         //     crop_type,
//         //     planting_schedule,
//         //     soil_type,
//         //     irrigation_system,
//         //     size
//         // });
//         // console.log(newFarm);
//         // await newFarm.save();
//         res.status(201).json({ "name: ": "disha" });
//     } catch (error) {
//         res.status(500).json({ error: 'Error creating farm' });
//     }
// });

router.post('/', async (req, res) => {
    const { user_id, location, crop_type, planting_schedule, soil_type, irrigation_system, size } = req.body;
    console.log("Creating new farm with data:", req.body);
    
    // Validate required fields
    if (!user_id) {
        console.log("Error: user_id is missing");
        return res.status(400).json({ error: 'User ID is required' });
    }
    
    try {
        const newFarm = new Farm({
            user_id,
            location,
            crop_type,
            planting_schedule: planting_schedule ? new Date(planting_schedule) : new Date(),
            soil_type,
            irrigation_system,
            size: parseInt(size) || 0
        });
        console.log("Farm object created:", newFarm);
        await newFarm.save();
        console.log("Farm saved successfully");
        res.status(201).json(newFarm);
    } catch (error) {
        console.error("Error creating farm:", error);
        res.status(500).json({ error: 'Error creating farm', details: error.message });
    }
});


// GET route to retrieve a specific farm by ID
router.get('/:id', async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);
        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }
        res.status(200).json(farm);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching farm details' });
    }
});

module.exports = router;
