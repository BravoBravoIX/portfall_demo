import React from 'react';

export default function VendorAccessLogCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Login Access Logs</h3>
      <div className="text-sm font-mono text-gray-700 space-y-1 max-h-52 overflow-y-auto">
        <p>[09:12:15] vendor_user@trustedvendor.com – IP 203.55.142.19 – Success</p>
        <p>[09:13:02] vendor_user – Failed login – invalid token</p>
        <p>[09:15:22] vendor_patch_agent – IP 203.55.142.19 – Patch upload started</p>
      </div>
    </div>
  );
}