import { apiBaseUrl } from '../config.json';

export const fetchHistoryByUuid = async (userId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }) 
    });

    if (!response.ok) {
      throw new Error(`History API error, status: ${response.status}`);
    }

    const data = await response.json();
    const dbItems = data.history || [];

    const mappedHistory = dbItems.map((item) => {
      const dateObj = new Date(item.timestamp * 1000);
      
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

      return {
        id: item.timestamp.toString(),
        date: formattedDate,
        text: item.referenceText || item.recognizedText || 'No text recorded',
        topic : item.topic || 'General',
        score: item.score || 0,
        fluency: item.fluencyScore !== undefined ? item.fluencyScore : (item.score || 0),                
        pronunciation: item.accuracyScore !== undefined ? item.accuracyScore : (item.score || 0),
        completeness: item.completenessScore !== undefined ? item.completenessScore : 100,
        
        weakPhonemes: item.weakPhonemes || []    
      };
    });

    console.log("please check the history data:", mappedHistory);
    return mappedHistory;

  } catch (error) {
    console.error("❌ failed to fetch history:", error);
    return []; 
  }
};