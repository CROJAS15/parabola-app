import React, { useState } from "react";

export default function App() {
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);
  const [p, setP] = useState(3);
  const [orientacion, setOrientacion] = useState("vertical");

  const [mostrarLadoRecto, setMostrarLadoRecto] = useState(true);
  const [mostrarVertice, setMostrarVertice] = useState(true);
  const [mostrarParametro, setMostrarParametro] = useState(true);
  const [mostrarDirectriz, setMostrarDirectriz] = useState(true);
  const [mostrarFoco, setMostrarFoco] = useState(true);
  const [mostrarSimetria, setMostrarSimetria] = useState(true);
  const [mostrarSegmentos, setMostrarSegmentos] = useState(true);

  const [scale, setScale] = useState(20);
  const [controlPunto, setControlPunto] = useState(4);

  const esVertical = orientacion === "vertical";
  const binomio = (variable, valor) =>
    valor < 0 ? `${variable} + ${Math.abs(valor)}` : `${variable} - ${valor}`;

  const size = 470;
  const origen = size / 2;

  const toSVGX = (x) => origen + x * scale;
  const toSVGY = (y) => origen - y * scale;

  const foco = esVertical
    ? { x: h, y: k + p }
    : { x: h + p, y: k };

  const directriz = esVertical ? k - p : h - p;

  const puntoParabola = esVertical
    ? {
        x: controlPunto,
        y: ((controlPunto - h) ** 2) / (4 * p) + k,
      }
    : {
        x: ((controlPunto - k) ** 2) / (4 * p) + h,
        y: controlPunto,
      };

  const puntoDirectriz = esVertical
    ? { x: puntoParabola.x, y: directriz }
    : { x: directriz, y: puntoParabola.y };

  const distanciaFoco = Math.sqrt(
    (puntoParabola.x - foco.x) ** 2 +
      (puntoParabola.y - foco.y) ** 2
  ).toFixed(2);

  const distanciaDirectriz = esVertical
    ? Math.abs(puntoParabola.y - directriz).toFixed(2)
    : Math.abs(puntoParabola.x - directriz).toFixed(2);

  const ladoRectoA = esVertical
    ? { x: h - 2 * p, y: k + p }
    : { x: h + p, y: k - 2 * p };

  const ladoRectoB = esVertical
    ? { x: h + 2 * p, y: k + p }
    : { x: h + p, y: k + 2 * p };

  const longitudLadoRecto = 4 * p;
  const valorAbsolutoP = Math.abs(p);

  let curva = "";
  let first = true;

  for (let t = -20; t <= 20; t += 0.05) {
    const punto = esVertical
      ? {
          x: t,
          y: ((t - h) ** 2) / (4 * p) + k,
        }
      : {
          x: ((t - k) ** 2) / (4 * p) + h,
          y: t,
        };

    const svgX = toSVGX(punto.x);
    const svgY = toSVGY(punto.y);

    curva += first ? `M ${svgX} ${svgY}` : ` L ${svgX} ${svgY}`;
    first = false;
  }

  const gridLines = [];
  const axisLabels = [];

  for (let x = -20; x <= 20; x++) {
    const svgX = toSVGX(x);

    gridLines.push(
      <line
        key={`vx-${x}`}
        x1={svgX}
        y1={0}
        x2={svgX}
        y2={size}
        stroke="#1d1d1d"
        strokeWidth="1"
      />
    );

    if (x !== 0) {
      axisLabels.push(
        <text
          key={`xlabel-${x}`}
          x={svgX - 4}
          y={origen + 15}
          fill="#888"
          fontSize="9"
        >
          {x}
        </text>
      );
    }
  }

  for (let y = -20; y <= 20; y++) {
    const svgY = toSVGY(y);

    gridLines.push(
      <line
        key={`hy-${y}`}
        x1={0}
        y1={svgY}
        x2={size}
        y2={svgY}
        stroke="#1d1d1d"
        strokeWidth="1"
      />
    );

    if (y !== 0) {
      axisLabels.push(
        <text
          key={`ylabel-${y}`}
          x={origen + 6}
          y={svgY + 4}
          fill="#888"
          fontSize="9"
        >
          {y}
        </text>
      );
    }
  }

  const panelStyle = {
    backgroundColor: "#111",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "12px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "8px",
    backgroundColor: "#151515",
    color: "white",
    border: "1px solid #444",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const columnStyle = {
    width: "280px",
    maxHeight: "calc(100dvh - 58px)",
    overflowY: "auto",
    paddingRight: "2px",
  };

  return (
    <>
      <style>
        {`
          html,
          body,
          #root {
            width: 100%;
            height: 100%;
            margin: 0;
            overflow: hidden;
          }

          * {
            box-sizing: border-box;
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#000",
          color: "white",
          padding: "8px",
          fontFamily: "Arial, sans-serif",
          overflow: "hidden",
        }}
      >
      <h1
        style={{
          textAlign: "center",
          color: "#00FFFF",
          fontSize: "22px",
          margin: "0 0 2px",
          letterSpacing: "1px",
        }}
      >
        PARABOLA INTERACTIVA
      </h1>

      <div
        style={{
          textAlign: "center",
          fontSize: "18px",
          color: "#66FF33",
          marginBottom: "6px",
          fontWeight: "bold",
        }}
      >
        {esVertical ? (
          <>
            ({binomio("x", h)})<sup>2</sup> = {4 * p}(
            {binomio("y", k)})
          </>
        ) : (
          <>
            ({binomio("y", k)})<sup>2</sup> = {4 * p}(
            {binomio("x", h)})
          </>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "12px",
          height: "calc(100dvh - 58px)",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{
              backgroundColor: "#050505",
              border: "2px solid white",
              borderRadius: "8px",
              width: "min(68vw, calc(100dvh - 102px), 470px)",
              height: "min(68vw, calc(100dvh - 102px), 470px)",
              display: "block",
            }}
          >
            {gridLines}
            {axisLabels}

            <line
              x1={0}
              y1={origen}
              x2={size}
              y2={origen}
              stroke="white"
              strokeWidth="2"
            />

            <line
              x1={origen}
              y1={0}
              x2={origen}
              y2={size}
              stroke="white"
              strokeWidth="2"
            />

            <text x={size - 18} y={origen - 8} fill="white" fontSize="14">
              x
            </text>

            <text x={origen + 8} y={18} fill="white" fontSize="14">
              y
            </text>

            {mostrarDirectriz &&
              (esVertical ? (
                <>
                  <line
                    x1={0}
                    y1={toSVGY(directriz)}
                    x2={size}
                    y2={toSVGY(directriz)}
                    stroke="#66FF33"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                  <text
                    x={15}
                    y={toSVGY(directriz) - 8}
                    fill="#66FF33"
                    fontSize="12"
                  >
                    Directriz: y = {directriz}
                  </text>
                </>
              ) : (
                <>
                  <line
                    x1={toSVGX(directriz)}
                    y1={0}
                    x2={toSVGX(directriz)}
                    y2={size}
                    stroke="#66FF33"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                  <text
                    x={toSVGX(directriz) + 8}
                    y={25}
                    fill="#66FF33"
                    fontSize="12"
                  >
                    Directriz: x = {directriz}
                  </text>
                </>
              ))}

            {mostrarSimetria &&
              (esVertical ? (
                <>
                  <line
                    x1={toSVGX(h)}
                    y1={0}
                    x2={toSVGX(h)}
                    y2={size}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                  <text
                    x={toSVGX(h) + 8}
                    y={20}
                    fill="white"
                    fontSize="12"
                  >
                    Eje de simetria: x = {h}
                  </text>
                </>
              ) : (
                <>
                  <line
                    x1={0}
                    y1={toSVGY(k)}
                    x2={size}
                    y2={toSVGY(k)}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                  <text
                    x={20}
                    y={toSVGY(k) - 8}
                    fill="white"
                    fontSize="12"
                  >
                    Eje de simetria: y = {k}
                  </text>
                </>
              ))}

            <path d={curva} stroke="#00FFFF" strokeWidth="4" fill="none" />

            {mostrarLadoRecto && (
              <>
                <line
                  x1={toSVGX(ladoRectoA.x)}
                  y1={toSVGY(ladoRectoA.y)}
                  x2={toSVGX(ladoRectoB.x)}
                  y2={toSVGY(ladoRectoB.y)}
                  stroke="orange"
                  strokeWidth="4"
                />

                <circle
                  cx={toSVGX(ladoRectoA.x)}
                  cy={toSVGY(ladoRectoA.y)}
                  r="5"
                  fill="orange"
                />

                <circle
                  cx={toSVGX(ladoRectoB.x)}
                  cy={toSVGY(ladoRectoB.y)}
                  r="5"
                  fill="orange"
                />

                <text
                  x={
                    (toSVGX(ladoRectoA.x) + toSVGX(ladoRectoB.x)) / 2 + 8
                  }
                  y={
                    (toSVGY(ladoRectoA.y) + toSVGY(ladoRectoB.y)) / 2 - 8
                  }
                  fill="orange"
                  fontSize="12"
                >
                  Lado recto = {longitudLadoRecto}
                </text>
              </>
            )}

            {mostrarFoco && (
              <>
                <circle
                  cx={toSVGX(foco.x)}
                  cy={toSVGY(foco.y)}
                  r="6"
                  fill="#FF33FF"
                />

                <text
                  x={toSVGX(foco.x) + 8}
                  y={toSVGY(foco.y) - 8}
                  fill="#FF33FF"
                  fontSize="12"
                >
                  F({foco.x},{foco.y})
                </text>
              </>
            )}

            {mostrarVertice && (
              <>
                <circle cx={toSVGX(h)} cy={toSVGY(k)} r="6" fill="yellow" />

                <text
                  x={toSVGX(h) + 8}
                  y={toSVGY(k) + 18}
                  fill="yellow"
                  fontSize="12"
                >
                  V({h},{k})
                </text>
              </>
            )}

            {mostrarParametro &&
              (esVertical ? (
                <>
                  <line
                    x1={toSVGX(h)}
                    y1={toSVGY(k)}
                    x2={toSVGX(h)}
                    y2={toSVGY(k + p)}
                    stroke="#FFD700"
                    strokeWidth="3"
                  />
                  <text
                    x={toSVGX(h) + 8}
                    y={(toSVGY(k) + toSVGY(k + p)) / 2}
                    fill="#FFD700"
                    fontSize="12"
                  >
                    |p| = {valorAbsolutoP}
                  </text>

                  <line
                    x1={toSVGX(h)}
                    y1={toSVGY(k)}
                    x2={toSVGX(h)}
                    y2={toSVGY(k - p)}
                    stroke="#66FF33"
                    strokeWidth="3"
                  />
                  <text
                    x={toSVGX(h) + 8}
                    y={(toSVGY(k) + toSVGY(k - p)) / 2}
                    fill="#66FF33"
                    fontSize="12"
                  >
                    |p| = {valorAbsolutoP}
                  </text>
                </>
              ) : (
                <>
                  <line
                    x1={toSVGX(h)}
                    y1={toSVGY(k)}
                    x2={toSVGX(h + p)}
                    y2={toSVGY(k)}
                    stroke="#FFD700"
                    strokeWidth="3"
                  />
                  <text
                    x={(toSVGX(h) + toSVGX(h + p)) / 2 - 10}
                    y={toSVGY(k) - 8}
                    fill="#FFD700"
                    fontSize="12"
                  >
                    |p| = {valorAbsolutoP}
                  </text>

                  <line
                    x1={toSVGX(h)}
                    y1={toSVGY(k)}
                    x2={toSVGX(h - p)}
                    y2={toSVGY(k)}
                    stroke="#66FF33"
                    strokeWidth="3"
                  />
                  <text
                    x={(toSVGX(h) + toSVGX(h - p)) / 2 - 34}
                    y={toSVGY(k) - 8}
                    fill="#66FF33"
                    fontSize="12"
                  >
                    |p| = {valorAbsolutoP}
                  </text>
                </>
              ))}

            {mostrarSegmentos && (
              <>
                <line
                  x1={toSVGX(puntoParabola.x)}
                  y1={toSVGY(puntoParabola.y)}
                  x2={toSVGX(foco.x)}
                  y2={toSVGY(foco.y)}
                  stroke="#FF33FF"
                  strokeWidth="3"
                />

                <line
                  x1={toSVGX(puntoParabola.x)}
                  y1={toSVGY(puntoParabola.y)}
                  x2={toSVGX(puntoDirectriz.x)}
                  y2={toSVGY(puntoDirectriz.y)}
                  stroke="#66FF33"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />

                <text
                  x={(toSVGX(puntoParabola.x) + toSVGX(foco.x)) / 2 + 8}
                  y={(toSVGY(puntoParabola.y) + toSVGY(foco.y)) / 2 - 8}
                  fill="#FF33FF"
                  fontSize="12"
                >
                  {distanciaFoco}
                </text>

                <text
                  x={
                    (toSVGX(puntoParabola.x) +
                      toSVGX(puntoDirectriz.x)) /
                      2 +
                    8
                  }
                  y={
                    (toSVGY(puntoParabola.y) +
                      toSVGY(puntoDirectriz.y)) /
                    2
                  }
                  fill="#66FF33"
                  fontSize="12"
                >
                  {distanciaDirectriz}
                </text>
              </>
            )}

            <circle
              cx={toSVGX(puntoParabola.x)}
              cy={toSVGY(puntoParabola.y)}
              r="7"
              fill="#00FFFF"
            />

            <text
              x={toSVGX(puntoParabola.x) + 8}
              y={toSVGY(puntoParabola.y) - 8}
              fill="#00FFFF"
              fontSize="12"
            >
              P({puntoParabola.x.toFixed(1)},{puntoParabola.y.toFixed(1)})
            </text>
          </svg>

          <div
            style={{
              textAlign: "center",
              marginTop: "4px",
              color: "#ccc",
              fontSize: "11px",
              fontStyle: "italic",
              maxWidth: "min(68vw, calc(100dvh - 102px), 470px)",
            }}
          >
            Propiedad: La distancia del punto P al foco es igual a la distancia
            del punto P a la directriz.
          </div>
        </div>

        <div style={columnStyle}>
          <div style={panelStyle}>
            <h2
              style={{
                color: "#00FFFF",
                textAlign: "center",
                margin: "0 0 12px",
                fontSize: "18px",
              }}
            >
              PARAMETROS
            </h2>

            <button
              onClick={() =>
                setOrientacion((prev) =>
                  prev === "vertical" ? "horizontal" : "vertical"
                )
              }
              style={{
                width: "100%",
                padding: "9px",
                marginBottom: "12px",
                backgroundColor: "#00FFFF",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Eje: {esVertical ? "Vertical" : "Horizontal"}
            </button>

            <div style={{ marginBottom: "10px" }}>
              <label>h = {h}</label>
              <input
                type="range"
                min="-10"
                max="10"
                value={h}
                onChange={(e) => setH(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>k = {k}</label>
              <input
                type="range"
                min="-10"
                max="10"
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>p = {p}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={p}
                onChange={(e) => setP(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>
                {esVertical ? "x" : "y"} del punto P ={" "}
                {controlPunto.toFixed(1)}
              </label>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={controlPunto}
                onChange={(e) => setControlPunto(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <h2
              style={{
                color: "#00FFFF",
                textAlign: "center",
                margin: "12px 0 8px",
                fontSize: "17px",
              }}
            >
              ZOOM
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setScale((prev) => Math.max(8, prev - 2))}
                style={{ ...buttonStyle, flex: 1, fontSize: "18px" }}
              >
                -
              </button>

              <div style={{ flex: 1.5, textAlign: "center" }}>
                Escala: {scale}
              </div>

              <button
                onClick={() => setScale((prev) => prev + 2)}
                style={{ ...buttonStyle, flex: 1, fontSize: "18px" }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div style={columnStyle}>
          <div style={panelStyle}>
            <h2
              style={{
                color: "#00FFFF",
                textAlign: "center",
                margin: "0 0 10px",
                fontSize: "17px",
              }}
            >
              MOSTRAR / OCULTAR
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                fontSize: "13px",
              }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={mostrarVertice}
                  onChange={() => setMostrarVertice(!mostrarVertice)}
                />{" "}
                Vertice
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={mostrarFoco}
                  onChange={() => setMostrarFoco(!mostrarFoco)}
                />{" "}
                Foco
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={mostrarDirectriz}
                  onChange={() => setMostrarDirectriz(!mostrarDirectriz)}
                />{" "}
                Directriz
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={mostrarParametro}
                  onChange={() => setMostrarParametro(!mostrarParametro)}
                />{" "}
                Parametro
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={mostrarLadoRecto}
                  onChange={() => setMostrarLadoRecto(!mostrarLadoRecto)}
                />{" "}
                Lado recto
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={mostrarSimetria}
                  onChange={() => setMostrarSimetria(!mostrarSimetria)}
                />{" "}
                Simetria
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={mostrarSegmentos}
                  onChange={() => setMostrarSegmentos(!mostrarSegmentos)}
                />{" "}
                Segmentos
              </label>
            </div>
          </div>

          <div style={{ ...panelStyle, marginTop: "8px" }}>
            <h2
              style={{
                color: "#00FFFF",
                textAlign: "center",
                margin: "0 0 10px",
                fontSize: "17px",
              }}
            >
              DISTANCIAS
            </h2>

            <div style={{ marginBottom: "8px" }}>
              Distancia PF: <strong>{distanciaFoco}</strong>
            </div>

            <div>
              Distancia a la directriz: <strong>{distanciaDirectriz}</strong>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}


