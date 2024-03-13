# Speech-To-Text Web Toolkit

The Speech-To-Text Web Toolkit is a web component that a developer can use to enable accurate speech-to-text, either locally or in the cloud, in their web-based application, including a WebView. Think of it as an upgrade to the Web Speech API.

Speech-To-Text uses the Azure Speech Recognition API to do speech-to-text in the cloud. For local speech-to-text, Speech-To-Text uses Transformers.js to run the OpenAI Whisper model locally. 

```bash
npm i speech-to-text-toolkit
```

## API
```html
  <!-- this will do speech-to-text locally on your device, see below this code block for more examples -->
  <speech-to-text localOrCloud="local">
    <button id="start-button">Start</button>
    <button id="stop-button">Stop</button>
  </speech-to-text>

  <script type="module">
    document.querySelector('#start-button').addEventListener('click', startRecording);
    document.querySelector('#stop-button').addEventListener('click', stopRecording);

    const speechToText = document.querySelector('speech-to-text');

    speechToText.addEventListener('recognized', (e) => {
      console.log('recognized', e.detail);
    });

    function startRecording() {
      console.log('startRecording');
      speechToText.startSpeechToText();
    }

    function stopRecording() {
      console.log('stopRecording');
      speechToText.stopSpeechToText();
    }
  </script>
```

## More Usage examples

### Do transcription on the device

The Speech-To-Text Toolkit can do speech-to-text on the device, using the users GPU with a fallback to the CPU. This does mean that you use more of the users device resources, and depending on the device, execution may be slower. However, this also means that your speech never leaves the users device. To use local transcription, set up <speech-to-text /> like the following:

```html
  <!-- this will do speech-to-text locally on your device, see below this code block for more examples -->
  <speech-to-text localOrCloud="local">
    <button id="start-button">Start</button>
    <button id="stop-button">Stop</button>
  </speech-to-text>
```

### Do transcription in the cloud with the Azure Speech SDK

1. Get started by grabbing an API key for the Azure Speech SDK as described [here](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/get-started-speech-to-text?tabs=windows%2Cterminal&pivots=programming-language-javascript#prerequisites).
2. Now, using your new API key + the region you created it for, let's set up <speech-to-text /> like the following:

```html
  <speech-to-text localOrCloud="cloud" apiKey="your api key" region="your region, such as westus">
    <button id="start-button">Start</button>
    <button id="stop-button">Stop</button>
  </speech-to-text>
```
The component will now use the Azure Speech SDK for Speech-To-Text transcription. Note, this will incur a cost as the docs linked to above discuss.

### Do transcription in the cloud or locally based on the device

The Speech-To-Text Web toolkit can also decide automatically to do the transcription in the cloud or locally. To enable this, set up <speech-to-text /> like the following:

```html
  <speech-to-text localOrCloud="automatic" apiKey="your api key" region="your region, such as westus">
    <button id="start-button">Start</button>
    <button id="stop-button">Stop</button>
  </speech-to-text>
```

<speech-to-text /> will run locally if the users device has more than 4GB of RAM, and has a battery level over 50%. Otherwise, transcription will happen in the cloud.
