let userAddress = "";
let contract;

// Esperar hasta que la página se haya cargado correctamente y MetaMask esté disponible
window.onload = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            userAddress = await signer.getAddress();  // Obtenemos la dirección del usuario
            console.log("Conectado con la cuenta:", userAddress);

            // Dirección y ABI del contrato
            const contractAddress = "0xE07a5Eae894c8D28fc29dDca8529e78A1d73eb68";  // La dirección de tu contrato en la red
            const contractABI = [  // ABI del contrato
					{
						"inputs": [],
						"stateMutability": "nonpayable",
						"type": "constructor"
					},
					{
						"anonymous": false,
						"inputs": [
							{
								"indexed": false,
								"internalType": "uint256",
								"name": "eventId",
								"type": "uint256"
							},
							{
								"indexed": false,
								"internalType": "address",
								"name": "voter",
								"type": "address"
							},
							{
								"indexed": false,
								"internalType": "uint256",
								"name": "optionIndex",
								"type": "uint256"
							}
						],
						"name": "Voted",
						"type": "event"
					},
					{
						"anonymous": false,
						"inputs": [
							{
								"indexed": false,
								"internalType": "uint256",
								"name": "eventId",
								"type": "uint256"
							},
							{
								"indexed": false,
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"indexed": false,
								"internalType": "uint256",
								"name": "start",
								"type": "uint256"
							},
							{
								"indexed": false,
								"internalType": "uint256",
								"name": "end",
								"type": "uint256"
							}
						],
						"name": "VotingEventCreated",
						"type": "event"
					},
					{
						"inputs": [
							{
								"internalType": "string",
								"name": "_name",
								"type": "string"
							},
							{
								"internalType": "string[]",
								"name": "_optionNames",
								"type": "string[]"
							},
							{
								"internalType": "uint256",
								"name": "_durationMinutes",
								"type": "uint256"
							}
						],
						"name": "createVotingEvent",
						"outputs": [],
						"stateMutability": "nonpayable",
						"type": "function"
					},
					{
						"inputs": [
							{
								"internalType": "uint256",
								"name": "_eventId",
								"type": "uint256"
							}
						],
						"name": "getOptions",
						"outputs": [
							{
								"components": [
									{
										"internalType": "string",
										"name": "name",
										"type": "string"
									},
									{
										"internalType": "uint256",
										"name": "voteCount",
										"type": "uint256"
									}
								],
								"internalType": "struct VotingManager.Option[]",
								"name": "",
								"type": "tuple[]"
							}
						],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [
							{
								"internalType": "uint256",
								"name": "_eventId",
								"type": "uint256"
							}
						],
						"name": "getRemainingTime",
						"outputs": [
							{
								"internalType": "uint256",
								"name": "secondsRemaining",
								"type": "uint256"
							}
						],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [
							{
								"internalType": "uint256",
								"name": "_eventId",
								"type": "uint256"
							}
						],
						"name": "getVotingStatus",
						"outputs": [
							{
								"internalType": "bool",
								"name": "isActive",
								"type": "bool"
							}
						],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [
							{
								"internalType": "uint256",
								"name": "_eventId",
								"type": "uint256"
							}
						],
						"name": "getWinner",
						"outputs": [
							{
								"internalType": "string",
								"name": "winnerName",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "winnerIndex",
								"type": "uint256"
							}
						],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "nextEventId",
						"outputs": [
							{
								"internalType": "uint256",
								"name": "",
								"type": "uint256"
							}
						],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [],
						"name": "owner",
						"outputs": [
							{
								"internalType": "address",
								"name": "",
								"type": "address"
							}
						],
						"stateMutability": "view",
						"type": "function"
					},
					{
						"inputs": [
							{
								"internalType": "uint256",
								"name": "_eventId",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "_optionIndex",
								"type": "uint256"
							}
						],
						"name": "vote",
						"outputs": [],
						"stateMutability": "nonpayable",
						"type": "function"
					}				
			];

            // Crear la instancia del contrato
            contract = new ethers.Contract(contractAddress, contractABI, signer);
        } catch (err) {
            console.error("Error al conectar con MetaMask:", err);
        }
    } else {
        alert("Por favor, instala MetaMask.");
    }
};

// Función para crear el evento de votación
async function createVotingEvent() {
    if (!contract) {
        console.log("Contrato no está inicializado.");
        return;
    }

    const eventName = document.getElementById("eventName").value;
    const optionNames = document.getElementById("optionNames").value.split(",");
    const duration = document.getElementById("duration").value;

    // Validar que los campos no estén vacíos
    if (!eventName || optionNames.length === 0 || !duration) {
        document.getElementById("statusMessage").innerHTML = "Por favor, complete todos los campos.";
        document.getElementById("statusMessage").style.display = "block";
        return;
    }

    try {
        // Llamada al contrato para crear el evento de votación
        const tx = await contract.createVotingEvent(eventName, optionNames, duration);
        console.log("Evento de votación creado, esperando confirmación...");

        // Espera la confirmación de la transacción
        await tx.wait();

        // Mostrar mensaje de éxito
        document.getElementById("statusMessage").innerHTML = "¡Evento de votación creado exitosamente!";
        document.getElementById("statusMessage").style.display = "block";
    } catch (error) {
        console.error("Error al crear el evento de votación:", error);
        document.getElementById("statusMessage").innerHTML = "Hubo un error al crear el evento de votación.";
        document.getElementById("statusMessage").style.display = "block";
    }
}

