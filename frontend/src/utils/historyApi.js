// Fake API to fetch assessment history by UUID
export const fetchHistoryByUuid = async (uuid) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock data for the given UUID
  // In a real scenario, this would call an endpoint like `/history/${uuid}`
  const mockHistory = [
    {
      id: '1',
      date: '2026-03-14 10:30',
      text: 'The quick brown fox jumps over the lazy dog.',
      score: 85,
      fluency: 80,
      pronunciation: 90,
    },
    {
      id: '2',
      date: '2026-03-13 14:15',
      text: 'To be or not to be, that is the question.',
      score: 72,
      fluency: 65,
      pronunciation: 78,
    },
    {
      id: '3',
      date: '2026-03-12 09:45',
      text: 'She sells seashells by the seashore.',
      score: 92,
      fluency: 95,
      pronunciation: 90,
    },
    {
      id: '4',
      date: '2026-03-11 16:20',
      text: 'Peter Piper picked a peck of pickled peppers.',
      score: 68,
      fluency: 60,
      pronunciation: 75,
    },
  ];

  return mockHistory;
};
