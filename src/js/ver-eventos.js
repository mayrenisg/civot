async function getVotingEventsFromLogs() {
    // Conectar con la red Sepolia
   const INFURA_URL = `https://sepolia.infura.io/v3/8122c33d2fc9464e823a08387d0e4d00`; // Cambia el ID con tu clave
    const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

    const contractAddress = "0xE07a5Eae894c8D28fc29dDca8529e78A1d73eb68"; // Cambia por la dirección de tu contrato en Sepolia
    const abi = [  // Solo necesitas el fragmento del evento
        "event VotingEventCreated(uint256 eventId, string name, uint256 start, uint256 end)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Filtrar logs de eventos VotingEventCreated desde el bloque 0 hasta el bloque más reciente
    const logs = await contract.queryFilter("VotingEventCreated", 0, "latest");

    // Procesar los logs
    const events = logs.map(log => {
        return {
            eventId: log.args.eventId.toString(),
            name: log.args.name,
            start: new Date(log.args.start.toNumber() * 1000).toLocaleString(),
            end: new Date(log.args.end.toNumber() * 1000).toLocaleString()
        };
    });

    return events;
}

// Llamar la función cuando la página cargue
window.onload = async () => {
    const events = await getVotingEventsFromLogs();
    console.log(events);

    const eventListDiv = document.getElementById("eventList");

    if (events.length === 0) {
        eventListDiv.innerHTML = "No se encontraron eventos.";
    } else {
        let eventHTML = "<ul>";
        
        // Usamos un bucle asincrónico para obtener el estado de cada evento
        for (const event of events) {
            const isActive = await checkVotingStatus(event.eventId); // Obtener el estado de votación

            eventHTML += `
                <li>
                    <strong>Evento:</strong> ${event.name} <br>
                    <strong>Inicio:</strong> ${event.start} <br>
                    <strong>Fin:</strong> ${event.end} <br>
                    <strong>ID:</strong> ${event.eventId} <br>
                    <strong>Status:</strong> ${isActive ? "Puedes votar" : "Votación cerrada"} <br>
            `;

            // Solo mostrar el botón si la votación está activa
            if (isActive) {
                eventHTML += `
                    <button class="voteButton" data-id="${event.eventId}">Ver opciones</button>
                `;
            }

            eventHTML += `</li>`;
        }
        
        eventHTML += "</ul>";
        eventListDiv.innerHTML = eventHTML;
    }
};

// Función para verificar el estado de votación de un evento
async function checkVotingStatus(eventId) {
    const contractAddress = "0xE07a5Eae894c8D28fc29dDca8529e78A1d73eb68";  // Dirección del contrato
    const abi = [
        "function getVotingStatus(uint256 _eventId) public view returns (bool)"
    ];

    const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/8122c33d2fc9464e823a08387d0e4d00");  // URL de Infura
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const isActive = await contract.getVotingStatus(eventId);
        return isActive;
    } catch (error) {
        console.error("Error al verificar el estado del evento:", error);
        return false; // Si hay un error, consideramos el evento como cerrado
    }
}

async function getOptionsForEvent(eventId) {
    const INFURA_URL = `https://sepolia.infura.io/v3/8122c33d2fc9464e823a08387d0e4d00`;
    const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

    const contractAddress = "0xE07a5Eae894c8D28fc29dDca8529e78A1d73eb68";
    const abi = [
        "function getOptions(uint256) view returns (tuple(string name, uint256 voteCount)[])"
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider);
    const options = await contract.getOptions(eventId);
    return options.map((option, i) => ({
        index: i,
        name: option.name,
        votes: option.voteCount.toString()
    }));
}

// Función para votar en una opción
// Función para votar en una opción
async function voteOnOption(eventId, optionIndex) {
    // Obtener la dirección de la billetera desde sessionStorage
const userAddress = sessionStorage.getItem("userAddress");
    console.log(userAddress);  
    if (!userAddress) {
      alert("Primero necesitas conectarte con tu billetera.");
      return;
    }
  
    // Usar la dirección obtenida para crear un proveedor y firmante con ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(userAddress); // Usamos la dirección almacenada en sessionStorage
  
    const contractAddress = "0xE07a5Eae894c8D28fc29dDca8529e78A1d73eb68"; // Dirección del contrato
    const abi = [
      "function vote(uint256, uint256) public"
    ];
  
    const contract = new ethers.Contract(contractAddress, abi, signer);
  
    // Enviar la transacción de voto
    try {
      const tx = await contract.vote(eventId, optionIndex);
      await tx.wait();  // Esperar confirmación
      alert("¡Voto registrado exitosamente!");
    } catch (error) {
      console.error("Error al registrar el voto:", error);
      alert("Hubo un error al votar.");
    }
  }  

// Mostrar opciones de votación cuando se haga clic en "Ver opciones"
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("voteButton")) {
        const eventId = e.target.dataset.id;

        const options = await getOptionsForEvent(eventId);

        let optionHtml = `<h3>Opciones para evento ${eventId}</h3><ul>`;
        options.forEach(option => {
            optionHtml += `
                <li>
                    ${option.name} - ${option.votes} votos
                    <button class="submitVote" data-event="${eventId}" data-index="${option.index}">Votar por esta</button>
                </li>
            `;
        });
        optionHtml += `</ul>`;

        document.getElementById("eventOptions").innerHTML = optionHtml;
    }
});

// Función para votar en una opción
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("submitVote")) {
        const eventId = e.target.dataset.event;
        const optionIndex = e.target.dataset.index;

        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Solicitar acceso a la wallet
        await voteOnOption(eventId, optionIndex);
    }
});