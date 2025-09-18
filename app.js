const express = require("express");
const path = require("path");

const app = express();

let turnos = [];
let turnoActual = null;
let historial = [];
let contador = 0;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Crear un nuevo turno (tótem o manual)
app.post("/nuevo-turno", (req, res) => {
  const { tipo } = req.body;
  contador++;
  let prefijo = tipo === "sin-turno" ? "ST-" : "T-";
  const nuevo = {
    id: contador,
    numero: prefijo + contador,
    tipo,
    atendido: false,
  };
  turnos.push(nuevo);
  res.json(nuevo);
});

// Avanzar al siguiente turno
app.post("/avanzar", (req, res) => {
  if (turnos.length === 0) return res.json({ msg: "No hay turnos" });

  if (turnoActual) historial.unshift(turnoActual);
  turnoActual = turnos.shift();
  turnoActual.atendido = true;

  res.json(turnoActual);
});

// Obtener historial
app.get("/historial", (req, res) => {
  res.json(historial.slice(0, 5));
});

// Obtener turno actual
app.get("/turno-actual", (req, res) => {
  res.json(turnoActual || {});
});

// CRUD de turnos
app.get("/turnos", (req, res) => {
  res.json({ turnoActual, turnos });
});

app.post("/turnos", (req, res) => {
  const { tipo } = req.body;
  contador++;
  let prefijo = tipo === "sin-turno" ? "ST-" : "T-";
  const nuevo = {
    id: contador,
    numero: prefijo + contador,
    tipo: tipo || "manual",
    atendido: false,
  };
  turnos.push(nuevo);
  res.json(nuevo);
});

app.put("/turnos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { numero, tipo } = req.body;
  const turno = turnos.find((t) => t.id === id);
  if (!turno) return res.status(404).json({ msg: "Turno no encontrado" });
  if (numero) turno.numero = numero;
  if (tipo) turno.tipo = tipo;
  res.json(turno);
});

app.delete("/turnos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = turnos.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ msg: "Turno no encontrado" });
  const eliminado = turnos.splice(index, 1)[0];
  res.json(eliminado);
});

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
