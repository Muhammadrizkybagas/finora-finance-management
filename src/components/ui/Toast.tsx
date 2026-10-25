"use client";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-lg border text-sm font-medium transition-all ${
        type === "success"
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-rose-50 border-rose-200 text-rose-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-xs opacity-70 hover:opacity-100 font-bold">
          ✕
        </button>
      </div>
    </div>
  );
}