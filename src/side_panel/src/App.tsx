import { useState } from "react"
import Header from "@/components/Header";

export type PageList = "home" | "assignment" | "cyber-class" |"settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageList>("home");

  return (
    <div className="flex flex-col itmes-center h-screen bg-[#FAF0E6	]">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="font-bold text-2xl text-center">
        Hello World!
      </div>
    </div>
  )
}
