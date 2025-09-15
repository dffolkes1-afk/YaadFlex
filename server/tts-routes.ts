import express from 'express';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import axios from 'axios';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter for TTS - Allow 10 requests per minute per user to prevent abuse
const ttsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { 
    error: 'Too many TTS requests. Please wait before trying again.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all TTS routes
router.use(ttsRateLimit);

// Azure TTS endpoint
router.post('/azure', async (req, res) => {
  try {
    const { text, ssml, voice, format = 'mp3' } = req.body;
    
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const serviceRegion = process.env.AZURE_SPEECH_REGION || 'eastus';
    
    if (!speechKey) {
      return res.status(400).json({ error: 'Azure Speech key not configured' });
    }

    const speechConfig = speechsdk.SpeechConfig.fromSubscription(speechKey, serviceRegion);
    speechConfig.speechSynthesisOutputFormat = speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const synthesizer = new speechsdk.SpeechSynthesizer(speechConfig);

    const voiceToUse = voice || process.env.AZURE_VOICE_MALE || 'en-US-GuyNeural';
    
    // Use SSML if provided, otherwise create simple SSML from text
    let ssmlToSpeak = ssml;
    if (!ssml && text) {
      ssmlToSpeak = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${voiceToUse}">${text}</voice>
      </speak>`;
    }

    synthesizer.speakSsmlAsync(
      ssmlToSpeak,
      result => {
        if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
          res.set('Content-Type', 'audio/mpeg');
          res.send(Buffer.from(result.audioData));
        } else {
          res.status(400).json({ 
            error: 'Speech synthesis failed',
            reason: result.reason,
            errorDetails: result.errorDetails
          });
        }
        synthesizer.close();
      },
      error => {
        res.status(500).json({ error: typeof error === 'string' ? error : error.message || 'Unknown error' });
        synthesizer.close();
      }
    );

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ElevenLabs TTS endpoint
router.post('/elevenlabs', async (req, res) => {
  try {
    const { text, voice_id, model_id = 'eleven_multilingual_v2' } = req.body;
    
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'ElevenLabs API key not configured' });
    }

    const voiceId = voice_id || process.env.ELEVENLABS_VOICE_ID_MALE;
    if (!voiceId) {
      return res.status(400).json({ error: 'ElevenLabs voice ID not configured' });
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: model_id,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        responseType: 'arraybuffer'
      }
    );

    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(response.data));

  } catch (error: any) {
    res.status(500).json({ 
      error: 'ElevenLabs TTS failed',
      details: error.response?.data || error.message 
    });
  }
});

// YaadFlex preset voices endpoint
router.post('/yaadflex-voice', async (req, res) => {
  try {
    const { text, tone = 'corporate', gender = 'male' } = req.body;
    
    // YaadFlex brand voice presets
    const voicePresets = {
      male: {
        'laid-back': {
          voice: process.env.AZURE_VOICE_MALE || 'en-US-GuyNeural',
          rate: '-4%',
          pitch: '-1st'
        },
        'corporate': {
          voice: process.env.AZURE_VOICE_MALE || 'en-US-GuyNeural',
          rate: '+1%',
          pitch: '0st'
        },
        'energetic': {
          voice: process.env.AZURE_VOICE_MALE || 'en-US-GuyNeural',
          rate: '+6%',
          pitch: '+2st'
        }
      },
      female: {
        'laid-back': {
          voice: process.env.AZURE_VOICE_FEMALE || 'en-US-JennyNeural',
          rate: '-2%',
          pitch: '-0.5st'
        },
        'corporate': {
          voice: process.env.AZURE_VOICE_FEMALE || 'en-US-JennyNeural',
          rate: '+2%',
          pitch: '+1st'
        },
        'energetic': {
          voice: process.env.AZURE_VOICE_FEMALE || 'en-US-JennyNeural',
          rate: '+8%',
          pitch: '+3st'
        }
      }
    };

    const preset = voicePresets[gender as keyof typeof voicePresets]?.[tone as keyof (typeof voicePresets)['male']] || voicePresets.male.corporate;
    
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="${preset.voice}">
        <prosody rate="${preset.rate}" pitch="${preset.pitch}">
          ${text}
        </prosody>
      </voice>
    </speak>`;

    // Forward to Azure endpoint with generated SSML
    const azureReq = { body: { ssml }, ...req };
    try {
      const speechKey = process.env.AZURE_SPEECH_KEY;
      const serviceRegion = process.env.AZURE_SPEECH_REGION || 'eastus';
      
      if (!speechKey) {
        return res.status(400).json({ error: 'Azure Speech key not configured' });
      }

      const speechConfig = speechsdk.SpeechConfig.fromSubscription(speechKey, serviceRegion);
      speechConfig.speechSynthesisOutputFormat = speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
      const synthesizer = new speechsdk.SpeechSynthesizer(speechConfig);

      synthesizer.speakSsmlAsync(
        ssml,
        result => {
          if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
            res.set('Content-Type', 'audio/mpeg');
            res.send(Buffer.from(result.audioData));
          } else {
            res.status(400).json({ 
              error: 'Speech synthesis failed',
              reason: result.reason,
              errorDetails: result.errorDetails
            });
          }
          synthesizer.close();
        },
        error => {
          res.status(500).json({ error: typeof error === 'string' ? error : error.message || 'Unknown error' });
          synthesizer.close();
        }
      );
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;