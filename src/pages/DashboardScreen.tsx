import React from "react";
import { UserService } from "../services/UserService";
import type { UserModel } from "../models/UserModel";
import prioriGridLogo from "../assets/prioriGridLogo.png"

interface DashboardScreenProps {
    user?: UserModel | null;
    onLogout?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onLogout }) => {
    
    
    const handleSignOut = async () => {
        try{
            await UserService.logout();
            if (onLogout){
                onLogout();
            }
        } catch (error){
            console.error("Error logging out:", error);
        }
    };

    return(
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
            <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img 
                        src={prioriGridLogo}
                        alt="PrioriGrid Logo"
                        className="w-15 h-15 object-contain *:"
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

                <button onClick={handleSignOut} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg shadow transition-colors cursor-pointer">
                    Sign Out 
                </button>
            </header>

            <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-slate-900">Welcome to your Dashboard!</h2>
                    <p className="text-slate-600">
                        You are successfully authenticated. Manage your tasks and priorities efficiently with PrioriGrid.
                    </p>
                </div>
            </main>
        </div>
    )
}

export default DashboardScreen;