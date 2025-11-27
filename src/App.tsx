import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Devolucao from "./pages/Devolucao";
import TopTabs from "./components/TopTabs";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <>
      <TopTabs currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "dashboard" && (
        <Dashboard currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}

      {currentPage === "devolucao" && (
        <Devolucao currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
    </>
  );
}
