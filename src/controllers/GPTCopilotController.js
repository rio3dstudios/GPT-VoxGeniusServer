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
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:  messages,
    });

    const completion_text = completion.data.choices[0].message.content;
    console.log(completion_text);
    //res.send({ reply: completion_text });
	res.send( completion_text );

  }
   catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred' });
  }
  
};


