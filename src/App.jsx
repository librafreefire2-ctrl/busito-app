import { useState } from "react";

// ── DATOS ─────────────────────────────────────────────────────────────────────
const rutasIniciales = [
  { id: 1, nombre: "Ciudad → Playa", origen: "Ciudad", destino: "Playa", distancia: "45 km", duracion: "1h 20min", precio: 15.00, activa: true, color: "#0ea5e9" },
  { id: 2, nombre: "Centro → Aeropuerto", origen: "Centro", destino: "Aeropuerto", distancia: "30 km", duracion: "55 min", precio: 22.00, activa: true, color: "#8b5cf6" },
  { id: 3, nombre: "Mercado → Universidad", origen: "Mercado", destino: "Universidad", distancia: "12 km", duracion: "25 min", precio: 8.00, activa: true, color: "#10b981" },
  { id: 4, nombre: "Terminal → Chorrera", origen: "Terminal", destino: "Chorrera", distancia: "38 km", duracion: "1h 05min", precio: 18.00, activa: false, color: "#f59e0b" },
];

const reservasIniciales = [
  { id: 1, pasajero: "María López", cedula: "8-234-567", ruta: "Ciudad → Playa", fecha: "2026-02-20", hora: "08:00 AM", asiento: "A1", estado: "confirmada", monto: 15.00, pagado: true },
  { id: 2, pasajero: "Carlos Ruiz", cedula: "4-789-012", ruta: "Centro → Aeropuerto", fecha: "2026-02-20", hora: "10:30 AM", asiento: "B3", estado: "pendiente", monto: 22.00, pagado: false },
  { id: 3, pasajero: "Ana Torres", cedula: "6-112-334", ruta: "Mercado → Universidad", fecha: "2026-02-21", hora: "07:00 AM", asiento: "A2", estado: "confirmada", monto: 8.00, pagado: true },
  { id: 4, pasajero: "Pedro Gómez", cedula: "2-456-789", ruta: "Ciudad → Playa", fecha: "2026-02-21", hora: "08:00 AM", asiento: "C1", estado: "cancelada", monto: 15.00, pagado: false },
  { id: 5, pasajero: "Luisa Fernández", cedula: "9-321-654", ruta: "Terminal → Chorrera", fecha: "2026-02-22", hora: "06:00 AM", asiento: "A3", estado: "pendiente", monto: 18.00, pagado: false },
];

const ESTADO_CONFIG = {
  confirmada: { label: "Confirmada", bg: "#dcfce7", color: "#166534", dot: "#16a34a" },
  pendiente:  { label: "Pendiente",  bg: "#fef3c7", color: "#92400e", dot: "#d97706" },
  cancelada:  { label: "Cancelada",  bg: "#fee2e2", color: "#991b1b", dot: "#dc2626" },
};

const TABS = ["Inicio", "Reservas", "Rutas", "Facturación"];

