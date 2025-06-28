
const adjectives = [
  'Silent', 'Brave', 'Curious', 'Gentle', 'Swift', 'Wise', 'Kind', 'Bold',
  'Calm', 'Bright', 'Free', 'Noble', 'Quick', 'Loyal', 'Proud', 'Strong',
  'Happy', 'Lucky', 'Smart', 'Cool', 'Warm', 'Fresh', 'Clear', 'Sharp',
  'Smooth', 'Clever', 'Honest', 'Peaceful', 'Cheerful', 'Friendly'
];

const nouns = [
  'Eagle', 'Wolf', 'Bear', 'Lion', 'Tiger', 'Fox', 'Owl', 'Hawk',
  'Dolphin', 'Whale', 'Shark', 'Turtle', 'Penguin', 'Falcon', 'Raven', 'Swan',
  'Mountain', 'River', 'Ocean', 'Forest', 'Valley', 'Storm', 'Thunder', 'Lightning',
  'Star', 'Moon', 'Sun', 'Cloud', 'Wind', 'Fire', 'Ice', 'Stone',
  'Journey', 'Dream', 'Hope', 'Spirit', 'Soul', 'Heart', 'Mind', 'Path'
];

export const generateRandomUsername = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}${noun}${number}`;
};

export const generateMultipleUsernames = (count: number = 3): string[] => {
  const usernames = new Set<string>();
  
  while (usernames.size < count) {
    usernames.add(generateRandomUsername());
  }
  
  return Array.from(usernames);
};
