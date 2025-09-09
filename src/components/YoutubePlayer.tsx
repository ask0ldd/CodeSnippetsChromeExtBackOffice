import { RefObject, useEffect } from "react";

function YoutubePlayer({videoId, playerRef} : {videoId : string, playerRef : RefObject<YT.Player | null>}){

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
    
    return(<script src="https://www.youtube.com/iframe_api" async/>)
}

export default YoutubePlayer