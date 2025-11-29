'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import AdminGateway from '@/pages/admin-gateway/AdminGateway';

// Evita SSR para que MUI y los diálogos funcionen sin parpadeos
const AdminPanelMUI = dynamic(() => import('../components/AdminPanelMUI'), { ssr: false });

export default function AdminPage() {
  // return <AdminPanelMUI />;
  return <AdminGateway />;
}
