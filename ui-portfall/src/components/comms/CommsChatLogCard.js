import React from 'react';

export default function CommsChatLogCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Internal Chat Log</h3>
      <div className="text-sm text-gray-700 space-y-1 font-mono max-h-52 overflow-y-auto">
        <p>[09:24:17] Emma (Tech): Noticing some weird latency between nodes...</p>
        <p>[09:24:38] David (Ops): Yeah – two container alerts failed to push.</p>
        <p>[09:25:12] Emma: SMTP queue spike... Could be affecting internal mail.</p>
        <p>[09:26:05] Rahul (Legal): Can someone confirm if the ops outage is tracked?</p>
        <p>[09:27:32] David: Can’t reach CCTV. Going manual.</p>
      </div>
    </div>
  );
}