'use client';

import { useEffect, useState } from 'react';

export default function ApiTest() {
  const [status, setStatus] = useState<string>('Checking API...');

  useEffect(() => {
    fetch('/api/pdf-extract')
      .then(res => res.json())
      .then(data => {
        setStatus(`API Status: ${JSON.stringify(data)}`);
      })
      .catch(err => {
        setStatus(`Error: ${err.message}`);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <pre className="bg-gray-100 p-4 rounded">{status}</pre>
    </div>
  );
} 