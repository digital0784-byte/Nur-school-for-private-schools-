import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Bus,
  MapPin,
  Phone,
  Navigation,
  Clock,
  Shield,
  Users,
  Radio,
  Play,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { BusRoute } from "../../types";

export const TransportBusTracking: React.FC = () => {
  const { busRoutes, setBusRoutes, language, t, showToast } = useApp();

  const [selectedRouteId, setSelectedRouteId] = useState<string>(busRoutes[0]?.id || "");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const selectedRoute = busRoutes.find((r) => r.id === selectedRouteId) || busRoutes[0];

  // Simulation effect to move bus along latitude/longitude slightly and update speed/ETA
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setBusRoutes((prev) =>
          prev.map((r) => {
            const nextLat = r.currentLocation.latitude + (Math.random() - 0.49) * 0.0008;
            const nextLng = r.currentLocation.longitude + (Math.random() - 0.49) * 0.0008;
            const nextSpeed = Math.floor(25 + Math.random() * 20);
            return {
              ...r,
              currentLocation: {
                ...r.currentLocation,
                latitude: Number(nextLat.toFixed(5)),
                longitude: Number(nextLng.toFixed(5)),
                speed: nextSpeed,
              },
            };
          })
        );
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSimulating, setBusRoutes]);

  const toggleSimulation = () => {
    const nextState = !isSimulating;
    setIsSimulating(nextState);
    if (nextState) {
      showToast(
        language === "am"
          ? "የቀጥታ ጂፒኤስ የጉዞ እንቅስቃሴ ተጀምሯል"
          : "Live GPS telematics simulation activated",
        "info"
      );
    }
  };

  const handleNotifyParents = () => {
    showToast(
      language === "am"
        ? `ለ${selectedRoute?.routeName} ተማሪዎች ወላጆች አውቶቡሱ 500 ሜትር እንደቀረው መልእክት ተልኳል!`
        : `Proximity arrival SMS dispatched to all parents on ${selectedRoute?.routeName}!`,
      "success"
    );
  };

  return (
    <div id="transport-bus-tracking" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.transport.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === "am"
              ? "የተማሪዎች አውቶቡሶች የቀጥታ ጂፒኤስ እንቅስቃሴ፣ ፍጥነት እና የማቆሚያ መረጃ"
              : "Real-time autonomous GPS fleet telemetry, speed telemetry, and arrival notifications"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isSimulating
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
            }`}
          >
            {isSimulating ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>
              {isSimulating
                ? language === "am"
                  ? "እንቅስቃሴ አቁም"
                  : "Pause Telematics"
                : language === "am"
                ? "የቀጥታ ጉዞ ጀምር"
                : "Simulate Live Fleet"}
            </span>
          </button>

          <button
            onClick={handleNotifyParents}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700"
          >
            <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === "am" ? "ለወላጆች መልእክት ላክ" : "Broadcast Arrival SMS"}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Routes selection & Driver Card */}
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {language === "am" ? "የትራንስፖርት መስመሮች" : "School Bus Routes"}
            </h3>

            <div className="space-y-2">
              {busRoutes.map((route) => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20"
                        : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-xl font-black text-xs ${
                            isSelected
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <Bus className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {route.routeNumber}
                          </span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {language === "am" ? route.routeNameAm : route.routeName}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          route.currentLocation.status === "On Route"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {route.currentLocation.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>
                        Next: <strong className="text-slate-700 dark:text-slate-200">{route.currentLocation.nextStop}</strong>
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {route.currentLocation.speed} km/h • ETA {route.currentLocation.etaMinutes}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Route Driver Card */}
          {selectedRoute && (
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {language === "am" ? "የሾፌር እና አስተባባሪ መረጃ" : "Assigned Driver & Logistics"}
              </h4>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {selectedRoute.driverName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedRoute.driverName}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Plate: {selectedRoute.vehiclePlate}
                  </p>
                </div>
                <a
                  href={`tel:${selectedRoute.driverPhone}`}
                  className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:scale-105 transition-transform"
                  title="Call Driver"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Capacity</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedRoute.assignedStudentsCount} / {selectedRoute.capacity} Seats
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Coordinates</span>
                  <span className="font-mono text-[11px] font-semibold text-slate-900 dark:text-white truncate block">
                    {selectedRoute.currentLocation.latitude}, {selectedRoute.currentLocation.longitude}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 cols: Simulated Interactive GPS Map Canvas */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {language === "am" ? "የአዲስ አበባ የቀጥታ ጂፒኤስ ካርታ" : "Addis Ababa Telematics Radar"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live transit radar centered on Bole, CMC, Sarbet, and Kazanchis corridors
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  LIVE GPS FEED
                </span>
              </div>
            </div>

            {/* Simulated Vector / SVG GPS Canvas */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Radar Grid Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Concentric distance radar rings */}
                <circle cx="50%" cy="50%" r="90" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="50%" cy="50%" r="160" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

              {/* School Main Campus Beacon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider bg-slate-900/80 px-2 py-0.5 rounded-md border border-emerald-500/40 mt-1 inline-block">
                  NUR SCHOOL CAMPUS
                </span>
              </div>

              {/* Render Bus Markers on Radar Canvas */}
              {busRoutes.map((bus, idx) => {
                // Fixed aesthetic offsets around center for visualization
                const offsets = [
                  { top: "35%", left: "68%" },
                  { top: "65%", left: "30%" },
                  { top: "25%", left: "32%" },
                  { top: "72%", left: "65%" },
                ];
                const pos = offsets[idx % offsets.length];
                const isSelected = bus.id === selectedRouteId;

                return (
                  <div
                    key={bus.id}
                    onClick={() => setSelectedRouteId(bus.id)}
                    className="absolute cursor-pointer group transition-all duration-700"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div
                      className={`relative p-2 rounded-2xl flex items-center gap-1.5 shadow-lg transition-transform group-hover:scale-110 ${
                        isSelected
                          ? "bg-emerald-500 text-white ring-4 ring-emerald-500/30"
                          : "bg-slate-800 text-slate-200 border border-slate-700"
                      }`}
                    >
                      <Bus className="w-4 h-4" />
                      <span className="text-[11px] font-black">{bus.routeNumber}</span>
                    </div>

                    {/* Tooltip on hover/active */}
                    <div
                      className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-900/90 text-emerald-300 border border-slate-700 pointer-events-none ${
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      } transition-opacity`}
                    >
                      {bus.currentLocation.speed} km/h • {bus.currentLocation.nextStop}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Route Stops Roadmap */}
          {selectedRoute && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                {language === "am" ? "የመስመሩ ማቆሚያዎች (Stops)" : "Route Stoppage Trajectory"}
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {selectedRoute.stops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 shrink-0 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {stop}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
