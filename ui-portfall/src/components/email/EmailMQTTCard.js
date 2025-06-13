import React from 'react';
import useEmailMessages from './useEmailMessages';

export default function EmailMQTTCard() {
  const { raw } = useEmailMessages();

  return (
    <div className="mt-3">
      {raw.length === 0 ? (
        <div className="text-center text-muted">No email-related messages received yet.</div>
      ) : (
        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
          {raw.map((inject, index) => (
            <div key={index} className="mb-3 border p-3 rounded bg-light">
              <div className="mb-1 d-flex justify-content-between">
                <small className="text-muted">Email Trigger:</small>
                <small className="text-muted">{new Date(inject.receivedAt).toLocaleTimeString()}</small>
              </div>
              <pre className="mb-0 p-2 bg-white border rounded" style={{ fontSize: '0.8rem' }}>
                {JSON.stringify(inject, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}