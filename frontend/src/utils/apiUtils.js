export const unwrapBody = (raw) => {
  if (raw.body) {
    return typeof raw.body === 'string' ? JSON.parse(raw.body) : raw.body;
  }
  return raw;
};

export const joinApiUrl = (baseUrl, path) => {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBaseUrl}/${normalizedPath}`;
};
