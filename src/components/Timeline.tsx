import ISubtitle from "@/interfaces/ISubtitle"
import { RefObject } from "react"

export default function Timeline({subtitles, playerRef, currentTimePosition} : {subtitles : ISubtitle[], playerRef : RefObject<YT.Player | null>, currentTimePosition : number}){
    return(
        <div className="w-full h-[8px] max-w-[1000px] relative bg-gray-500 mt-2">
            {
                subtitles.map((sub, idx) => {
                    if(!playerRef.current) return
                    const tickPosition = Math.floor(sub.start / playerRef.current.getDuration() * 100)
                    console.log(tickPosition)
                    console.log('duration : ', playerRef.current.getDuration())
                    return(
                        <div key={'sub'+idx} 
                            style={{ left: `${tickPosition}%` }} 
                            className={`absolute w-[4px] h-full w bg-yellow-300 cursor-pointer`}
                            onClick={() => playerRef.current?.seekTo(sub.start, true)}
                        >
                        </div>
                    )
                })
            }
            {
                playerRef.current && <div style={{ left: `${currentTimePosition / playerRef.current.getDuration() * 100}%` }} className={`absolute w-[4px] h-full w bg-red-600`}></div>
            }
        </div>
    )
}