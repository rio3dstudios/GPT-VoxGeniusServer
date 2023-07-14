<p align="center">
 <img width="100px" src="https://i.imgur.com/N9vZIB1.png" align="center" alt="GPT-VoxGenius" />
 <h2 align="center">GPT-VoxGenius</h2>
 <p align="center">GPT-VoxGenius Server is an NodeJS server to get openai API completion text and convert to audio vocie with elevenlabs API!</p>
</p>
  <p align="center">
    <a href="https://github.com/rio3dstudios/GPT-VoxGeniusServer/graphs/contributors">
      <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/rio3dstudios/GPT-VoxGeniusServer" />
    </a>
    <a href="https://github.com/rio3dstudios/GPT-VoxGeniusServer/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/rio3dstudios/GPT-VoxGeniusServer?color=0088ff" />
    </a>
    <a href="https://github.com/rio3dstudios/GPT-VoxGeniusServer/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/rio3dstudios/GPT-VoxGeniusServer?color=0088ff" />
    </a>
    <br />
    <br />
    <a>
      <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
    </a>
    <a>
      <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>
    </a>
  </p>

  <p align="center">
    <a href="https://github.com/rio3dstudios/GPT-VoxGeniusServer/issues/new/choose">Report Bug</a>
    ·
    <a href="https://github.com/rio3dstudios/GPT-VoxGeniusServer/issues/new/choose">Request Feature</a>
  </p>
</p>

<p align="center">Drop us a ⭐ on GitHub to <a href="https://rio3dstudios.wixsite.com/rio3dstudios">help</a> the project improve!</p>
<p align="center">
  <a href="https://github.com/rio3dstudios/GPT-VoxGeniusServer/stargazers">
    <img alt="Stars" src="https://img.shields.io/github/stars/rio3dstudios/GPT-VoxGeniusServer.svg" />
  </a>
</p>


# GPT-VoxGenius Server
Basic NodeJS Server in Java Script for Unity GPT-VoxGenius asset

GPT-VoxGenius: Conversations & Script 


The GPT-VoxGenius offers a comprehensive solution for integrating AI-powered conversations and script assistance into Unity projects. 
 

* Check out our online documentation for more information:

 
 
## To Run


```
# clone the project
git clone https://github.com/rio3dstudios/GPT-VoxGeniusServer.git


# open the project directory in windows cmd
cd GPT-VoxGeniusServer

# install dependencies
npm install


# start the application
npm run dev or npm start 


# endpoints
http://localhost:3000/api/copilot
http://localhost:3000/api/npc

```

## Usage

Using the openai API.

```javascript

const configuration = new Configuration({
  apiKey: apiConfig.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:  messages,
    });

    const completion_text = completion.data.choices[0].message.content;
    console.log(completion_text);
	res.send( completion_text );
});
```

Generating an audio file from openai API completion_text
NOTICE: to do the audio conversion you need to have FFmpeg installed on your machine (https://github.com/BtbN/FFmpeg-Builds/releases)
tutorial how to install FFmpeg in windows 10: https://www.youtube.com/watch?v=qjtmgCb8NcE
```javascript
const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");
const voice = require('elevenlabs-node');//https://api.elevenlabs.io/v1/voices

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
  });


```
