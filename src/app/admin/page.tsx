'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// Evita SSR para que MUI y los diálogos funcionen sin parpadeos
const AdminPanelMUI = dynamic(() => import('../components/AdminPanelMUI'), { ssr: false });

export default function AdminPage() {
  return <AdminPanelMUI />;
}
