const express = require("express");
const client = require("./conexion.js");
const path = require("path");
const {
  queryProductTop,
  queryEmpleadoTop,
  queryClientesTop,
  queryIngresoGastoMensual,
} = require("./querys.js");

const app = express();
const port = 3000;

// Conexión a la base de datos
client.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.stack);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/producto", (req, res) => {
  // Consulta a la base de datos para obtener los datos
  client.query(queryProductTop, (err, result) => {
    if (err) {
      console.error("Error al obtener los datos:", err.stack);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      // Enviar los datos en formato JSON como respuesta
      res.json(result.rows);
    }
  });
});

app.get("/empleado", (req, res) => {
  // Consulta a la base de datos para obtener los datos
  client.query(queryEmpleadoTop, (err, result) => {
    if (err) {
      console.error("Error al obtener los datos:", err.stack);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      // Enviar los datos en formato JSON como respuesta
      res.json(result.rows);
    }
  });
});

app.get("/clientes", (req, res) => {
  // Consulta a la base de datos para obtener los datos
  client.query(queryClientesTop, (err, result) => {
    if (err) {
      console.error("Error al obtener los datos:", err.stack);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      // Enviar los datos en formato JSON como respuesta
      res.json(result.rows);
    }
  });
});

app.get("/ingresosgastos", (req, res) => {
  // Consulta a la base de datos para obtener los datos
  client.query(queryIngresoGastoMensual, (err, result) => {
    if (err) {
      console.error("Error al obtener los datos:", err.stack);
      res.status(500).json({ error: "Error al obtener los datos" });
    } else {
      // Enviar los datos en formato JSON como respuesta
      res.json(result.rows);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
