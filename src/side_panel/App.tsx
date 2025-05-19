import { useState } from "react"
import Header from "@/side_panel/components/Header";
import HomePage from "@/side_panel/pages/HomePage";
import Assignment from "@/side_panel/pages/Assignment";
import Vod from "@/side_panel/pages/Vod";

export type PageList = "home" | "assignment" | "vod" |"settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageList>("home");

  return (
    <div className="flex justify-center itmes-center w-full h-screen bg-gray-200">
      <div className="flex flex-col items-center h-screen w-full max-w-lg">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {currentPage === "home" && <HomePage setCurrentPage={setCurrentPage}/>}
        {currentPage === "assignment" && <Assignment />}
        {currentPage === "vod" && <Vod />}
      </div>
    </div>
  )
}
