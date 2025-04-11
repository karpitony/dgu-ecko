import { PageList } from "@/App";

interface HeaderProps {
  currentPage: PageList;
  setCurrentPage: (currentPage: PageList) => void;
}

export default function Header({
  currentPage,
  setCurrentPage
}: HeaderProps) {
  console.log(currentPage);
  
  return (
    <header className="flex flex-row justify-between items-center">
      <button onClick={() => setCurrentPage("home")}>
        <h1 className="text-2xl font-bold">🐘 이코</h1>
      </button>
      <nav className="flex flex-row gap-3 text-lg text-center">
          <li>
            <button onClick={() => setCurrentPage("assignment")}>
              과제
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentPage("cyber-class")}>
              싸강
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentPage("settings")}>
              설정
            </button>
          </li>
      </nav>
    </header>
  );
}