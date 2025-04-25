import express from 'express';
import sql from 'mssql';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

// Configuración de conexión
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.use(cors());

app.get('/datos', async (req, res) => {
  try {
    await sql.connect(dbConfig);

    const cedula = req.query.cedula;

    // Verificamos si existe la cédula
    const result = await sql.query`SELECT COUNT(*) AS Total FROM Ciudadanos WHERE IdCiudadano = ${cedula}`;
    const verificacion = result.recordset[0].Total > 0;

    let corregimiento = null;

    if (verificacion) {
      const corrResult = await sql.query`SELECT IdCorr FROM Ciudadanos WHERE IdCiudadano = ${cedula}`;
      
      if (corrResult.recordset.length > 0) {
        corregimiento = corrResult.recordset[0].IdCorr; // o "corregimiento" si esa es la columna correcta
      }
    }

    res.json({
      verificado: verificacion,
      corregimiento: corregimiento
    });

  } catch (err) {
    console.error('Error al consultar SQL Server:', err);
    res.status(500).json({ error: 'Error al conectarse a la base de datos', detalles: err.message });
  }
});

// 🔊 Agrega este bloque para ver que el servidor está corriendo
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
