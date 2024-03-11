/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/*
  TODO: Fix importing of speech-sdk, which would also fix types
*/

@customElement('speech-to-text')
export class SpeechToText extends LitElement {
  static override styles = css`
    
  `;

  @property({ type: String }) apiKey = 'a3484733425e4929ae1da1f90a5f0a16';
  @property({ type: String }) region = 'eastus';
  @property({ type: String }) language = 'en-US';

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @state() private sdk: any = window.SpeechSDK;

  audioConfig: any | undefined = undefined;
  speechConfig: any | undefined = undefined;
  recog: any | undefined = undefined;

  lines: string[] | undefined = undefined;
  finalizedLines: string[] | undefined = undefined;
  keyPoints: any[] | undefined = undefined;
  transcript: string | undefined = undefined;
  focusedLine: string | undefined = undefined;

  override render() {
    return html`
      <slot></slot>
    `;
  }

  override async firstUpdated() {
    if (this.sdk) {
      this.audioConfig = this.sdk.AudioConfig.fromDefaultMicrophoneInput();
      this.speechConfig = this.sdk.SpeechConfig.fromSubscription(this.apiKey, this.region);

      this.speechConfig!.speechRecognitionLanguage = this.language;
      this.speechConfig!.enableDictation();

      this.recog = new this.sdk.SpeechRecognizer(this.speechConfig, this.audioConfig);

      await this.setUpListeners();
    }
  }

  private async setUpListeners() {
    this.lines = [];
    this.finalizedLines = [];
    this.keyPoints = [];

    if (this.recog) {
      this.recog.recognizing = (s?: any, e?: any) => {
        console.log("s", s);
        console.log("s.results", e!.result);

        this.transcript = e!.result.text;
        if (this.lines && this.finalizedLines) {
          if (this.lines.length && this.lines[this.lines.length - 1] !== this.finalizedLines[this.finalizedLines.length - 1]) {
            // remove the last line from this.lines
            this.lines = this.lines.slice(0, this.lines.length - 1);
          }

          this.lines = [...this.lines, e!.result.text];

          this.requestUpdate();

          this.dispatchEvent(new CustomEvent('recognized-interim', {
            detail: {
              message: this.lines.join(' ')
            }
          }));
        }

      };

      this.recog.recognized = async (s?: any, e?: any) => {
        console.log(s);
        console.log('recognized', e!.result.text);

        if (e!.result.text && e!.result.text.length > 0) {
          this.finalizedLines = [...this.finalizedLines!, e!.result.text];
          this.lines = [...this.finalizedLines];

          this.focusedLine = e!.result.text;

          this.requestUpdate();

          this.dispatchEvent(new CustomEvent('recognized', {
            detail: {
              message: this.lines.join(' ')
            }
          }));
        }
      }

      this.recog.canceled = async (s?: any, e?: any) => {
        console.log(`CANCELED: Reason=${e!.reason}, ${s}`);

        this.dispatchEvent(new CustomEvent('transcribe-canceled', {
          detail: {
            message: `CANCELED: ErrorCode=${e!.errorCode}`
          }
        }));

        await this.recog!.stopContinuousRecognitionAsync();
      };

      this.recog.sessionStopped = async (s?: any, e?: any) => {
        console.log("\n    Session stopped event.", s, e);
        await this.recog!.stopContinuousRecognitionAsync();

        this.dispatchEvent(new CustomEvent('transcribe-stopped', {
          detail: {
            message: 'Speech to text stopped'
          }
        }));
      };
    }
  }

  public async startSpeechToText() {
    try {
      this.recog!.startContinuousRecognitionAsync();

      this.dispatchEvent(new CustomEvent('transcribe-started', {
        detail: {
          message: 'Speech to text started'
        }
      }));
    }
    catch (err) {
      console.error(`Error starting transcription: ${err}`);
    }
  }

  public async stopSpeechToText() {
    try {
      this.recog!.stopContinuousRecognitionAsync();

      this.dispatchEvent(new CustomEvent('transcribe-stopped', {
        detail: {
          message: 'Speech to text stopped'
        }
      }));
    }
    catch (err) {
      console.error(`Error stopping transcription: ${err}`);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'speech-to-text': SpeechToText;
  }
}
