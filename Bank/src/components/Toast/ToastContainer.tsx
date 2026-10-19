import { createContext, useContext, useState, useRef } from "react";
import "./styles.css";
import errorSound from '../../assets/error.mp3';
import successSound from '../../assets/success.mp3'

//TODO: for now keep isError, but change to a union of string states later
type Toast = {
  message: string;
  isError?: boolean;
};

type ToastContextValue = {
  showToastMessage: (message: string, isError?: boolean) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastContainer");
  }
  return context;
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  const successRef = useRef<HTMLAudioElement>(null);
  const errorRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null); // Reference for the Web Audio API Context

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast>({ message: "", isError: false });

  // Helper function to intercept the left-sided audio and force it to play in both ears
  const fixAudioChannels = (audioElement: HTMLAudioElement) => {
    // 1. Initialize AudioContext only after the user interacts with the app
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // 2. Prevent routing the exact same audio element multiple times
    if (!(audioElement as any)._isRouted) {
      const source = audioCtxRef.current.createMediaElementSource(audioElement);
      
      // Force it to mono so the left channel duplicates to the right speaker
      source.channelCount = 1;
      source.channelCountMode = "explicit";
      source.connect(audioCtxRef.current.destination);
      
      (audioElement as any)._isRouted = true;
    }

    // 3. Ensure the context is running (browsers suspend it before user interaction)
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // isError determines whether the Toast is styled like an error
  // or styled like a success message
  const showToastMessage = (message: string, isError: boolean = false) => {
    const audio = isError ? errorRef.current : successRef.current;
    
    if (audio) {
      fixAudioChannels(audio); 
      
      audio.volume = 0.15; 
      audio.currentTime = 0; 
      void audio.play().catch(() => {});
    }

    setToast({ message, isError });
    setShowToast(true);

    window.setTimeout(() => {
        setShowToast(false);
      }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToastMessage }}>
      {children}
      {/* crossOrigin="anonymous" is required when manipulating audio via the Web Audio API */}
      <audio ref={successRef} src={successSound} preload="auto" crossOrigin="anonymous" />
      <audio ref={errorRef} src={errorSound} preload="auto" crossOrigin="anonymous" />
      
      {showToast && (
        <div
          className={`toast ${toast.isError ? "toast--error" : "toast--success"}`}
          role={toast.isError ? "alert" : "status"}
          aria-atomic="true"
        >
          <div className="toast__icon-panel" aria-hidden="true">
            <svg className="toast__icon" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12.5" fill="currentColor" />
              {toast.isError ? (
                <>
                  <path d="M13 7.5v7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="13" cy="18.5" r="1" fill="white" />
                </>
              ) : (
                <path d="m7.5 13 3.5 3.5 7.5-7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>
          <p className="toast__message">{toast.message}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
}