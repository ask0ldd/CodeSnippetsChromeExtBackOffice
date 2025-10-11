import ISubtitle from "@/interfaces/ISubtitle";
import { Dispatch, RefObject, SetStateAction } from "react";

export default function SubtitleEditor({text, setText, playerRef, subtitles, setSubtitles} : IProps){

    // !!! should deal with subtitle at the same time position
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

    return(
        <form
            onSubmit={handleAddSubtitle}
            className="mt-[15px] flex flex-col gap-[10px]"
        >
            <div className="flex flex-col">
            <textarea
                id="subtitleInput"
                placeholder="Text to insert at current position"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={15}
                className="flex min-h-[40px] border-1 border-gray-300 bg-gray-100 p-[10px] resize-none focus:outline-blue-400"
            />
            </div>
            <button className="bg-blue-400 px-[10px] py-[10px] font-semibold text-white rounded-[4px] cursor-pointer" type="submit">Add Subtitle</button>
        </form>
    )
}

interface IProps {
    text : string
    setText : Dispatch<SetStateAction<string>>
    subtitles : ISubtitle[]
    setSubtitles : Dispatch<SetStateAction<ISubtitle[]>>
    playerRef : RefObject<YT.Player | null>
}