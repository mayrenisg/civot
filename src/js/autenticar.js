async function initWeb3Auth() {
    try {
      // Inicializa Web3Auth
      await web3auth.initModal();
  
      // Crea una nueva wallet de Ethereum con Web3Auth
      const web3authProvider = await web3auth.connect();
  
      if (web3authProvider) {
        // Obtén la dirección de la wallet creada
        const accounts = await web3auth.request({ method: "eth_accounts" });
        console.log("Wallet address:", accounts[0]);
  
        // Si necesitas el balance de la wallet:
        const balance = await web3auth.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });
        console.log("Balance:", balance);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  // Llamar a la función para inicializar la wallet
  initWeb3Auth();
  