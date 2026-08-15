import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen min-h-dvh relative overflow-hidden bg-slate-100 selection:bg-primary-500 selection:text-white">
      {/* Background Image: Gedung Sate Login */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/backgrounds/gedung-sate-login.png')",
        }}
        aria-hidden="true"
      />

      {/* Tech Accent Labels */}
      <div className="absolute top-6 left-6 hidden lg:flex items-center gap-2 text-[10px] font-mono text-slate-500 select-none z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
        <span>SYS.JABARPROV.GO.ID</span>
      </div>

      <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-2 text-[10px] font-mono text-slate-500 select-none z-10">
        <span>LAT -6.9025° • LONG 107.6186°</span>
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  )
}



