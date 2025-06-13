import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SystemInfoPage from './pages/SystemInfoPage';
import AISPage        from './pages/AISPage';
import CCTVPage       from './pages/CCTVPage';
import CommsPage      from './pages/CommsPage';
import EmailPage      from './pages/EmailPage';
import ContainersPage from './pages/ContainersPage';
import PoliciesPage   from './pages/PoliciesPage';
import MediaPage      from './pages/MediaPage';
import VendorPage     from './pages/VendorPage';
import InjectsPage    from './pages/InjectsPage';
import NotFoundPage   from './pages/NotFoundPage';
import ExecutivePage  from './pages/ExecutivePage';
import LegalPage      from './pages/LegalPage';
import OperationsPage from './pages/OperationsPage';
import TechnicalPage  from './pages/TechnicalPage';
import MediaCommunicationsPage from './pages/MediaCommunicationsPage';
import IncidentCoordinatorPage from './pages/IncidentCoordinatorPage';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import HomeRedirect from './components/HomeRedirect';
import PublicMediaDisplay from './pages/PublicMediaDisplay';

import MQTTClient from './services/MQTTClient';
import { GlobalStateProvider } from './state/globalState';
import { AuthProvider } from './auth/AuthContext';

// Completely fresh instance without any hooks or state
// This component just renders the GlobalStateProvider and Routes
function AppWrapper() {
  return (
    <GlobalStateProvider>
      <AuthProvider>
        <Routes>
          {/* Home route - handles redirect based on auth status */}
          <Route path="/" element={<HomeRedirect />} />
          
          {/* Login route - not protected */}
          <Route path="/login" element={<Login />} />
          
          {/* Public media display - not protected */}
          <Route path="/public-media" element={<PublicMediaDisplay />} />
          
          {/* Protected routes - require authentication */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="ais"         element={<AISPage />} />
            <Route path="cctv"        element={<CCTVPage />} />
            <Route path="comms"       element={<CommsPage />} />
            <Route path="email"       element={<EmailPage />} />
            <Route path="containers"  element={<ContainersPage />} />
            <Route path="policies"    element={<PoliciesPage />} />
            <Route path="media"       element={<MediaPage />} />
            <Route path="vendor"      element={<VendorPage />} />
            <Route path="injects"     element={<InjectsPage />} />
            <Route path="executive"  element={<ExecutivePage />} />
            <Route path="legal"      element={<LegalPage />} />
            <Route path="operations" element={<OperationsPage />} />
            <Route path="technical"  element={<TechnicalPage />} />
            <Route path="media-comms" element={<MediaCommunicationsPage />} />
            <Route path="incident-coordinator" element={<IncidentCoordinatorPage />} />
            <Route path="*"           element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </GlobalStateProvider>
  );
}

// The App component is just a wrapper for BrowserRouter
export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}