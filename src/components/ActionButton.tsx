import Image from "next/image";
import { ReactNode } from "react";

export default function ActionButton({icon, onClick} : {icon : ReactNode, onClick : () => void}){
    return(
        <button onClick={onClick} className="w-[16px] h-[16px] cursor-pointer">
            {icon}
        </button>
    )
}