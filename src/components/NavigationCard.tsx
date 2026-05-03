import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import { loadGoogleMaps } from '../services/googleService';

export function NavigationCard() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;
        
        async function initMap() {
            try {
                const { Map, Marker } = await loadGoogleMaps();
                
                if (mapRef.current) {
                    const position = { lat: 47.6062, lng: -122.3321 };
                    const mapInstance = new Map(mapRef.current, {
                        center: position,
                        zoom: 14,
                        disableDefaultUI: true,
                    });
                    
                    new Marker({
                        position,
                        map: mapInstance,
                        title: "Your Polling Station"
                    });
                    
                    if (isMounted) {
                        setMapLoaded(true);
                    }
                }
            } catch (_error) {
                // Maps SDK unavailable — graceful fallback to placeholder UI
            }
        }
        
        initMap();
        
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden" role="region" aria-label="Location Logistics">
            <CardHeader className="pt-6 px-6 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="text-orange-500" aria-hidden="true">📍</span> Booth Logistics & Traffic
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-6 pb-6">
                
                <div className="flex gap-3 sm:gap-4 flex-grow mb-4">
                  {/* Map Area */}
                  <div className="flex flex-col flex-grow min-w-0 gap-2">
                      <div className="flex-grow bg-slate-100 rounded-xl relative overflow-hidden border border-slate-200 flex items-center justify-center min-h-[140px]">
                         <div ref={mapRef} className="absolute inset-0 w-full h-full min-h-[140px]"></div>
                         
                         {!mapLoaded && (
                             <>
                                 <div className="absolute inset-0 z-0 bg-slate-200/50" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "12px 12px" }}>
                                 </div>
                                 
                                 {/* Overlay box matching design */}
                                 <div className="relative z-10 flex flex-col items-center text-center p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/60 w-[90%] max-w-[220px]">
                                   <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                                     <MapPin className="w-5 h-5" />
                                   </div>
                                   <p className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">MAP VIEW</p>
                                   <p className="text-xs font-semibold text-slate-700 leading-snug mb-3">Live map view available via Google Maps</p>
                                   <a 
                                       href="https://www.google.com/maps/search/?api=1&query=voting+locations+near+me" 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="px-4 py-2 w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors shadow-md text-center inline-flex items-center justify-center gap-1.5"
                                   >
                                       Open in maps <ArrowRight className="w-3 h-3" aria-hidden="true" />
                                   </a>
                                 </div>
                             </>
                         )}
                      </div>
                      
                      {mapLoaded && (
                          <a 
                               href="https://www.google.com/maps/search/?api=1&query=voting+locations+near+me" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="px-4 py-2 w-full shrink-0 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors shadow-md text-center inline-flex items-center justify-center gap-1.5"
                           >
                               Open in maps <ArrowRight className="w-3 h-3" aria-hidden="true" />
                           </a>
                      )}
                  </div>
                  
                  {/* Sidebar metrics */}
                  <div className="w-28 sm:w-32 flex flex-col gap-2 sm:gap-3 shrink-0">
                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex-1 flex flex-col justify-center">
                      <p className="text-[9px] uppercase font-bold text-orange-700">Wait Time</p>
                      <p className="text-sm font-black text-orange-900 leading-none mt-1">Quiet</p>
                      <div className="flex gap-0.5 mt-2 opacity-80">
                        <div className="h-1 flex-1 bg-orange-500 rounded-full"></div>
                        <div className="h-1 flex-1 bg-orange-500 rounded-full"></div>
                        <div className="h-1 flex-1 bg-orange-200 rounded-full"></div>
                        <div className="h-1 flex-1 bg-orange-200 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1 flex flex-col justify-center">
                      <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Access</p>
                      <ul className="text-[10px] font-medium text-slate-700 space-y-1">
                         <li>• PwD ramp entry</li>
                         <li>• BLO volunteers</li>
                         <li>• Parking 🅿️</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center shrink-0">
                    <div className="flex gap-1.5 flex-wrap items-center mr-2">
                        <span className="text-[10px] font-bold text-slate-400">REQUIRED:</span>
                        <span className="text-[10px] font-bold text-slate-600">EPIC card</span>
                        <span className="text-[10px] font-bold text-slate-600">Polling Slip</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
