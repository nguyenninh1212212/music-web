import { useRef } from "react";
import RecordButton from "./RecordButton";
import { useMutation } from "@tanstack/react-query";
import searchApi from "@/api/search";
import { SongCard } from "./SongCard";

export default function AudioSearch() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      chunks.current = [];
      uploadAudio(blob);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const mutation = useMutation({
    mutationFn: async (audio: FormData) => {
      return await searchApi.getAudioSearch(audio);
    },
    onSuccess: (data) => {
      console.log("audio search : " + data.data.data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  console.log("🚀 ~ AudioSearch ~   mutation.data;:", mutation.data);

  const uploadAudio = async (blob: Blob) => {
    const form = new FormData();
    form.append("audioFile", blob, "recorded_audio.webm");
    mutation.mutate(form);
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-2 ">
      <RecordButton onStart={startRecording} onStop={stopRecording} />
      <div className="w-full flex flex-col gap-2 ">
        {mutation.data && <SongCard song={mutation.data.data} index={0} />}
      </div>
    </div>
  );
}
