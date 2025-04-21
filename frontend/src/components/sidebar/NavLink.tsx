
import React from 'react';

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavLink = ({ icon, label, isActive = false }: NavLinkProps) => {
  return (
    <button className={`nav-link w-full ${isActive ? 'active' : ''}`}>
      <div className="text-current">{icon}</div>
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
};

export default NavLink;
