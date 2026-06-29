import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import PartnerSidebar from '../layouts/PartnerSidebar';
import ChatButton from '../ui/ChatButton';
import { useAuthStore } from '../../store/useAuthStore';
import type { ActiveTabType } from '../../types'

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('stats');
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          <Outlet context={{ activeTab, setActiveTab }} />
        </div>
      </main>

      {user?.role === 'USER' && <PartnerSidebar setActiveTab={setActiveTab} />}

      {user?.role === 'USER' && <ChatButton />}
    </div>
  );
};

export default DashboardLayout;