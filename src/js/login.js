let web3auth = null;

(async function init() {
  const clientId = "BCJ_obuVVCVk4gtMUiunl_KRSSc7bFGqCSbSh-4AjP9DmHH_P6ZyapdORfyk2baeqyrA6s34wSt53_UZgaVc1nE"; // cambia por el tuyo

  const chainConfig = {
    chainNamespace: "eip155",
    chainId: "0xaa36a7",
    rpcTarget: "https://1rpc.io/sepolia",
  };

  const privateKeyProvider = new window.EthereumProvider.EthereumPrivateKeyProvider({ config: { chainConfig } });

  web3auth = new window.Modal.Web3Auth({
    clientId,
    privateKeyProvider,
    web3AuthNetwork: "sapphire_mainnet",
  });

  await web3auth.initModal();

  if (web3auth.connected) {
    window.location.href = "./dashboard.html";
  }

  $("#login").click(async () => {
    try {
      await web3auth.connect();
      window.location.href = "./dashboard.html";
    } catch (error) {
      console.error("Error de login:", error);
    }
  });
})();
