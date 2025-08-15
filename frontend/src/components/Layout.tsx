/**
 * Modern Layout component for the Pipeline Risk Dashboard
 * @fileoverview Redesigned layout with glass morphism, modern navigation, and professional aesthetics
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  // Update time every minute for the header
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Map View', 
      href: '/map', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      name: 'Pipelines', 
      href: '/pipelines', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Risk Assessment', 
      href: '/risk-assessments', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      name: 'AI Predictions', 
      href: '/predictions', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-purple-500'
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getPageTitle = () => {
    const currentNav = navigation.find(nav => nav.href === location.pathname);
    return currentNav?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(147, 197, 253, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative flex h-screen">
        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          
          {/* Glass Morphism Sidebar */}
          <div className="h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl">
            
            {/* Logo Section */}
            <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
              <div className={`flex items-center space-x-3 transition-opacity duration-300 ${
                sidebarCollapsed ? 'opacity-0' : 'opacity-100'
              }`}>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">IRM Pipeline</h1>
                  <p className="text-xs text-blue-100">Risk Assessment</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  className="hidden lg:block p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <svg className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 px-4">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group relative flex items-center space-x-3 rounded-xl font-medium transition-all duration-200 ${
                          sidebarCollapsed 
                            ? (active 
                                ? 'px-4 py-3 bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg transform scale-[1.02] border border-white/20 backdrop-blur-sm'
                                : 'px-4 py-3 text-slate-600 hover:bg-white/60 hover:text-slate-900 hover:scale-[1.02] hover:shadow-md hover:border hover:border-white/30'
                              )
                            : (active
                                ? 'px-3 py-3 bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg transform scale-[1.02] border border-white/20 backdrop-blur-sm'
                                : 'px-3 py-3 text-slate-600 hover:bg-white/60 hover:text-slate-900 hover:scale-[1.02] hover:shadow-md hover:border hover:border-white/30'
                              )
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {/* Icon with enhanced styling */}
                        <div className={`flex-shrink-0 transition-all duration-200 ${
                          sidebarCollapsed 
                            ? (active 
                                ? 'px-4 py-2.5 rounded-xl bg-white/30 backdrop-blur-sm text-white shadow-lg border border-white/20' 
                                : 'px-4 py-2.5 rounded-xl bg-slate-100/80 text-slate-500 group-hover:bg-white/90 group-hover:text-slate-700 group-hover:shadow-md group-hover:border group-hover:border-slate-200/50'
                              )
                            : (active 
                                ? 'p-2.5 rounded-xl bg-white/30 backdrop-blur-sm text-white shadow-lg border border-white/20' 
                                : 'p-2.5 rounded-xl bg-slate-100/80 text-slate-500 group-hover:bg-white/90 group-hover:text-slate-700 group-hover:shadow-md group-hover:border group-hover:border-slate-200/50'
                              )
                        }`}>
                          {item.icon}
                        </div>
                        
                        <span className={`font-medium transition-opacity duration-300 ${
                          sidebarCollapsed ? 'opacity-0 lg:opacity-0' : 'opacity-100'
                        }`}>
                          {item.name}
                        </span>

                        {/* Enhanced active indicator */}
                        {active && !sidebarCollapsed && (
                          <div className="absolute right-3 w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-md border border-white/20" />
                        )}
                        
                        {/* Active indicator for collapsed state */}
                        {active && sidebarCollapsed && (
                          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-8 bg-white rounded-full shadow-md border-l border-white/20" />
                        )}

                        {/* Enhanced tooltip for collapsed state */}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-6 px-4 py-2 bg-slate-900/95 backdrop-blur-sm text-white text-sm font-medium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-lg border border-slate-700/50">
                            {item.name}
                            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-slate-900/95" />
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* System Status - Enhanced */}
            <div className={`absolute bottom-6 transition-all duration-300 ${
              sidebarCollapsed ? 'left-2 right-2 opacity-100' : 'left-4 right-4 opacity-100'
            }`}>
              {!sidebarCollapsed ? (
                <div className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <h3 className="text-sm font-semibold text-slate-700">System Health</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">API Server</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">AI Engine</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span className="text-xs text-green-600 font-medium">Ready</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Data Sync</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-xs text-blue-600 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="group relative bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Tooltip for collapsed system status */}
                  <div className="absolute left-full ml-6 px-4 py-3 bg-slate-900/95 backdrop-blur-sm text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-lg border border-slate-700/50">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold">System Health</div>
                      <div className="space-y-1 text-xs">
                        <div>API Server: Online</div>
                        <div>AI Engine: Ready</div>
                        <div>Data Sync: Active</div>
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-slate-900/95" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Expand Button for Collapsed Sidebar */}
        {sidebarCollapsed && (
          <button
            className="hidden lg:block fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            onClick={() => setSidebarCollapsed(false)}
            title="Expand Navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Modern Top Bar */}
          <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-white/60 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Breadcrumb */}
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                    {getPageTitle()}
                  </h1>
                  <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="hidden sm:block text-sm text-slate-500">
                    Pipeline Risk Management
                  </span>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-4">
                {/* Time Display */}
                <div className="hidden md:block text-sm text-slate-600 bg-white/60 px-3 py-1.5 rounded-lg border border-white/20">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/60 rounded-lg transition-all relative">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5m0-5V7a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2h5" />
                    </svg>
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  </button>
                  
                  <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/60 rounded-lg transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Page content with modern container */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
