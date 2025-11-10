/* Utility helpers related to Firestore payload hygiene. */
export const sanitizeFirestoreData = <T>(obj: T): T | undefined => {
  if (obj === undefined || obj === null) return undefined;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    const cleanedArray = obj
      .filter(item => item !== undefined)
      .map(item => sanitizeFirestoreData(item))
      .filter(item => item !== undefined);
    return (cleanedArray.length > 0 ? cleanedArray : undefined) as T | undefined;
  }

  let entries: [string, unknown][];
  try {
    entries = Object.entries(obj as Record<string, unknown>);
  } catch (error) {
    console.error('sanitizeFirestoreData: failed to enumerate object', error, obj);
    return undefined;
  }

  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of entries) {
    if (value === undefined || (typeof value === 'string' && value.trim() === '')) {
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      const sanitized = sanitizeFirestoreData(value);
      if (sanitized !== undefined) {
        cleaned[key] = sanitized;
      }
    } else {
      cleaned[key] = value;
    }
  }

  return (Object.keys(cleaned).length > 0 ? (cleaned as T) : undefined);
};
