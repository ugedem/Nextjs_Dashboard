
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, DocumentDuplicateIcon, UserGroupIcon, PowerIcon } from './Icons';
import AcmeLogo from './AcmeLogo';
import { useAuth } from '../App';

const navLinks = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentDuplicateIcon },
  { name: 'Customers', href: '/customers', icon: UserGroupIcon },
];

const SideNav: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-blue-600">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-700 p-4 md:h-40"
        to="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {navLinks.map((link) => {
          const LinkIcon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.href}
              end
              className={({ isActive }) => 
                `flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
                ${isActive ? 'bg-sky-100 text-blue-600' : ''}`
              }
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </NavLink>
          );
        })}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <button
          onClick={handleSignOut}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      </div>
    </div>
  );
};

export default SideNav;
