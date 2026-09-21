function Loading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">

        <div className="relative">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="loading loading-spinner loading-md text-white"></span>
          </div>

          <div className="absolute -inset-2 rounded-2xl border border-blue-200 animate-pulse"></div>

        </div>

        <div className="text-center">

          <p className="text-sm font-semibold text-slate-700">
            Loading CityPulse
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Please wait a moment...
          </p>

        </div>

      </div>
    </div>
  );
}

export default Loading;