import { useCallback, useEffect, useState } from 'react';
import * as documentsApi from '../api/documents.api';

const POLL_MS = 3000;

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setDocuments(await documentsApi.listDocuments());
      setError('');
    } catch {
      setError('Could not load your documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Poll only while something is still processing (processing -> ready/failed)
  const hasProcessing = documents.some((d) => d.status === 'processing');
  useEffect(() => {
    if (!hasProcessing) return undefined;
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [hasProcessing, refresh]);

  // Show a freshly uploaded document immediately, without waiting for the next poll
  const addDocument = useCallback((doc) => {
    setDocuments((prev) => [doc, ...prev.filter((d) => d.id !== doc.id)]);
  }, []);

  return { documents, loading, error, refresh, addDocument };
}