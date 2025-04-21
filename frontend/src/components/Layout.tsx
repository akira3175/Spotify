
import React from 'react';
import Sidebar from './sidebar/Sidebar';
import TopBar from './TopBar';
import MusicPlayer from './player/MusicPlayer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default Layout;
