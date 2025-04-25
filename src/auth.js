let web3auth = null;
let walletServicesPlugin = null;

(async function init() {
  $(".btn-logged-in").hide();
  $("#sign-tx").hide();

  const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get your clientId from https://dashboard.web3auth.io

  const chainConfig = {
    chainNamespace: "eip155",
    chainId: "0xaa36a7",
    rpcTarget: "https://1rpc.io/sepolia",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

  const privateKeyProvider = new window.EthereumProvider.EthereumPrivateKeyProvider({ config: { chainConfig } });

  web3auth = new window.Modal.Web3Auth({
    clientId,
    privateKeyProvider,
    web3AuthNetwork: "sapphire_mainnet",
  });

  // Add wallet service plugin
  walletServicesPlugin = new window.WalletServicesPlugin.WalletServicesPlugin();
  web3auth.addPlugin(walletServicesPlugin); // Add the plugin to web3auth

  await web3auth.initModal();

  if (web3auth.connected) {
    $(".btn-logged-in").show();
    $(".btn-logged-out").hide();
    if (web3auth.connected === "openlogin") {
      $("#sign-tx").show();
    }
  } else {
    $(".btn-logged-out").show();
    $(".btn-logged-in").hide();
  }
})();

$("#login").click(async function (event) {
  try {
    await web3auth.connect();
    $(".btn-logged-out").hide();
    $(".btn-logged-in").show();
    uiConsole("Logged in Successfully!");
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-user-info").click(async function (event) {
  try {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  } catch (error) {
    console.error(error.message);
  }
});

let userAddress = null; // variable global

$("#get-accounts").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    const accounts = await web3.eth.getAccounts();
    userAddress = accounts[0]; // guardamos la primera cuenta
    sessionStorage.setItem("userAddress", address);
    uiConsole("Address:", userAddress);

  } catch (error) {
    console.error(error.message);
  }
});


$("#get-balance").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  } catch (error) {
    console.error(error.message);
  }
});

$("#show-wallet").click(async function (event) {
  // print status in console
  uiConsole(walletServicesPlugin.status);
  if (walletServicesPlugin.status == "connected") {
    // check if wallet is connected
    await walletServicesPlugin.showWalletUi();
  }
});

$("#sign-message").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);
    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  } catch (error) {
    console.error(error.message);
  }
});

$("#logout").click(async function (event) {
  try {
    await web3auth.logout();
    $(".btn-logged-in").hide();
    $(".btn-logged-out").show();
  } catch (error) {
    console.error(error.message);
  }
});

function uiConsole(...args) {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
    console.log(...args);
  }
}