import ISubtitle from "@/interfaces/ISubtitle"
import DateUtils from "@/utils/DateUtils"

function SubtitlesList({subtitles, activeSubtitleIndex, handleDeleteSubtitle} : {subtitles : ISubtitle[], activeSubtitleIndex : number, handleDeleteSubtitle(idx: number): void }){
    return(
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
    )
}

export default SubtitlesList