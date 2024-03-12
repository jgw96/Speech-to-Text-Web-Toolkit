# Speech-To-Text Web Toolkit

## Currently in Alpha, not even on NPM yet

```html
  <speech-to-text></speech-to-text>
```

The Speech-To-Text Web Toolkit is a web component that a developer can use to enable accurate speech-to-text, either locally or in the cloud, in their web-based application, including a WebView. Think of it as an upgrade to the Web Speech API.

Speech-To-Text uses the Azure Speech Recognition API to do speech-to-text in the cloud. For local speech-to-text, Speech-To-Text uses Transformers.js to run the OpenAI Whisper model locally. 

## Usage Example

```html
  <speech-to-text localOrCloud="local" apiKey="">
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