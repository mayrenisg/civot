import { Web3Auth } from "@web3auth/web3auth";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";

let web3auth;

export const initWeb3Auth = async () => {
  web3auth = new Web3Auth({
    clientId: "BCJ_obuVVCVk4gtMUiunl_KRSSc7bFGqCSbSh-4AjP9DmHH_P6ZyapdORfyk2baeqyrA6s34wSt53_UZgaVc1nE", // tu clientId
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x13881", // Polygon Mumbai (cambiá si usás otra testnet)
      rpcTarget: "https://rpc-mumbai.maticvigil.com", // opcional
    },
  });

  const adapter = new OpenloginAdapter();
  web3auth.configureAdapter(adapter);

  await web3auth.initModal();
  return web3auth;
};
