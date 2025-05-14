import { useState } from "react"
import Header from "@/components/Header";
import HomePage from "@/pages/HomePage";
import Assignment from "@/pages/Assignment";
import Vod from "@/pages/Vod";

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
