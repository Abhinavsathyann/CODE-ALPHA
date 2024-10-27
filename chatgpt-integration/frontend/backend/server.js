const WebSocket = require('ws');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const wss = new WebSocket.Server({ port: 5000 });

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API key here
});
const openai = new OpenAIApi(configuration);

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
        console.log('Received:', message);
        try {
            // Call OpenAI's API to get a response
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
            });

            const botMessage = response.data.choices[0].message.content;
            ws.send(botMessage);
        } catch (error) {
            console.error('Error:', error);
            ws.send('Sorry, there was an error processing your request.');
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:5000');
