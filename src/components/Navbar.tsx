import React from 'react'
import { UserService } from '../services/UserService'
import type { UserModel } from '../models/UserModel'
import prioriGridLogo from "../assets/prioriGridLogo.png"

export interface NavbarProps {
    user?: UserModel | null;
    onOpenCreateDialog?: () => void;
    onLogout?: () => void;
}


export const Navbar: React.FC<NavbarProps> = ({user, onOpenCreateDialog: _onOpenCreateDialog, onLogout}) => {
   const handleSignOut = async () => {
      try {
        await UserService.logout();
        if (onLogout) {
          onLogout();
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };
  
  
    return (
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={prioriGridLogo}
                    alt="PrioriGrid Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      PrioriGrid Dashboard
                    </h1>
                    <p className="text-xs text-slate-500">
                      Welcome back, {user?.username || user?.email || "User"}
                    </p>
                  </div>
                </div>
        
                <div className="flex items-center gap-3">
                  {/* Add Task Button in Navbar */}
                 
        
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg shadow transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </header>
  )
}

export default Navbar