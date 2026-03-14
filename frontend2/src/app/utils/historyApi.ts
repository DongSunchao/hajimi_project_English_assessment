/**
 * History API Functions
 * 
 * Functions for managing assessment history (create, read, update, delete).
 */

import { config } from '../config';
import { joinApiUrl, unwrapBody } from './apiUtils';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  referenceText: string;
  topic: string;
  overallScore: number;
  pronunciation: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  weakPhonemes: string[];
  phonemeScores: Record<string, number>;
}

const getOrCreateUserId = (): string => {
  const key = 'app_user_id';
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  localStorage.setItem(key, generated);
  return generated;
};

/**
 * Check if we're in development mode without backend
 */
const isDevelopmentMode = () => {
  return !config.api.baseUrl || config.api.baseUrl.includes('localhost');
};

/**
 * Fetches assessment history from the backend
 * Falls back to mock data if backend is unavailable
 * 
 * @returns Promise<HistoryEntry[]>
 */
export async function fetchHistory(): Promise<HistoryEntry[]> {
  if (isDevelopmentMode()) {
    console.info('[History API] Development mode: Using mock data');
    return Promise.resolve(getMockHistory());
  }

  try {
    const url = joinApiUrl(config.api.baseUrl, config.api.endpoints.history);
    const userId = getOrCreateUserId();

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }

    const data = unwrapBody(await response.json());
    const dbItems = data.history || [];

    const mappedHistory: HistoryEntry[] = dbItems.map((item: any) => {
      const rawTs = item.timestamp;
      const timestampNumber = typeof rawTs === 'number' ? rawTs : Number(rawTs);
      const timestamp = Number.isFinite(timestampNumber)
        ? new Date(timestampNumber * 1000).toISOString()
        : new Date(rawTs).toISOString();

      const overallScore = Number(item.score || 0);
      const fluency = item.fluencyScore !== undefined ? Number(item.fluencyScore) : overallScore;
      const accuracy = item.accuracyScore !== undefined ? Number(item.accuracyScore) : overallScore;
      const completeness = item.completenessScore !== undefined ? Number(item.completenessScore) : 100;

      return {
        id: String(rawTs ?? crypto.randomUUID()),
        timestamp,
        referenceText: item.referenceText || item.recognizedText || 'No text recorded',
        topic: item.topic || 'General',
        overallScore,
        pronunciation: accuracy,
        accuracy,
        fluency,
        completeness,
        weakPhonemes: item.weakPhonemes || [],
        phonemeScores: item.phonemeScores || {},
      };
    });

    return mappedHistory;
  } catch (error) {
    console.info('[History API] Backend unavailable, using mock data');
    return getMockHistory();
  }
}

/**
 * Saves a new assessment result to history
 * 
 * @param entry - History entry to save
 * @returns Promise<HistoryEntry>
 */
export async function saveToHistory(
  entry: Omit<HistoryEntry, 'id' | 'timestamp'>
): Promise<HistoryEntry> {
  const newEntry: HistoryEntry = {
    ...entry,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
  };

  // Use mock in development mode
  if (isDevelopmentMode()) {
    console.info('[History API] Development mode: Simulating save to history');
    return Promise.resolve(newEntry);
  }

  try {
    const url = joinApiUrl(config.api.baseUrl, config.api.endpoints.history);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save history: ${response.statusText}`);
    }
    
    const data = await response.json();
    return unwrapBody(data);
  } catch (error) {
    console.info('[History API] Backend unavailable, returning local entry');
    // Return the entry even if save failed
    return newEntry;
  }
}

/**
 * Mock history data for development/testing
 */
export const getMockHistory = (): HistoryEntry[] => {
  return [
    {
      id: '1',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      referenceText: 'The quick brown fox jumps over the lazy dog.',
      topic: 'General',
      overallScore: 85,
      pronunciation: 88,
      accuracy: 82,
      fluency: 86,
      completeness: 84,
      weakPhonemes: [],
      phonemeScores: {},
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      referenceText: 'She sells seashells by the seashore.',
      topic: 'General',
      overallScore: 72,
      pronunciation: 70,
      accuracy: 75,
      fluency: 72,
      completeness: 71,
      weakPhonemes: [],
      phonemeScores: {},
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      referenceText: 'Peter Piper picked a peck of pickled peppers.',
      topic: 'General',
      overallScore: 68,
      pronunciation: 65,
      accuracy: 70,
      fluency: 69,
      completeness: 68,
      weakPhonemes: [],
      phonemeScores: {},
    },
  ];
};