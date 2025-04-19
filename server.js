const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Endpoint to receive user data
app.post('/saveUserData', (req, res) => {
    const userData = req.body;

    if (!userData) {
        return res.status(400).send('No data received');
    }

    const filePath = path.join(__dirname, 'userData.txt');
    const dataToWrite = `User Data:\n${JSON.stringify(userData, null, 2)}\n\n`;

    // Append the data to the text file
    fs.appendFile(filePath, dataToWrite, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Failed to save data');
        }
        console.log('User data saved successfully');
        res.status(200).send('Data saved successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});