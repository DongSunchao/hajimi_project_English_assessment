/**
 * Application Configuration
 * 
 * Contains all configuration settings for the speech assessment application.
 * Includes API endpoints, recording settings, and feature flags.
 */

export const config = {
  /**
   * API Configuration
   * Base URL should be set via environment variable in production
   */
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    endpoints: {
      getUploadUrl: 'get-upload-url',
      score: 'score',
      scoreFree: 'score-free',
      aiTutor: 'ai-tutor',
      genVoice: 'gen-voice',
      history: 'history',
      tongueTwister: 'tongue-twister',
    },
  },

  /**
   * Audio Recording Configuration
   * Settings for RecordRTC and audio processing
   */
  recording: {
    desiredSampRate: 16000,
    numberOfAudioChannels: 1,
    maxDurationMs: 15000,
  },

  /**
   * Reference Text for Testing
   * Default text used when no custom text is provided
   */
  defaultReferenceText: 'Hello world, this is a test.',

  /**
   * Feature Flags
   */
  features: {
    enableWasmProcessing: true,
    enableAiTutor: true,
    enableHistory: true,
  },
} as const;

export type Config = typeof config;
