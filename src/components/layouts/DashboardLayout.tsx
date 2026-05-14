import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import type { ActiveTabType } from '../../types'

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('stats');

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          <Outlet context={{ activeTab, setActiveTab }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;