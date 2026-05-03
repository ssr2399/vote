import { VoterStatus } from './components/VoterStatus';
import { Timeline } from './components/Timeline';
import { TutorialAssistant } from './components/TutorialAssistant';
import { NavigationCard } from './components/NavigationCard';
import { useAuth } from './hooks/useAuth';

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const { user } = useAuth();
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-100 flex flex-col p-4 md:p-6 font-sans text-slate-800 overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white border-2 border-transparent focus:border-white">Skip to main content</a>
      <div className="w-full max-w-5xl mx-auto flex flex-col flex-grow">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-700 text-white w-12 h-12 flex items-center justify-center rounded-lg font-black text-2xl shadow-lg">V</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">V-O-T-E</h1>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                Voter Outreach & Timely Engagement
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">{user.displayName || 'Voter'}</p>
                  <p className="text-xs text-slate-500">Enrolled • Vidhan Sabha AC-042</p>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white shadow-sm"></div>
                )}
              </>
            ) : (
               <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">Sign in</p>
                  <p className="text-xs text-slate-500">To view your status</p>
               </div>
            )}
            {!user && (
              <img 
                src="https://api.dicebear.com/7.x/bottts/svg?seed=vote&backgroundColor=e2e8f0" 
                alt="Robot" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
              />
            )}
          </div>
        </header>

        {/* Main 2x2 Grid */}
        <main id="main-content" className="grid grid-cols-1 md:grid-cols-2 grid-rows-1 md:grid-rows-2 gap-6 flex-grow">
            {/* Block 1: Voter Status */}
            <VoterStatus />

            {/* Block 2: Timeline */}
            <Timeline />

            {/* Block 3: Tutorial Assist */}
            <TutorialAssistant />

            {/* Block 4: Where & How to Vote */}
            <NavigationCard />
        </main>
        
        {/* Footer Bar */}
        <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center px-2 gap-4">
          <p className="text-[10px] text-slate-400 font-medium tracking-widest text-center sm:text-left">
            SECURE CONNECTIVITY VIA FIREBASE AUTH • ECI CIVIC INFORMATION API V2
          </p>
          <div className="flex gap-4">
            <button type="button" aria-label="Support" className="text-[10px] text-slate-500 font-bold uppercase hover:text-slate-700">Support</button>
            <button type="button" aria-label="Official Website" className="text-[10px] text-slate-500 font-bold uppercase hover:text-slate-700">Official Website</button>
            <button type="button" aria-label="Accessibility" className="text-[10px] text-slate-500 font-bold uppercase hover:text-slate-700">Accessibility</button>
          </div>
        </footer>

      </div>
    </div>
    </ErrorBoundary>
  );
}
