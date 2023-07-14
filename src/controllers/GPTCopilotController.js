const { Configuration, OpenAIApi } = require("openai");
const apiConfig = require('../config/api');


const configuration = new Configuration({
  apiKey: apiConfig.OPENAI_API_KEY,
});
const messages = [];
const openai = new OpenAIApi(configuration);

exports.processMessage = async(req, res)=>{

  try {
   
    //console.log("req.body.message: "+req.body.message);
   
    messages.push({ role: "user", content: req.body.message});
    
    // Create a chat completion using the OpenAI API
    const completion = await openai.createChatCompletion({
     model: "gpt-3.5-turbo",
     messages: messages,
    });

    // Extract the completion text from the API response
    const completion_text = completion.data.choices[0].message.content;

    // Log the completion text to the console
    console.log(completion_text);

    // Send the completion text as the response
    res.send(completion_text);

  }
   catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred' });
  }
  
};


