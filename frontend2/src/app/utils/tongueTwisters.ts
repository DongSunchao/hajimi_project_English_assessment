/**
 * Tongue Twisters Data
 * 
 * Collection of tongue twisters for pronunciation practice.
 * Each twister targets specific phonemes and sounds.
 */

export const tongueTwisters = [
  'She sells seashells by the seashore.',
  'Peter Piper picked a peck of pickled peppers.',
  'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
  'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.',
  'The thirty-three thieves thought that they thrilled the throne throughout Thursday.',
  'Red lorry, yellow lorry, red lorry, yellow lorry.',
  'Unique New York, unique New York, you know you need unique New York.',
  'I scream, you scream, we all scream for ice cream!',
  'Six slippery snails slid slowly seaward.',
  'A proper copper coffee pot.',
];

/**
 * Returns a random tongue twister from the collection
 */
export function getRandomTongueTwister(): string {
  return tongueTwisters[Math.floor(Math.random() * tongueTwisters.length)];
}
