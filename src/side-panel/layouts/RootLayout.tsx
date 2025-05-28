import { Outlet } from "react-router";
import Header from "@/side-panel/components/Header";

export default function RootLayout() {
  return (
    <div className="flex justify-center itmes-center w-full h-screen bg-gray-200">
      <div className="flex flex-col items-center h-screen w-full max-w-lg">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}