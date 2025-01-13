require('dotenv').config(); // Load environment variables from .env file
const http = require('http');

const API_KEYS = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY // Fetch OpenAI-like API key
};

// Check if the API key is set
if (!API_KEYS.OPENAI_API_KEY) {
    console.error('API key not provided. Set OPENAI_API_KEY in the .env file.');
    process.exit(1);
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/chat') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to String
        });

        req.on('end', async () => {
            try {
                const requestBody = JSON.parse(body);
                const prompt = requestBody.prompt || '';
                const model = requestBody.model || 'gpt-4o-mini'; // Default model if none specified
                const apiKey = requestBody.apiKey; // Expect API key to be sent in request

                // Call the Puter.js API model with the prompt and model
                const response = await puter.ai.chat(prompt, { model: model });

                // Format the response to match OpenAI's API response
                const aiResponse = {
                    choices: [{
                        message: {
                            role: 'assistant',
                            content: response.message.content // Access the message content appropriately
                        }
                    }],
                    usage: {
                        input_tokens: response.usage.input_tokens,
                        output_tokens: response.usage.output_tokens,
                    },
                    finish_reason: response.finish_reason || 'stop'
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(aiResponse));
            } catch (error) {
                console.error('Error processing request:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});