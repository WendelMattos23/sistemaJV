import { useState, useRef } from "react";
import TopTabs from "../components/TopTabs";
import "../styles/Devolucao.css";

interface DevolucaoProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Devolucao({ currentPage, setCurrentPage }: DevolucaoProps) {
  const [codigo, setCodigo] = useState("");
  const [lista, setLista] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  function adicionarCodigo(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim()) return;
    setLista((prev) => [...prev, codigo.trim()]);
    setCodigo("");
  }

  function removerCodigo(item: string) {
    setLista((prev) => prev.filter((c) => c !== item));
  }

  function imprimirSalvar() {
    if (lista.length === 0) {
      alert("Nenhum código para imprimir ou salvar.");
      return;
    }

    // 1️⃣ Impressão em preto e branco
    if (printRef.current) {
      const printWindow = window.open("", "PRINT", "height=700,width=900");
      if (printWindow) {
        printWindow.document.write("<html><head><title>Devolução</title>");
        printWindow.document.write("<style>");
        printWindow.document.write(`
          body {
            font-family: "Arial Black", Arial, sans-serif;
            background: #fff;
            color: #000;
            padding: 30px;
          }
          h1 {
            font-size: 32px;
            color: #000;
            margin-bottom: 20px;
          }
          .dev-card {
            background: #fff;
            padding: 20px;
            border-radius: 15px;
            border: 1px solid #000;
          }
          .dev-main-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
          }
          .dev-lista-container {
            flex: 1;
          }
          .dev-lista li {
            background: #fff;
            border: 1px solid #000;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            font-family: "Arial Black", Arial, sans-serif;
          }
          .right-side {
            width: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .contador {
            width: 110px;
            height: 110px;
            background: #000;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 16px;
            font-size: 50px;
            font-weight: 900;
          }
        `);
        printWindow.document.write("</style></head><body>");
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }

    // 2️⃣ Salvar arquivo .txt
    const conteudo = lista.join("\n");
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bipagem_devolucao.txt";
    link.click();

    // Limpa lista e input
    setLista([]);
    setCodigo("");

    alert("Arquivo salvo no computador!");
  }

  return (
    <div className="dev-container">
      <TopTabs currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <h1 className="dev-title">DEVOLUÇÃO</h1>

      <div className="dev-card">
        <form onSubmit={adicionarCodigo}>
          <label className="dev-label">BIPAR DEVOLUÇÃO</label>
          <input
            className="dev-input"
            type="text"
            autoFocus
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Aproxime o leitor..."
          />
        </form>

        <div className="dev-main-content">
          <div className="dev-lista-container">
            <ul className="dev-lista">
              {lista.length === 0 ? (
                <p className="dev-vazio">Nenhum código bipado...</p>
              ) : (
                lista.map((item) => (
                  <li key={item} className="dev-item">
                    {item}
                    <button
                      className="dev-lixeira"
                      onClick={() => removerCodigo(item)}
                      type="button"
                    >
                      🗑
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Botão imprimir e salvar */}
        <button className="dev-btn" onClick={imprimirSalvar}>
          IMPRIMIR E SALVAR ({lista.length})
        </button>

        {/* Área invisível para impressão */}
        <div style={{ display: "none" }}>
          <div ref={printRef}>
            <h1>DEVOLUÇÃO</h1>
            <div className="dev-card">
              <div className="dev-main-content">
                <div className="dev-lista-container">
                  <ul className="dev-lista">
                    {lista.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="right-side">
                  <div className="contador">{lista.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Contador fixo no lado direito da tela */}
      <div className="right-side">
        <div className="contador">{lista.length}</div>
        <p className="contador-label">PACOTES</p>
      </div>
    </div>
  );
}
