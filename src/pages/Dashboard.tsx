// src/pages/Dashboard.tsx  (ou onde estiver)
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

interface Motorista {
  id: number;
  nome: string;
}

export default function Dashboard() {
  const empresas = ["AMAZON", "TOTALEXPRESS", "LOGGI", "IMILE"];

  // TIPOS CORRETOS
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [empresa, setEmpresa] = useState<string>("");
  const [motoristaId, setMotoristaId] = useState<string>("");
  const [codigo, setCodigo] = useState<string>("");
  const [lista, setLista] = useState<string[]>([]);
  const [manterEmpresa, setManterEmpresa] = useState<boolean>(false);
  const [manterMotorista, setManterMotorista] = useState<boolean>(false);

  // pré-carregamento de sons (isso roda no browser; se houver problema de caminho, verifique)
  const somOk = typeof Audio !== "undefined" ? new Audio("/sounds/ok.mp3") : null;
  const somErro = typeof Audio !== "undefined" ? new Audio("/sounds/erro.mp3") : null;

  // Buscar motoristas do backend
  useEffect(() => {
    async function loadMotoristas() {
      try {
        const res = await axios.get("https://motorista-backend.onrender.com/motoristas");
        setMotoristas(res.data);
      } catch (error) {
        console.log("Erro ao carregar motoristas");
      }
    }
  
    // Carrega imediatamente
    loadMotoristas();
  
    // Atualiza de 3 em 3 segundos
    const interval = setInterval(() => {
      loadMotoristas();
    }, 3000);
  
    // Quando sair da página, encerra o intervalo
    return () => clearInterval(interval);
  }, []);
  

  // Bipagem automática quando o código atinge um tamanho (ex.: >8)
  useEffect(() => {
    if (codigo.trim().length > 8) {
      adicionarCodigoAuto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  // Função de bipagem
  function adicionarCodigoAuto() {
    if (!empresa || !motoristaId) {
      if (somErro) somErro.play().catch(() => {});
      alert("Selecione a EMPRESA e o MOTORISTA antes de bipar.");
      setCodigo("");
      return;
    }

    const cod = codigo.trim();
    if (!cod) return;

    // atualiza lista de strings corretamente
    setLista((prev: string[]) => {
      return [...prev, cod];
    });

    setCodigo("");
    if (somOk) somOk.play().catch(() => {});
  }

  // Remover código
  function removerCodigo(item: string) {
    setLista((prev: string[]) => prev.filter((c) => c !== item));
  }

  // ENVIAR PACOTES PARA O MOTORISTA (BANCO)
  async function enviarParaMotorista() {
    if (!empresa || !motoristaId || lista.length === 0) {
      if (somErro) somErro.play().catch(() => {});
      alert("Preencha empresa, motorista e bipagem para enviar!");
      return;
    }

    try {
      // Recomendação: enviar em batch no futuro para eficiência.
      for (const cod of lista) {
        await axios.post("https://motorista-backend.onrender.com/pacote", {
          codigo: cod,
          motorista_id: Number(motoristaId), // backend espera number
          empresa: empresa,
        });
      }

      if (somOk) somOk.play().catch(() => {});
      alert("Pacotes enviados com sucesso!");

      setLista([]);
      if (!manterEmpresa) setEmpresa("");
      if (!manterMotorista) setMotoristaId("");
      setCodigo("");
    } catch (error) {
      console.error("Erro ao enviar pacotes:", error);
      if (somErro) somErro.play().catch(() => {});
      alert("Erro ao enviar pacotes.");
    }
  }

  return (
    <div className="dashboard-container">
      <h1 className="titulo">SISTEMA LOGÍSTICO</h1>

      <div className="panel">
        {/* LADO ESQUERDO */}
        <div className="left-side">
          <label className="label">EMPRESA</label>
          <select
            className="select"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          >
            <option value="">Selecione...</option>
            {empresas.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>

          <label className="label">MOTORISTA</label>
          <select
            className="select"
            value={motoristaId}
            onChange={(e) => setMotoristaId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {motoristas.map((mot) => (
              <option key={mot.id} value={String(mot.id)}>
                {mot.nome}
              </option>
            ))}
          </select>

          <div className="manter-box">
            <label>
              <input
                type="checkbox"
                checked={manterEmpresa}
                onChange={(e) => setManterEmpresa(e.target.checked)}
              />
              MANTER EMPRESA
            </label>

            <label>
              <input
                type="checkbox"
                checked={manterMotorista}
                onChange={(e) => setManterMotorista(e.target.checked)}
              />
              MANTER MOTORISTA
            </label>
          </div>

          <label className="label">BIPAR PACOTE</label>
          <input
            className="input-bip"
            type="text"
            autoFocus
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Aproxime o leitor..."
          />

          <div className="lista-container">
            <ul className="lista">
              {lista.length === 0 ? (
                <p className="vazio">Nenhum código bipado...</p>
              ) : (
                lista.map((item) => (
                  <li key={item} className="item">
                    {item}
                    <button
                      className="btn-lixeira"
                      onClick={() => removerCodigo(item)}
                    >
                      🗑
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <button className="btn-enviar" onClick={enviarParaMotorista}>
            ENVIAR PARA O MOTORISTA
          </button>
        </div>

        {/* LADO DIREITO – CONTADOR */}
        <div className="right-side">
          <div className="contador">
            <span>{lista.length}</span>
          </div>
          <p className="contador-label">PACOTES</p>
        </div>
      </div>
    </div>
  );
}
