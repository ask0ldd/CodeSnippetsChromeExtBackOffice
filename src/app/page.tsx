/* eslint-disable @typescript-eslint/no-explicit-any */
// https://developers.google.com/youtube/iframe_api_reference
"use client";

import SubtitlesList from "@/components/SubtitlesList";
import YoutubePlayer from "@/components/YoutubePlayer";
import useActiveSubtitleTracker from "@/hooks/useActiveSubtitleTracker";
import ISubtitle from "@/interfaces/ISubtitle";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SubtitleEditor() {
  const [videoId, setVideoId] = useState("");
  const [inputVideoId, setInputVideoId] = useState("");
  const [subtitles, setSubtitles] = useState<ISubtitle[]>([]);
  const [text, setText] = useState("");

  const playerRef = useRef<YT.Player>(null);

  const { activeSubtitleIndex } = useActiveSubtitleTracker({subtitles, playerRef})

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

  const jumpTo = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
      playerRef.current.playVideo();
    }
  };

  function exportSrt() {
  };

  function handleAddSubtitle(e: React.FormEvent){
    e.preventDefault();

    if(!playerRef.current) return

    const newSub: ISubtitle = { start : playerRef.current.getCurrentTime(), text: text.trim() };

    const existingIndex = subtitles.findIndex(sub => sub.start == newSub.start)
    
    if(existingIndex == -1){

      setSubtitles(subs => [...subs, newSub].sort((a, b) => a.start - b.start))
      return setText("")
    }

    const newSubtitles = [...subtitles]
    newSubtitles[existingIndex] = newSub
    setSubtitles(newSubtitles)

  }

  const handleDeleteSubtitle = useCallback((idx: number) => {
    setSubtitles(prevSubs => prevSubs.filter((_, subIdx) => subIdx !== idx))
  }, [setSubtitles])

  return (
    <div className="max-w-[1000px] flex flex-col" style={{ margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>YouTube Subtitle Editor</h1>
      <YoutubePlayer videoId={videoId} playerRef={playerRef}/>

      <div className="flex flex-row gap-x-3 items-center">
        <label>
          Video to edit :
        </label>
        <input
          className="border-gray-300 bg-gray-100 border-[1px] px-[9px] py-[4px] rounded-[4px]"
          type="text"
          placeholder="e.g. dQw4w9WgXcQ"
          value={inputVideoId || "o6nimk_MqPM"}
          onChange={(e) => setInputVideoId(e.target.value)}
        />
        <button className="bg-blue-400 px-[10px] py-[5px] font-medium text-white rounded-[4px]" onClick={() => setVideoId(inputVideoId.trim())}>Load Video</button>
      </div>

      <div id="player" className="w-full h-[600px] mt-[10px]"/>

      <SubtitlesList subtitles={subtitles} activeSubtitleIndex={activeSubtitleIndex} handleDeleteSubtitle={handleDeleteSubtitle} />

      <form
        onSubmit={handleAddSubtitle}
        className="mt-[15px] flex flex-col gap-[10px]"
      >
        <div className="flex flex-col">
          <label>Text to insert at current position</label>
          <textarea
            id="subtitleInput"
            placeholder="Subtitle text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={15}
            className="flex min-h-[40px] border-1 border-gray-300 bg-gray-100 p-[10px] resize-none"
          />
        </div>
        <button type="submit">Add Subtitle</button>
      </form>

      <button onClick={exportSrt} style={{ marginTop: 10 }}>Export as SRT</button>
    </div>
  );
}
