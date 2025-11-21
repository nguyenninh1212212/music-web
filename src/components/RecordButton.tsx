import { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";

export default function RecordButton({
  onStart,
  onStop,
}: {
  onStart: () => void;
  onStop: () => void;
}) {
  const [recording, setRecording] = useState(false);
  console.log("🚀 ~ RecordButton ~ recording:", recording);

  const handleClick = () => {
    if (!recording) {
      setRecording(true);
      onStart && onStart();
    } else {
      setRecording(false);
      onStop && onStop();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-full font-semibold 
        transition-all duration-200 shadow-md
        ${
          recording
            ? "bg-red-600 hover:bg-red-700 text-white scale-105"
            : "bg-[#00FF80] hover:bg-green-600 text-black hover:text-white  scale-100"
        }
      `}
    >
      {recording ? (
        <>
          <Square size={18} className="text-white" />
          Đang ghi âm...
        </>
      ) : (
        <>
          <Mic size={18} className="text-black" />
          Ghi âm
        </>
      )}
    </button>
  );
}
