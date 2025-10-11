/* eslint-disable @typescript-eslint/no-explicit-any */
// https://developers.google.com/youtube/iframe_api_reference
"use client";

import SubtitleEditor from "@/components/SubtitleEditor";
import SubtitlesList from "@/components/SubtitlesList";
import Timeline from "@/components/Timeline";
import YoutubePlayer from "@/components/YoutubePlayer";
import useActiveSubtitleTracker from "@/hooks/useActiveSubtitleTracker";
import ISubtitle from "@/interfaces/ISubtitle";
import { SetStateAction, useCallback, useRef, useState } from "react";

export default function Home() {
  const [videoId, setVideoId] = useState("");
  const [inputVideoId, setInputVideoId] = useState("");
  const [subtitles, setSubtitles] = useState<ISubtitle[]>([]);
  const [text, setText] = useState("");

  const playerRef = useRef<YT.Player>(null);

  const { activeSubtitleIndex, currentTimePosition } = useActiveSubtitleTracker({subtitles, playerRef})

  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start >= end) {
      alert("End time must be greater than start time");
      return;
    }

    const newSub: ISubtitle = { start, text: text.trim() };
    const updated = [...subtitles];

    if (editIndex >= 0) {
      updated[editIndex] = newSub;
      setEditIndex(-1);
    } else {
      updated.push(newSub);
    }

    updated.sort((a, b) => a.start - b.start);
    setSubtitles(updated);

    // reset form
    setStart(0);
    setText("");
  };*/

  /*const jumpTo = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
      playerRef.current.playVideo();
    }
  };*/

  function exportSrt() {
  };

  const handleDeleteSubtitle = useCallback((idx: number) => {
    setSubtitles(prevSubs => prevSubs.filter((_, subIdx) => subIdx !== idx))
  }, [setSubtitles])

  return (
    <div className="max-w-[1000px] flex flex-col" style={{ margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1 className="flex bg-gray-100 font-bold text-[24px] p-[10px] mb-[20px] justify-center border-1 border-gray-300">YouTube Subtitle Editor</h1>
      <YoutubePlayer videoId={videoId} playerRef={playerRef}/>

      <div className="flex flex-row gap-x-3 items-center">
        <label>
          Video to associate timed content to :
        </label>
        <input
          className="h-[40px] border-gray-300 bg-gray-100 border-[1px] px-[9px] py-[4px] rounded-[4px] focus:outline-blue-400"
          type="text"
          placeholder="e.g. dQw4w9WgXcQ"
          value={inputVideoId || "o6nimk_MqPM"}
          onChange={(e) => setInputVideoId(e.target.value)}
        />
        <button className="h-[40px] flex justify-center items-center bg-blue-400 px-[15px] font-semibold text-white rounded-[4px] cursor-pointer" onClick={() => setVideoId(inputVideoId.trim())}>Load Video</button>
      </div>

      <div id="player" className="w-full h-[600px] mt-[10px]"/>
      <Timeline currentTimePosition={currentTimePosition} subtitles={subtitles} playerRef={playerRef}/>

      <SubtitlesList subtitles={subtitles} activeSubtitleIndex={activeSubtitleIndex} handleDeleteSubtitle={handleDeleteSubtitle} />

      <SubtitleEditor subtitles={subtitles} text={text} setText={setText} setSubtitles={setSubtitles} playerRef={playerRef}/>

      <button onClick={exportSrt} className="h-[40px] flex justify-center items-center bg-green-300 px-[10px] text-white rounded-[4px] cursor-pointer mt-[10px] font-semibold">Export as SRT</button>
    </div>
  );
}
