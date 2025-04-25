CREATE DATABASE PadronElectoral;
GO

USE PadronElectoral

CREATE TABLE Corregimientos(
	IDCorr INT PRIMARY KEY IDENTITY,
	NombreCorr VARCHAR(50)
);
GO

CREATE TABLE Ciudadanos(
	IDCiudadano VARCHAR(50) PRIMARY KEY,
	Nombre VARCHAR(50),
	Apellido VARCHAR(50),
	Edad int,
	IDCorr INT,
    FOREIGN KEY (IDCorr) REFERENCES Corregimientos(IDCorr)
);
GO

--Insersi�n de los Corregimientos
INSERT INTO Corregimientos (NombreCorr) VALUES ('24 de Diciembre');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Alcalde D�az');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Anc�n');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Bella Vista');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Betania');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Caimitillo');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Calidonia');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Chilibre');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Curund�');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Don Bosco');
INSERT INTO Corregimientos (NombreCorr) VALUES ('El Chorrillo');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Ernesto C�rdoba Campos');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Juan D�az');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Las Cumbres');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Las Garzas');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Las Ma�anitas');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Pacora');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Parque Lefevre');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Pedregal');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Pueblo Nuevo');
INSERT INTO Corregimientos (NombreCorr) VALUES ('R�o Abajo');
INSERT INTO Corregimientos (NombreCorr) VALUES ('San Felipe');
INSERT INTO Corregimientos (NombreCorr) VALUES ('San Francisco');
INSERT INTO Corregimientos (NombreCorr) VALUES ('San Mart�n');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Santa Ana');
INSERT INTO Corregimientos (NombreCorr) VALUES ('Tocumen');

SELECT * FROM Corregimientos
SELECT * FROM Ciudadanos

DELETE FROM Ciudadanos
INSERT INTO Ciudadanos (IDCiudadano, Nombre, Apellido, Edad, IDCorr)
VALUES ('81008433', 'Mayrenis', 'G�mez', 21, (SELECT IDCorr FROM Corregimientos WHERE NombreCorr = 'R�o Abajo'));

INSERT INTO Ciudadanos (IDCiudadano, Nombre, Apellido, Edad, IDCorr)
VALUES ('823280', 'Lil', 'Torres', 62, (SELECT IDCorr FROM Corregimientos WHERE NombreCorr = 'Calidonia'));
