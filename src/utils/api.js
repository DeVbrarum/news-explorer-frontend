const NEWS_API_KEY = '8f0b1f6e0085475bb912e67250001728';
const PROXY_URL = 'https://nomoreparties.co/news/v2/everything';

export const fetchNews = async (query) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const url = `${PROXY_URL}?q=${encodeURIComponent(query)}&from=${pastDate}&to=${currentDate}&pageSize=100&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    throw error;
  }
}
