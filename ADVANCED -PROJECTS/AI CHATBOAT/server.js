require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting (15 requests per minute)
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15,
    message: { message: 'Too many requests, please try again later.' }
});

// Apply to all requests
app.use(limiter);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        // Validate input
        if (!req.body.messages || !Array.isArray(req.body.messages)) {
            return res.status(400).json({ error: 'Invalid request format' });
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: req.body.messages,
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.error?.message || 'Failed to process your request';
        
        res.status(statusCode).json({ error: errorMessage });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));