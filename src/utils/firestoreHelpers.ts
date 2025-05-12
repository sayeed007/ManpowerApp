// firestoreHelpers.ts

/**
 * Converts Firestore timestamps to plain JavaScript objects
 * that can be safely stored in Redux
 */
export const convertTimestampsToObjects = (data: any): any => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => convertTimestampsToObjects(item));
  }

  if (typeof data === 'object' && data !== null) {
    // Check if the object is a Firestore Timestamp
    if (data.toDate && typeof data.toDate === 'function') {
      // Convert Timestamp to serializable object with ISO string
      return {
        _seconds: data._seconds || data.seconds,
        _nanoseconds: data._nanoseconds || data.nanoseconds,
        _isFirestoreTimestamp: true,
        _isoString: data.toDate().toISOString(),
      };
    }

    // Process each property of the object
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = convertTimestampsToObjects(data[key]);
      }
    }
    return result;
  }

  // Return primitive values as is
  return data;
};

/**
 * Converts the serialized timestamp objects back to Date objects
 * for easy use in the application
 */
export const getDateFromSerializedTimestamp = (timestamp: any): Date | null => {
  if (!timestamp) return null;

  if (timestamp._isFirestoreTimestamp) {
    // Use the ISO string for most accurate conversion
    return new Date(timestamp._isoString);
  }

  if (
    timestamp._seconds !== undefined &&
    timestamp._nanoseconds !== undefined
  ) {
    // Fallback to seconds/nanoseconds conversion if ISO string is not available
    return new Date(timestamp._seconds * 1000);
  }

  return null;
};
