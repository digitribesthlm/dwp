export const normalizeAuthorName = (name, fallback = 'Sandra Ericsson') => {
  const cleaned = (name || '').trim();
  if (!cleaned) {
    return fallback;
  }

  return cleaned.toLowerCase() === 'admin' ? 'Sara Ericsson' : cleaned;
};

