import ISubtitle from "@/interfaces/ISubtitle"

function SubtitlesList({subtitles, handleDeleteSubtitle} : {subtitles : ISubtitle[], handleDeleteSubtitle(idx: number): void }){
    return(
        <div className="flex flex-col">
            <div><span>Id</span><span>Time</span><span>Text</span></div>
            {
            subtitles.map((sub, idx) => 
                <div key={'row'+idx} className="flex flex-row gap-x-2">
                <span>{idx}</span>
                <span>{sub.start}</span>
                <span>{sub.text.slice(0,20)}</span>
                <button onClick={() => handleDeleteSubtitle(idx)}>delete</button>
                </div>)
            }
        </div>
    )
}

export default SubtitlesList