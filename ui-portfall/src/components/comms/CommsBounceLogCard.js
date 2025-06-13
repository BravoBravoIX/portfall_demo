import React from 'react';

export default function CommsBounceLogCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Email Bounce / Queue Log</h3>
      <div className="text-sm text-gray-600 space-y-1 max-h-52 overflow-y-auto">
        <p>[09:26:12] Email queue spiked to 210 pending messages.</p>
        <p>[09:26:25] Retry: mail to ops@portnet.internal delayed.</p>
        <p>[09:27:02] SMTP 504 error: timeout on relay node.</p>
        <p>[09:27:18] Queue retrying in 5 seconds.</p>
      </div>
    </div>
  );
}