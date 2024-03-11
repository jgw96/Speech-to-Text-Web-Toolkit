export function doLocalWhisper(audioFile: Blob) {
    return new Promise(async (resolve) => {
        const fileReader = new FileReader();
        fileReader.onloadend = async () => {
            const audioCTX = new AudioContext({
                sampleRate: 16000,
            });
            const arrayBuffer = fileReader.result as ArrayBuffer;
            const audioData = await audioCTX.decodeAudioData(arrayBuffer);

            let audio;
            if (audioData.numberOfChannels === 2) {
                const SCALING_FACTOR = Math.sqrt(2);

                let left = audioData.getChannelData(0);
                let right = audioData.getChannelData(1);

                audio = new Float32Array(left.length);
                for (let i = 0; i < audioData.length; ++i) {
                    audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2;
                }
            } else {
                // If the audio is not stereo, we can just use the first channel:
                audio = audioData.getChannelData(0);
            }


            const whisperWorker = new Worker(new URL("./local-ai.ts", import.meta.url), { type: "module" });
            whisperWorker.onmessage = async (e) => {
                if (e.data.type === "transcribe") {
                    console.log("e.data.transcript", e.data.transcription)

                    whisperWorker.terminate();

                    resolve(e.data.transcription);
                }
            }

            whisperWorker.postMessage({
                type: "transcribe",
                blob: audio,
            })

        };
        fileReader.readAsArrayBuffer(audioFile);
    })
}