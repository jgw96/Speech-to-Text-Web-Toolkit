let transcriber: any | undefined = undefined;

self.onmessage = async (e) => {
    if (e.data.type === 'transcribe') {
        return new Promise((resolve) => {
            console.log("in worker", e.data)
            localTranscribe(e.data.blob).then((transcription) => {
                console.log("in worker", transcription)
                self.postMessage({
                    type: 'transcribe',
                    transcription: transcription
                });
                resolve(transcription);
            })
        })
    }
    else if (e.data.type === "load") {
        await loadTranscriber();
    }
    else {
        console.error('Unknown message type', e.data);
        return Promise.reject('Unknown message type');
    }
}

export async function loadTranscriber(): Promise<void> {
    return new Promise(async (resolve) => {
        if (!transcriber) {
            const { pipeline, env } = await import('@xenova/transformers');
            // @ts-ignore
            env.allowLocalModels = false;
            transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base.en');

            resolve();
        }
    })
}

export async function localTranscribe(audio: any): Promise<string> {
    return new Promise(async (resolve) => {
        await loadTranscriber();

        const output = await transcriber(audio, {
            chunk_length_s: 30,
            stride_length_s: 5,
            callback_function: callback_function, // after each generation step
            chunk_callback: chunk_callback, // after each chunk is processed
        });
        console.log('output', output);

        resolve(output.text);
    })
}

// Storage for chunks to be processed. Initialise with an empty chunk.
let chunks_to_process = [
    {
        tokens: [],
        finalised: false,
    },
];

// TODO: Storage for fully-processed and merged chunks
// let decoded_chunks = [];

function chunk_callback(chunk: any) {
    let last = chunks_to_process[chunks_to_process.length - 1];

    console.log("chunk_callback", chunk)

    // Overwrite last chunk with new info
    Object.assign(last, chunk);
    last.finalised = true;

    // Create an empty chunk after, if it not the last chunk
    if (!chunk.is_last) {
        chunks_to_process.push({
            tokens: [],
            finalised: false,
        });
    }
}

// Inject custom callback function to handle merging of chunks
function callback_function(item: any) {
    const time_precision =
        transcriber.processor.feature_extractor.config.chunk_length /
        transcriber.model.config.max_source_positions;

    let last: any = chunks_to_process[chunks_to_process.length - 1];

    // Update tokens of last chunk
    last.tokens = [...item[0].output_token_ids];

    console.log("callback_function", item, last)

    // Merge text chunks
    // TODO optimise so we don't have to decode all chunks every time
    let data = transcriber.tokenizer._decode_asr(chunks_to_process, {
        time_precision: time_precision,
        return_timestamps: true,
        force_full_sequences: false,
    });

    console.log("callback_function", data);
}