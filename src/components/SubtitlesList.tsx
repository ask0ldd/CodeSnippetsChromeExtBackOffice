import ISubtitle from "@/interfaces/ISubtitle"
import DateUtils from "@/utils/DateUtils"
import ActionButton from "./ActionButton"
import Image from "next/image"

function SubtitlesList({subtitles, activeSubtitleIndex, handleDeleteSubtitle} : {subtitles : ISubtitle[], activeSubtitleIndex : number, handleDeleteSubtitle(idx: number): void }){
    return(
        <table className="table-auto border-collapse border-none border-gray-300 bg-gray-100 w-full mt-[20px] text-[14px]">
            <thead>
                <tr className="border-b-1 border-gray-300 h-[30px] text-left [&>*]:px-[10px]">
                    <th></th>
                    <th>ID</th>
                    <th>TIME</th>
                    <th className="w-full">TEXT</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {subtitles.map((sub, idx) => (
                    <tr key={'row' + idx} className={idx % 2 == 1 ? "bg-gray-200 h-[30px] [&>*]:px-[10px]" : "h-[30px] [&>*]:px-[10px]"}>
                        <td>{idx === activeSubtitleIndex ? '▶' : '-'}</td>
                        <td>{idx}</td>
                        <td>{DateUtils.secondsToHms(sub.start)}</td>
                        <td className="text-left">{sub.text.slice(0, 20)}</td>
                        <td className="h-[30px]">
                            <div className="flex justify-center items-center h-full">
                                <ActionButton icon={<Image alt="edit icon" src="/edit.svg" width={14} height={14}/>} onClick={() => void 0}/>
                            </div>
                        </td>
                        <td className="h-[30px]">
                            <div className="flex justify-center items-center h-full">
                                <ActionButton icon={<Image alt="delete icon" src="/del.svg" width={14} height={14}/>} onClick={() => handleDeleteSubtitle(idx)}/>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default SubtitlesList