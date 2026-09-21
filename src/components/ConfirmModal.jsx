function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm px-3 sm:px-4 py-4">

      <div className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xl animate-[pageEnter_0.25s_ease-out]">

        {/* Top Accent */}

        <div className="h-1 sm:h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500"></div>


        {/* Content */}

        <div className="p-5 sm:p-6 md:p-7">

          {/* Icon */}

          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 sm:mb-5">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0 3.75h.007v.008H12v-.008ZM10.34 3.94 2.7 17.06A1.75 1.75 0 0 0 4.22 19.7h15.56a1.75 1.75 0 0 0 1.52-2.64L13.66 3.94a1.91 1.91 0 0 0-3.32 0Z"
              />
            </svg>

          </div>


          {/* Title */}

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 break-words">
            {title}
          </h2>


          {/* Message */}

          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base leading-6 text-slate-500 break-words">
            {message}
          </p>

        </div>


        {/* Buttons */}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 bg-slate-50 border-t border-slate-100 px-5 sm:px-6 py-4">

          <button
            onClick={onCancel}
            className="btn w-full sm:w-auto min-h-11 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:border-slate-300"
          >
            {cancelText}
          </button>


          <button
            onClick={onConfirm}
            className="btn w-full sm:w-auto min-h-11 rounded-xl border-none bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5"
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;