import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiBookmark, FiMenu, FiX } from 'react-icons/fi';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-emerald-500 dark:text-emerald-400 font-bold border-b-2 border-emerald-500 dark:border-emerald-400 pb-1'
      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors pb-1';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 sticky top-0 backdrop-blur-md z-50 transition-colors">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* লোগো */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
          <span className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-slate-950 text-lg sm:text-xl shadow-lg shadow-emerald-500/20 shrink-0">
            ⚡
          </span>
          <div className="min-w-0">
            <h1 className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white leading-tight truncate">
              Admission<span className="text-emerald-500 dark:text-emerald-400">Crack</span>
            </h1>
            <p className="text-[7px] sm:text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider whitespace-nowrap">
              Smart Varsity Mission
            </p>
          </div>
        </Link>

        {/* ডানপাশ: থিম টগল ও মেনু */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          
          {/* থিম টগল বাটন */}
          {toggleTheme && (
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer flex items-center justify-center shrink-0 relative z-10"
              title="Toggle Day/Night Mode"
            >
              {isDarkMode ? <FaSun className="text-xs sm:text-sm pointer-events-none" /> : <FaMoon className="text-xs sm:text-sm pointer-events-none" />}
            </button>
          )}

          {/* ডেস্কটপ মেনু লিঙ্ক */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-semibold whitespace-nowrap">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/science" end className={linkClass}>Science (বিজ্ঞান)</NavLink>
            <NavLink to="/arts" end className={linkClass}>Arts (মানবিক)</NavLink>
            <NavLink to="/science/mock" className={linkClass}>মক টেস্ট</NavLink>
            <NavLink to="/bookmarks" className={({ isActive }) => isActive ? 'text-amber-500 dark:text-amber-400 font-bold border-b-2 border-amber-500 dark:border-amber-400 pb-1 flex items-center gap-1' : 'text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors pb-1 flex items-center gap-1'}>
              <FiBookmark className="text-xs" /> রিভিশন হাব
            </NavLink>
          </nav>

          {/* মোবাইল মেনু বাটন */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
          >
            {isMobileMenuOpen ? <FiX className="text-lg pointer-events-none" /> : <FiMenu className="text-lg pointer-events-none" />}
          </button>
        </div>
      </div>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1.5 shadow-lg">
          <NavLink to="/" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 dark:hover:text-emerald-400">Home</NavLink>
          <NavLink to="/science" onClick={closeMobileMenu} className="block px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 dark:hover:text-emerald-400">Science (বিজ্ঞান)</NavLink>
          <NavLink to="/arts" onClick={closeMobileMenu} className="block px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 dark:hover:text-emerald-400">Arts (মানবিক)</NavLink>
          <NavLink to="/science/mock" onClick={closeMobileMenu} className="block px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 dark:hover:text-emerald-400">মক টেস্ট</NavLink>
          <NavLink to="/bookmarks" onClick={closeMobileMenu} className="block px-3.5 py-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800">রিভিশন হাব</NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;