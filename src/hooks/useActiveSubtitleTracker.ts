import ISubtitle from "@/interfaces/ISubtitle"
import { RefObject, useEffect, useRef, useState } from "react"

function useActiveSubtitleTracker({subtitles, playerRef} : {subtitles : ISubtitle[], playerRef : RefObject<YT.Player | null>}){

    const [currentTimePosition, setCurrentTimePosition] = useState<number>(0)
    const [activeSubtitleIndex, setActiveSubtitleIndex] = useState<number>(0)
    const currentTimeListenerRef = useRef<NodeJS.Timeout | null>(null)

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

    return { activeSubtitleIndex, setActiveSubtitleIndex }
}

export default useActiveSubtitleTracker

function findSubtitleIndex(subtitles: ISubtitle[], T: number): number {
    let activeIndex = -1;
    for (let i = 0; i < subtitles.length; i++) {
        if (subtitles[i].start >= T) break
        activeIndex = i
    }
    return activeIndex
}