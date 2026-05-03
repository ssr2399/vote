import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { memo } from 'react';

const TIMELINE_STEPS = [
    { title: "Electoral Roll Freeze (ECI)", date: "Oct 15, 2024", completed: true },
    { title: "Advance / Postal Ballot Window", date: "Oct 20 - Nov 2", active: true },
    { title: "General Election Day", date: "Nov 5, 2024", pending: true },
];

export const Timeline = memo(function Timeline() {
    
    const nextEvent = "Election Day";
    const nextEventDate = new Date("2024-11-05T08:00:00Z");
    const endDate = new Date("2024-11-05T20:00:00Z");
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(nextEvent)}&dates=${nextEventDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${endDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent("Event scheduled via V-O-T-E")}`;

    const rawDaysLeft = Math.ceil((nextEventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, rawDaysLeft);

    return (
        <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden" role="region" aria-label="Election Timeline">
            <CardHeader className="flex flex-row justify-between items-center pt-6 px-6 pb-6 mb-0 space-y-0">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="text-emerald-600" aria-hidden="true">📅</span> ECI Election Journey
                </CardTitle>
                <div className="text-right ml-2">
                  {rawDaysLeft < 0 ? (
                      <>
                          <p className="text-sm font-black text-emerald-600 leading-none">COMPLETED</p>
                      </>
                  ) : daysLeft === 0 ? (
                      <>
                          <p className="text-sm font-black text-emerald-600 leading-none">TODAY</p>
                      </>
                  ) : (
                      <>
                          <p className="text-2xl font-black text-emerald-600 leading-none">{daysLeft}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mt-1 whitespace-nowrap">Days Left</p>
                      </>
                  )}
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-6 pb-6 justify-between">
                
                <div className="relative flex-grow flex flex-col justify-between py-2 mb-6" role="list">
                    <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10"></div>
                    
                    {TIMELINE_STEPS.map((step, i) => (
                        <div key={i} className="relative pl-8 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 group" role="listitem" aria-label={`${step.title} - ${step.completed ? 'Completed' : step.active ? 'Active Now' : 'Upcoming'}`}>
                          <div className={`absolute left-0 top-3.5 sm:top-1/2 sm:-translate-y-1/2 w-6 h-6 rounded-full border-4 border-white shadow-sm ring-4 ring-white ${step.completed ? 'bg-emerald-500' : step.active ? 'bg-emerald-500 ring-emerald-50' : 'bg-slate-200 ring-slate-50'}`}></div>
                          <div className="flex-grow">
                            <p className="text-xs text-slate-400 font-medium">{step.date}</p>
                            <p className={`text-sm font-bold ${step.active ? 'text-slate-900' : 'text-slate-800'}`}>{step.title}</p>
                          </div>
                          <span className={`sm:ml-auto w-fit text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${step.completed ? 'text-emerald-600 bg-emerald-50' : step.active ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-50 border border-slate-100'}`}>
                              {step.completed ? 'COMPLETED' : step.active ? 'ACTIVE NOW' : 'UPCOMING'}
                          </span>
                        </div>
                    ))}
                </div>

                <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-100 transition-all mt-auto shrink-0" aria-label="Sync ECI Election Dates to Google Calendar">
                  Sync to Google Calendar
                </a>

            </CardContent>
        </Card>
    )
});
