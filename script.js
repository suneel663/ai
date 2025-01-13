// Set up the Puter.js library to use the AI chat functionality
// Include this script tag in your HTML file to use the library directly from your frontend code

// Function to call Puter.js AI Model
async function queryAI(prompt, model) {
    try {
        console.log('Querying AI with prompt:', prompt, 'Model:', model); // Log prompt and model
        const response = await puter.ai.chat(prompt, { model: model }); // Call Puter.js with prompt and model

        // Log the entire response object for inspection
        console.log('Full AI Response:', response);
      
        // Check the selected model and handle response accordingly
        if (response && response.message) {
            let aiMessage = '';
            if (model === 'claude-3-5-sonnet' && Array.isArray(response.message.content)) {
                // For Claude model, extract messages from the content array
                aiMessage = response.message.content.map(msg => msg.text).join(' ');
            } else if (typeof response.message.content === 'string') {
                // For other models, directly access the content
                aiMessage = response.message.content;
            } else {
                aiMessage = JSON.stringify(response.message); // Handle unexpected structure
            }

            console.log('AI Response:', aiMessage); // Log the response received
            document.getElementById('responseContainer').innerText = aiMessage; // Display AI response
        } else {
            console.warn('Response from AI was not valid.'); // Warning if the response is empty or not valid
            document.getElementById('responseContainer').innerText = 'No valid response received from AI.';
        }
    } catch (error) {
        console.error('Error querying AI:', error);
        document.getElementById('responseContainer').innerText = 'Error querying AI. Check console for details.';
    }
}