// ── COMPONENTES ───────────────────────────────────────────────────────────────
const Pill = ({ estado }) => {
  const c = ESTADO_CONFIG[estado];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot }} />
      {c.label}
    </span>
  );
};

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function BusitoApp() {
  const [tab, setTab] = useState("Inicio");
  const [reservas, setReservas] = useState(reservasIniciales);
  const [rutas] = useState(rutasIniciales);
  const [showModal, setShowModal] = useState(false);
  const [showFactura, setShowFactura] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const [form, setForm] = useState({ pasajero: "", cedula: "", ruta: "", fecha: "", hora: "", asiento: "" });

  const confirmadas = reservas.filter(r => r.estado === "confirmada");
  const pendientes  = reservas.filter(r => r.estado === "pendiente");
  const totalCobrado = confirmadas.filter(r => r.pagado).reduce((a, b) => a + b.monto, 0);
  const porCobrar   = pendientes.reduce((a, b) => a + b.monto, 0);
  const reservasFiltradas = filtro === "todas" ? reservas : reservas.filter(r => r.estado === filtro);

  function agregarReserva() {
    if (!form.pasajero || !form.ruta || !form.fecha) return;
    const rutaInfo = rutas.find(r => r.nombre === form.ruta);
    setReservas([...reservas, {
      id: Date.now(), ...form, estado: "pendiente",
      monto: rutaInfo?.precio || 0, pagado: false,
    }]);
    setForm({ pasajero: "", cedula: "", ruta: "", fecha: "", hora: "", asiento: "" });
    setShowModal(false);
  }

  function cambiarEstado(id, estado) {
    setReservas(reservas.map(r => r.id === id ? { ...r, estado, pagado: estado === "confirmada" } : r));
  }

  function eliminarReserva(id) {
    setReservas(reservas.filter(r => r.id !== id));
  }

  function descargarPNG(r) {
    const canvas = document.createElement("canvas");
    const W = 600, H = 860;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");

    const estadoBg  = r.estado === "confirmada" ? "#dcfce7" : r.estado === "pendiente" ? "#fef3c7" : "#fee2e2";
    const estadoClr = r.estado === "confirmada" ? "#166534" : r.estado === "pendiente" ? "#92400e" : "#991b1b";

    // Fondo blanco
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Franja azul top
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, 6);

    // Icono bus (círculo azul)
    ctx.fillStyle = "#1e40af";
    ctx.beginPath();
    ctx.roundRect(W/2 - 36, 30, 72, 72, 16);
    ctx.fill();
    ctx.font = "38px serif";
    ctx.textAlign = "center";
    ctx.fillText("🚌", W/2, 85);

    // Empresa
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 26px 'Segoe UI', sans-serif";
    ctx.fillText("BusitoGest", W/2, 132);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 11px 'Segoe UI', sans-serif";
    ctx.fillText("COMPROBANTE OFICIAL DE RESERVACIÓN", W/2, 152);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "12px 'Segoe UI', sans-serif";
    ctx.fillText(`Nº ${String(r.id).padStart(6, "0")}`, W/2, 172);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px 'Segoe UI', sans-serif";
    ctx.fillText(`Emitido: ${new Date().toLocaleDateString("es-PA", { year:"numeric", month:"long", day:"numeric" })}`, W/2, 190);

    // Línea separadora
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(40, 208); ctx.lineTo(W-40, 208); ctx.stroke();

    // Cuerpo - fondo gris
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.roundRect(30, 220, W-60, 510, 12);
    ctx.fill();

    // Filas de datos
    const filas = [
      ["Pasajero",       r.pasajero],
      ["Cédula",         r.cedula || "—"],
      ["Ruta",           r.ruta],
      ["Fecha de viaje", r.fecha],
      ["Hora de salida", r.hora || "—"],
      ["Asiento",        r.asiento || "—"],
      ["Estado",         ESTADO_CONFIG[r.estado].label],
      ["Pago",           r.pagado ? "✅ Pagado" : "⏳ Pendiente"],
    ];

    filas.forEach(([clave, valor], i) => {
      const y = 258 + i * 52;

      // Línea separadora entre filas
      if (i > 0) {
        ctx.strokeStyle = "#f1f5f9";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(50, y - 10); ctx.lineTo(W-50, y - 10); ctx.stroke();
      }

      // Clave
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 12px 'Segoe UI', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(clave, 50, y + 8);

      // Badge para estado
      if (clave === "Estado") {
        ctx.fillStyle = estadoBg;
        ctx.beginPath();
        ctx.roundRect(W - 180, y - 6, 130, 24, 12);
        ctx.fill();
        ctx.fillStyle = estadoClr;
        ctx.font = "bold 11px 'Segoe UI', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(valor, W - 60, y + 10);
      } else {
        ctx.fillStyle = "#0f172a";
        ctx.font = "600 13px 'Segoe UI', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(valor, W - 50, y + 8);
      }
    });

    // Línea dashed total
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(50, 688); ctx.lineTo(W-50, 688); ctx.stroke();
    ctx.setLineDash([]);

    // Total
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 17px 'Segoe UI', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("TOTAL", 50, 726);

    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 32px 'Segoe UI', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`$${r.monto.toFixed(2)}`, W - 50, 730);

    // Pie
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "11px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Gracias por viajar con BusitoGest", W/2, 780);
    ctx.fillText("Conserve este comprobante durante su viaje", W/2, 798);

    // Franja azul bottom
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, H - 6, W, 6);

    // Descargar
    const link = document.createElement("a");
    link.download = `factura-busito-${String(r.id).padStart(6,"0")}-${r.pasajero.replace(/ /g,"-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  // Estilos base
  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb",
    background: "#f9fafb", color: "#111827", fontSize: 13, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12,
  };
  const lbl = { fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em", display: "block", marginBottom: 5 };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── HEADER ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 0 #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #0f172a, #1e40af)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚌</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", letterSpacing: "-0.5px" }}>BusitoGest</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em" }}>GESTIÓN DE TRANSPORTE</div>
          </div>
        </div>
        {/* Nav desktop */}
        <div style={{ display: "flex", gap: 2 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 13, fontFamily: "inherit",
              background: tab === t ? "#f1f5f9" : "transparent",
              color: tab === t ? "#0f172a" : "#64748b",
              transition: "all 0.15s"
            }}>{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {pendientes.length > 0 && (
            <div style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
              {pendientes.length} pendiente{pendientes.length > 1 ? "s" : ""}
            </div>
          )}
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #0f172a, #1e40af)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>AD</div>
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>

        {/* ══ INICIO ══ */}
        {tab === "Inicio" && (
          <div>
            {/* Bienvenida */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>Buenos días 👋</div>
              <div style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>Aquí tienes el resumen de operaciones de hoy</div>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Cobrado", value: `$${totalCobrado.toFixed(2)}`, sub: "pagos confirmados", icon: "💵", accent: "#10b981", light: "#f0fdf4" },
                { label: "Por Cobrar", value: `$${porCobrar.toFixed(2)}`, sub: "pendiente de pago", icon: "⏳", accent: "#f59e0b", light: "#fffbeb" },
                { label: "Reservas Hoy", value: reservas.filter(r => r.fecha === "2026-02-20").length, sub: "para hoy", icon: "🎫", accent: "#3b82f6", light: "#eff6ff" },
                { label: "Rutas Activas", value: rutas.filter(r => r.activa).length, sub: "en operación", icon: "🗺️", accent: "#8b5cf6", light: "#f5f3ff" },
              ].map(k => (
                <div key={k.label} style={{ background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: k.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{k.icon}</div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: k.accent, marginTop: 4 }} />
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>{k.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginTop: 2 }}>{k.label}</div>
                  <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 1 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
              {/* Últimas reservas */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Reservas Recientes</div>
                  <button onClick={() => setTab("Reservas")} style={{ background: "none", border: "none", color: "#3b82f6", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Ver todas →</button>
                </div>
                {reservas.slice(0, 4).map((r, i) => (
                  <div key={r.id} style={{ padding: "14px 20px", borderBottom: i < 3 ? "1px solid #f8fafc" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{r.pasajero}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{r.ruta} · {r.hora}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>${r.monto.toFixed(2)}</div>
                      <Pill estado={r.estado} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Rutas del día */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #f8fafc" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Rutas en Operación</div>
                </div>
                {rutas.filter(r => r.activa).map((r, i) => (
                  <div key={r.id} style={{ padding: "14px 20px", borderBottom: i < rutas.filter(x => x.activa).length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{r.nombre}</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: r.color }}>${r.precio.toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>📍 {r.distancia}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>⏱ {r.duracion}</span>
                      <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: r.color, display: "inline-block", alignSelf: "center" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ RESERVAS ══ */}
        {tab === "Reservas" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Reservaciones</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{reservas.length} registros en total</div>
              </div>
              <button onClick={() => setShowModal(true)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0f172a, #1e40af)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                + Nueva Reserva
              </button>
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[["todas","Todas"], ["confirmada","Confirmadas"], ["pendiente","Pendientes"], ["cancelada","Canceladas"]].map(([k, l]) => (
                <button key={k} onClick={() => setFiltro(k)} style={{ padding: "7px 16px", borderRadius: 8, border: `1.5px solid ${filtro === k ? "#0f172a" : "#e5e7eb"}`, background: filtro === k ? "#0f172a" : "#fff", color: filtro === k ? "#fff" : "#64748b", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
              ))}
            </div>

            {/* Tabla */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Pasajero", "Ruta", "Fecha & Hora", "Asiento", "Estado", "Monto", "Acciones"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", borderBottom: "1px solid #f1f5f9" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reservasFiltradas.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: i < reservasFiltradas.length - 1 ? "1px solid #f8fafc" : "none" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{r.pasajero}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{r.cedula}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569", fontWeight: 500 }}>{r.ruta}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{r.fecha}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.hora}</div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "#f1f5f9", color: "#475569", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{r.asiento}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}><Pill estado={r.estado} /></td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14, color: r.pagado ? "#10b981" : "#0f172a" }}>${r.monto.toFixed(2)}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {r.estado === "pendiente" && (
                            <button onClick={() => cambiarEstado(r.id, "confirmada")} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✓</button>
                          )}
                          <button onClick={() => setShowFactura(r)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "#eff6ff", color: "#1d4ed8", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>🧾</button>
                          <button onClick={() => eliminarReserva(r.id)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ RUTAS ══ */}
        {tab === "Rutas" && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Rutas de Transporte</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Rutas variables configuradas en el sistema</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {rutas.map(r => (
                <div key={r.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ height: 5, background: r.activa ? r.color : "#e5e7eb" }} />
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>{r.nombre}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                          <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{r.origen}</span>
                          <span>→</span>
                          <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{r.destino}</span>
                        </div>
                      </div>
                      <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: r.activa ? "#dcfce7" : "#f1f5f9", color: r.activa ? "#166534" : "#94a3b8" }}>
                        {r.activa ? "● Activa" : "○ Inactiva"}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      {[["Distancia", r.distancia], ["Duración", r.duracion], ["Precio", `$${r.precio.toFixed(2)}`]].map(([k, v]) => (
                        <div key={k} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{k.toUpperCase()}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: k === "Precio" ? r.color : "#0f172a", marginTop: 2 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                      <div style={{ flex: 1, background: "#f8fafc", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#64748b" }}>
                        🎫 {reservas.filter(res => res.ruta === r.nombre).length} reserva(s)
                      </div>
                      <div style={{ flex: 1, background: "#f8fafc", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#10b981", fontWeight: 600 }}>
                        💰 ${reservas.filter(res => res.ruta === r.nombre && res.pagado).reduce((a, b) => a + b.monto, 0).toFixed(2)} cobrado
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ FACTURACIÓN ══ */}
        {tab === "Facturación" && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Facturación</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Control de cobros y pagos</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { label: "Total Cobrado", value: `$${totalCobrado.toFixed(2)}`, color: "#10b981", bg: "#f0fdf4", icon: "✅" },
                { label: "Por Cobrar", value: `$${porCobrar.toFixed(2)}`, color: "#f59e0b", bg: "#fffbeb", icon: "⏳" },
                { label: "Total Facturado", value: `$${reservas.reduce((a, b) => a + b.monto, 0).toFixed(2)}`, color: "#3b82f6", bg: "#eff6ff", icon: "📊" },
              ].map(k => (
                <div key={k.label} style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f1f5f9", borderTop: `3px solid ${k.color}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{k.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginTop: 2 }}>{k.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f8fafc", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Historial de Pagos</div>
              {reservas.filter(r => r.estado !== "cancelada").map((r, i) => (
                <div key={r.id} onClick={() => setShowFactura(r)} style={{ padding: "14px 20px", borderBottom: i < reservas.filter(x => x.estado !== "cancelada").length - 1 ? "1px solid #f8fafc" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: r.pagado ? "#f0fdf4" : "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      {r.pagado ? "✅" : "⏳"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{r.pasajero}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.ruta} · {r.fecha}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: r.pagado ? "#10b981" : "#f59e0b" }}>${r.monto.toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.pagado ? "Pagado" : "Pendiente"} · Ver factura →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL NUEVA RESERVA ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", marginBottom: 4 }}>Nueva Reservación</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 22 }}>Completa los datos del pasajero</div>

            <label style={lbl}>NOMBRE DEL PASAJERO</label>
            <input style={inp} value={form.pasajero} onChange={e => setForm({ ...form, pasajero: e.target.value })} placeholder="Nombre completo" />

            <label style={lbl}>CÉDULA</label>
            <input style={inp} value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value })} placeholder="X-XXX-XXXX" />

            <label style={lbl}>RUTA</label>
            <select style={inp} value={form.ruta} onChange={e => setForm({ ...form, ruta: e.target.value })}>
              <option value="">Seleccionar ruta...</option>
              {rutas.filter(r => r.activa).map(r => <option key={r.id} value={r.nombre}>{r.nombre} — ${r.precio}</option>)}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={lbl}>FECHA</label>
                <input style={{ ...inp, marginBottom: 0 }} type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>HORA</label>
                <input style={{ ...inp, marginBottom: 0 }} type="time" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
              </div>
            </div>

            <div style={{ height: 12 }} />
            <label style={lbl}>ASIENTO</label>
            <input style={inp} value={form.asiento} onChange={e => setForm({ ...form, asiento: e.target.value })} placeholder="Ej: A1, B3" />

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#64748b", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
              <button onClick={agregarReserva} style={{ flex: 2, padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0f172a, #1e40af)", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>Crear Reservación</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL FACTURA ── */}
      {showFactura && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            {/* Header factura */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 50, height: 50, background: "linear-gradient(135deg, #0f172a, #1e40af)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 12px" }}>🚌</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>BusitoGest</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em" }}>COMPROBANTE DE RESERVACIÓN</div>
              <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 4 }}>#{String(showFactura.id).padStart(5, "0")}</div>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 20 }}>
              {[
                ["Pasajero", showFactura.pasajero],
                ["Cédula", showFactura.cedula],
                ["Ruta", showFactura.ruta],
                ["Fecha", showFactura.fecha],
                ["Hora", showFactura.hora],
                ["Asiento", showFactura.asiento],
                ["Estado", ESTADO_CONFIG[showFactura.estado].label],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: "#94a3b8", fontWeight: 500 }}>{k}</span>
                  <span style={{ color: "#0f172a", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: "2px dashed #e5e7eb", paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>TOTAL</span>
                <span style={{ fontWeight: 800, color: "#1e40af", fontSize: 20 }}>${showFactura.monto.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowFactura(null)} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#64748b", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cerrar</button>
              <button onClick={() => descargarPNG(showFactura)} style={{ flex: 2, padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0f172a, #1e40af)", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>⬇ Descargar PNG</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
