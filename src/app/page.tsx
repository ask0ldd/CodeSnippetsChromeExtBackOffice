/* eslint-disable @typescript-eslint/no-explicit-any */
// https://developers.google.com/youtube/iframe_api_reference
"use client";

import { useEffect, useRef, useState } from "react";

type Subtitle = {
  start: number;
  end: number;
  text: string;
};

export default function SubtitleEditor() {
  const [videoId, setVideoId] = useState("");
  const [inputVideoId, setInputVideoId] = useState("");
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [editIndex, setEditIndex] = useState<number>(-1);

  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [text, setText] = useState("");

  const playerRef = useRef<YT.Player>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start >= end) {
      alert("End time must be greater than start time");
      return;
    }

    const newSub: Subtitle = { start, end, text: text.trim() };
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
    setEnd(0);
    setText("");
  };

  const editSubtitle = (i: number) => {
    const s = subtitles[i];
    setStart(s.start);
    setEnd(s.end);
    setText(s.text);
    setEditIndex(i);
    window.scrollTo(0, 0);
  };

  const deleteSubtitle = (i: number) => {
    if (confirm("Delete this subtitle?")) {
      const updated = [...subtitles];
      updated.splice(i, 1);
      setSubtitles(updated);
      if (editIndex === i) {
        setEditIndex(-1);
        setStart(0);
        setEnd(0);
        setText("");
      }
    }
  };

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

  const exportSrt = () => {
    if (subtitles.length === 0) {
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
    URL.revokeObjectURL(a.href);
  };

  function handleGetVideoPosition(){
    console.log(secondsToHms(playerRef.current?.getCurrentTime() ?? 0))
  }

  function secondsToHms(seconds : number) {
    seconds = Math.floor(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  }

  return (
    <div style={{ maxWidth: 1440, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>YouTube Subtitle Editor</h1>
      <script src="https://www.youtube.com/iframe_api" async/>

      <label>
        YouTube Video ID:
        <input
          type="text"
          placeholder="e.g. dQw4w9WgXcQ"
          value={inputVideoId || "o6nimk_MqPM"}
          onChange={(e) => setInputVideoId(e.target.value)}
        />
      </label>
      <button onClick={() => setVideoId(inputVideoId.trim())}>Load Video</button>
      <button onClick={() => handleGetVideoPosition()}>Get Current Time</button>

      <div id="player" className="w-full h-[600px] mt-[10px]"/>

      <form
        onSubmit={handleSubmit}
        className="mt-[15px] flex gap-[10px] flex-wrap"
      >
        <label>
          Start (sec):
          <input
            type="number"
            step="0.1"
            min="0"
            value={start}
            onChange={(e) => setStart(parseFloat(e.target.value))}
            required
          />
        </label>
        <label>
          End (sec):
          <input
            type="number"
            step="0.1"
            min="0"
            value={end}
            onChange={(e) => setEnd(parseFloat(e.target.value))}
            required
          />
        </label>
        <textarea
          placeholder="Subtitle text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ flex: 1, resize: "vertical", minHeight: 40 }}
        />
        <button type="submit">Add / Update Subtitle</button>
      </form>

      <table
        style={{
          width: "100%",
          marginTop: 15,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Start</th>
            <th>End</th>
            <th>Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subtitles.map((s, i) => (
            <tr key={i} style={{ border: "1px solid #ddd" }} className="subtitle-row">
              <td>{i + 1}</td>
              <td>{s.start.toFixed(3)}</td>
              <td>{s.end.toFixed(3)}</td>
              <td>{s.text}</td>
              <td>
                <button type="button" onClick={() => editSubtitle(i)}>Edit</button>
                <button type="button" onClick={() => deleteSubtitle(i)}>Delete</button>
                <button type="button" onClick={() => jumpTo(s.start)}>Jump</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={exportSrt} style={{ marginTop: 10 }}>Export as SRT</button>
    </div>
  );
}
