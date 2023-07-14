const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { Configuration, OpenAIApi } = require("openai");
const apiConfig = require('../config/api');
var formidable = require('formidable'); // utility for handling multipart/form-data Content-Type
const voice = require('elevenlabs-node');//https://api.elevenlabs.io/v1/voices


const configuration = new Configuration({
  apiKey: apiConfig.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Directory to store temporary files
const tempDir = path.join(__dirname, '..', 'temp');

// Global array of messages
const messages = [];

exports.processMessage = async (req, res) => {
  try 
  {
    var message = '';
    var form = new formidable.IncomingForm();


    // parse a multipart/form-data
    // The fields variable stores the parameters sent via POST through unity.
    form.parse(req, async (err, fields, files) => {

      message = fields.message;
      console.log("Messages:", message);
      console.log("fields.message:", fields.message);

      // Store the message in the global array of messages
      messages.push({ role: "user", content: message });

      console.log("Messages:", messages);

      // Call the OpenAI API to generate the response
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });

      const completion_text = completion.data.choices[0].message.content;
      console.log(completion_text);

      voice.textToSpeechStream(apiConfig.IIELEVENLABS_API_KEY, apiConfig.VOICE_ID, completion_text)
  .then(responseStream => {
    // Define the temporary file paths for the audio files
    const tempFilePath = path.join(tempDir, 'temp.mp3');
    const convertedAudioPath = path.join(tempDir, 'converted_response.wav');

    // Create a write stream to save the response audio to a temporary file
    const writeStream = fs.createWriteStream(tempFilePath);
    responseStream.pipe(writeStream); // Pipe the response stream to the write stream

    // When the writing is finished
    writeStream.on('finish', () => {
      // Convert the temporary audio file to WAV format
      convertToWav(tempFilePath, convertedAudioPath, () => {
        // Read the converted WAV audio data
        const wavData = fs.readFileSync(convertedAudioPath);

        // Convert the audio data to a base64-encoded string
        const audioDataString = Buffer.from(wavData).toString('base64');

        // Construct the response object
        const response = {
          channelCount: getChannelCount(wavData),
          sampleRate: getSampleRate(wavData),
          audioData: audioDataString,
          completionText: completion_text
        };

        // Remove the temporary files
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(convertedAudioPath);

        // Send the response as a JSON string
        res.send(JSON.stringify(response).toString());
      });
    });
  })//END_THEN
      .catch(error => {
        console.error(error);
     
      });//END_CATCH
      

    });//END_FORM
   

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred' });
  }//END_CATCH
  
};//END_EXPORTS

function convertToWav(mp3Path, wavPath, callback) {
  const ffmpeg = spawn('ffmpeg', ['-i', mp3Path, '-ar', '16000', wavPath]);

  ffmpeg.on('error', (error) => {
    console.error('Error when running FFmpeg:', error);
    callback(error);
  });

  ffmpeg.on('exit', (code) => {
    if (code === 0) {
      console.log('Conversion to WAV completed');
      callback(null); // Passa null para indicar que não houve erro
    } else {
      const errorMessage = `FFmpeg process exited with code ${code}`;
      console.error(errorMessage);
      callback(new Error(errorMessage));
    }
  });
}//END_FUNCTION


// Function to get the channel count of the WAV audio
function getChannelCount(wavData) {
  return Math.floor(wavData.readUInt16LE(22));
}

// Function to get the sample rate of the WAV audio
function getSampleRate(wavData) {
  return Math.floor(wavData.readUInt32LE(24));
}

// Check if the temporary directory exists, otherwise create it
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}
