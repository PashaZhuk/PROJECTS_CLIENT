import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';

export type ActiveTabType = 
  | 'stats'           
  | 'projects-list'    
  | 'projects-create'  
  | 'users-list'       
  | 'users-create'     
  | 'orders';          

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('stats');

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <Outlet context={{ activeTab, setActiveTab }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;