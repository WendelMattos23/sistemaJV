import "../styles/TopTabs.css";

interface Props {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function TopTabs({ currentPage, setCurrentPage }: Props) {
  return (
    <div className="tabs-container">

      <button
        className={`tab-btn ${currentPage === "dashboard" ? "active" : ""}`}
        onClick={() => setCurrentPage("dashboard")}
      >
        BIPAGEM MOTORISTA
      </button>

      <button
        className={`tab-btn ${currentPage === "devolucao" ? "active" : ""}`}
        onClick={() => setCurrentPage("devolucao")}
      >
        DEVOLUÇÃO
      </button>

    </div>
  );
}
