/* eslint-disable @typescript-eslint/no-explicit-any */
// https://developers.google.com/youtube/iframe_api_reference
"use client";

import ISubtitle from "@/interfaces/ISubtitle";
import DateUtils from "@/utils/DateUtils";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SubtitleEditor() {
  const [videoId, setVideoId] = useState("");
  const [inputVideoId, setInputVideoId] = useState("");
  const [subtitles, setSubtitles] = useState<ISubtitle[]>([]);

  const [currentTimePosition, setCurrentTimePosition] = useState<number>(0)
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState<number>(0)

  const [text, setText] = useState("");

  const playerRef = useRef<YT.Player>(null);

  const currentTimeListenerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize or reload the player
  useEffect(() => {
    if (!videoId) return;

    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
      return;
    }

    playerRef.current = new YT.Player("player", {
      height: "360",
      width: "640",
      videoId,
      events: {
        onReady: (e : YT.PlayerEvent) => e.target.playVideo(),
        // onStateChange: (e : YT.PlayerEvent) => console.log(e.target.getCurrentTime()),
      },
    });
  }, [videoId]);

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

  const srtTimeFormat = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds - Math.floor(seconds)) * 1000);
    return (
      String(h).padStart(2, "0") +
      ":" +
      String(m).padStart(2, "0") +
      ":" +
      String(s).padStart(2, "0") +
      "," +
      String(ms).padStart(3, "0")
    );
  };

  function exportSrt() {
    /*if (subtitles.length === 0) {
      alert("No subtitles to export!");
      return;
    }
    let srtContent = "";
    subtitles.forEach((sub, i) => {
      srtContent += i + 1 + "\n";
      srtContent +=
        srtTimeFormat(sub.start) + " --> " + srtTimeFormat(sub.end) + "\n";
      srtContent += sub.text + "\n\n";
    });
    const blob = new Blob([srtContent], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "subtitles.srt";
    a.click();
    URL.revokeObjectURL(a.href);*/
  };

  /*function handleGetVideoPosition(){
    if(playerRef.current) console.log(DateUtils.secondsToHms(playerRef.current?.getCurrentTime() ?? 0))
  }*/

  function handleAddSubtitle(e: React.FormEvent){
    e.preventDefault();

    if(!playerRef.current) return

    const newSub: ISubtitle = { start : playerRef.current.getCurrentTime(), text: text.trim() };

    const existingIndex = subtitles.findIndex(sub => sub.start == newSub.start)
    
    if(existingIndex == -1){

      return setSubtitles(subs => [...subs, newSub].sort((a, b) => a.start - b.start))
    }

    const newSubtitles = [...subtitles]
    newSubtitles[existingIndex] = newSub
    setSubtitles(newSubtitles)
  }

  const handleDeleteSubtitle = useCallback((idx: number) => {
    setSubtitles(prevSubs => prevSubs.filter((_, subIdx) => subIdx !== idx))
  }, [setSubtitles])

  useEffect(() => {
    currentTimeListenerRef.current = setInterval(() => {
      if(playerRef.current && playerRef.current.getCurrentTime() != currentTimePosition) {
        setCurrentTimePosition(playerRef.current.getCurrentTime())
        const activeIndex = findSubtitleIndex(subtitles, playerRef.current.getCurrentTime())
        console.log(activeIndex)
        if(activeIndex != activeSubtitleIndex) setActiveSubtitleIndex(activeIndex)
      }
    }, 1000)

    return () => {
      if(currentTimeListenerRef.current) clearInterval(currentTimeListenerRef.current)
    }
  }, [subtitles, playerRef, currentTimePosition, activeSubtitleIndex])

  function findSubtitleIndex(subtitles: ISubtitle[], T: number): number {
    let activeIndex = -1;
    for (let i = 0; i < subtitles.length; i++) {
      if (subtitles[i].start >= T) break
      activeIndex = i
    }
    return activeIndex
  }

  return (
    <div className="max-w-[1000px] flex flex-col" style={{ margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>YouTube Subtitle Editor</h1>
      <script src="https://www.youtube.com/iframe_api" async/>

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

      <table className="table-auto border-collapse border-none border-gray-300 w-full mt-[20px]">
        <thead>
          <tr className="border-b-1 border-gray-300 h-[40px] text-left [&>*]:px-[10px]">
            <th></th>
            <th>Id</th>
            <th>Time</th>
            <th className="w-full">Text</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {subtitles.map((sub, idx) => (
            <tr key={'row' + idx} className={idx % 2 == 1 ? "bg-gray-100 h-[40px] [&>*]:px-[10px]" : "h-[40px] [&>*]:px-[10px]"}>
              <td>{idx === activeSubtitleIndex ? '▶' : '-'}</td>
              <td>{idx}</td>
              <td>{DateUtils.secondsToHms(sub.start)}</td>
              <td className="text-left">{sub.text.slice(0, 20)}</td>
              <td>
                <button onClick={() => handleDeleteSubtitle(idx)}>delete</button>
              </td>
              <td>
                <button onClick={() => void 0}>move to</button>
              </td>
              <td>
                <button onClick={() => void 0}>edit text</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        onSubmit={handleAddSubtitle}
        className="mt-[15px] flex flex-col gap-[10px]"
      >
        <div className="flex flex-col">
          <label>Text to insert at current position</label>
          <textarea
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
