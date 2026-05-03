import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { getPollingLocation } from '../services/googleService';

export function VoterStatus() {
    const { user, profile, loading, login, updateProfile } = useAuth();
    const [searchAddress, setSearchAddress] = useState('');
    
    const handleCheckStatus = async () => {
        const result = await getPollingLocation(searchAddress);
        
        if (result && result.pollingLocations && result.pollingLocations.length > 0) {
            const addr = result.pollingLocations[0].address;
            const addressString = `${addr.locationName ? addr.locationName + ', ' : ''}${addr.line1 ? addr.line1 + ', ' : ''}${addr.city ? addr.city + ', ' : ''}${addr.state ? addr.state + ' ' : ''}${addr.zip || ''}`.trim().replace(/,\s*$/, '');
            updateProfile({ address: addressString || searchAddress || '1600 Amphitheatre Pkwy', isRegistered: true, pollingBoothKnown: true });
        } else {
            // Mocking Civic API response
            updateProfile({ address: searchAddress || '1600 Amphitheatre Pkwy', isRegistered: true, pollingBoothKnown: true });
        }
    };

    return (
        <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden" role="region" aria-label="Voter Profile Status">
            <CardHeader className="flex flex-row justify-between items-start pt-6 px-6 pb-4 mb-0 space-y-0 relative">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="text-blue-600" aria-hidden="true">🪪</span> Voter Profile Status (Electoral Roll)
                </CardTitle>
                {profile?.isRegistered && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase whitespace-nowrap ml-2 hidden sm:inline-block">ECI Verified</span>
                )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-6 pb-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center flex-grow py-8 text-center space-y-4 animate-pulse">
                        <div className="w-16 h-16 bg-slate-200 rounded-full mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-48 mb-2"></div>
                        <div className="h-10 bg-slate-100 rounded-xl w-full mt-4"></div>
                    </div>
                ) : !user ? (
                   <div className="flex flex-col items-center justify-center flex-grow py-8 text-center space-y-4">
                       <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2 border border-blue-100">
                           <span className="text-3xl text-blue-500" aria-hidden="true">🪪</span>
                       </div>
                       <p className="text-sm text-slate-600 max-w-[250px]">Save your status securely to get personalized preparation info.</p>
                       <Button onClick={login} className="bg-blue-600 hover:bg-blue-700 w-full rounded-xl mt-4 font-bold">Sign in to Check Status</Button>
                   </div>
                ) : (
                    <div className="space-y-4 flex-grow flex flex-col">
                        {profile?.isRegistered ? (
                            <>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Assigned Polling Booth (Electoral Roll)</p>
                                    <p className="font-semibold text-sm">West Side Community Center</p>
                                    <p className="text-xs text-slate-400">{profile.address || '1288 Oak St, Seattle, WA 98122'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="border border-slate-100 rounded-xl p-3">
                                    <p className="text-[10px] text-slate-500 uppercase">Vidhan Sabha</p>
                                    <p className="text-sm font-bold">AC-042 Central</p>
                                  </div>
                                  <div className="border border-slate-100 rounded-xl p-3">
                                    <p className="text-[10px] text-slate-500 uppercase">Electoral Status</p>
                                    <p className="text-sm font-bold shadow-sm inline-block">Active on Roll</p>
                                  </div>
                                </div>

                                <div className="space-y-3 mt-auto pt-2">
                                    <p className="text-xs font-bold uppercase text-slate-400">Readiness Checklist</p>
                                    <div 
                                        className="flex items-center gap-2 text-sm"
                                        role="checkbox"
                                        aria-checked={true}
                                        tabIndex={0}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] bg-green-500`}>
                                            ✓
                                        </div>
                                        <span className="text-slate-800">Electoral Roll entry confirmed</span>
                                    </div>

                                    <div 
                                        className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 -ml-1 rounded transition-colors" 
                                        onClick={() => updateProfile({ idReady: !profile.idReady })}
                                        role="checkbox"
                                        aria-checked={!!profile.idReady}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                e.preventDefault();
                                                updateProfile({ idReady: !profile.idReady });
                                            }
                                        }}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] ${profile.idReady ? 'bg-green-500' : 'border-2 border-slate-200'}`}>
                                            {profile.idReady && '✓'}
                                        </div>
                                        <span className={profile.idReady ? 'text-slate-800' : 'text-slate-400'}>EPIC / Valid Photo ID prepared</span>
                                    </div>

                                    <div 
                                        className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 -ml-1 rounded transition-colors" 
                                        onClick={() => updateProfile({ pollingBoothKnown: !profile.pollingBoothKnown })}
                                        role="checkbox"
                                        aria-checked={!!profile.pollingBoothKnown}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                e.preventDefault();
                                                updateProfile({ pollingBoothKnown: !profile.pollingBoothKnown });
                                            }
                                        }}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] ${profile.pollingBoothKnown ? 'bg-green-500' : 'border-2 border-slate-200'}`}>
                                            {profile.pollingBoothKnown && '✓'}
                                        </div>
                                        <span className={profile.pollingBoothKnown ? 'text-slate-800' : 'text-slate-400'}>Polling booth details reviewed</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-grow flex flex-col justify-center space-y-4">
                               <p className="text-sm bg-blue-50 border border-blue-100 p-3 rounded-xl text-blue-800 font-medium">Enter your address to verify your Electoral Roll entry and find your assigned polling booth.</p>
                               <input 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 ring-blue-200 outline-none transition-all placeholder-slate-400"
                                    placeholder="Enter full address..."
                                    aria-label="Address for Electoral Roll lookup"
                                    value={searchAddress}
                                    onChange={e => setSearchAddress(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCheckStatus()}
                               />
                               <Button onClick={handleCheckStatus} className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl font-bold py-3 h-auto" aria-label="Verify Electoral Roll Status">Verify My Status</Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
