import React, { useEffect, useState } from "react"
import { ethers } from "ethers";

import githubLogo from "./assets/twitter-logo.svg"
import "./App.css"

import LoadingIndicator from './components/LoadingIndicator';
import SelectCharacter from "./components/SelectCharacter";
import Arena from './components/Arena';

import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";

import myEpicGame from "./utils/MyEpicGame.json";

const GITHUB_HANDLE = "br1perrone"
const GITHUB_LINK = `https://github.com/${GITHUB_HANDLE}`

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const checkIfWalletIsConnected = async () => {
    try {
      /*
       * Primeiro teremos certeza que temos acesso a window.ethereum
       */
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Eu acho que você não tem a metamask!");
        setIsLoading(false);
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);
      }
      
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Carteira conectada: ", account);
        setCurrentAccount(account);
      } else {
        console.log("Não encontramos uma carteira conectada");
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Instale a MetaMask!");
        return;
      }

      /*
       * Método chique para pedir acesso para a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizarmos Metamask.
       */
      console.log("Contectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img src="https://thumbs.gfycat.com/AnchoredPleasedBergerpicard-size_restricted.gif"
            alt="Nascimento Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Conecte sua carteira para começar
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter
               setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    }
  };
  
  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();

    (async () => {
      try {
        if (window.ethereum.networkVersion !== "5") {
          alert("Please connect to Goerli!");
        }
      } catch (error) {
        console.log(error);
      }
    })();
    
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Verificando pelo personagem NFT no endereço:", currentAccount);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
  
      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("Usuário tem um personagem NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("Nenhum personagem NFT foi encontrado");
      }

      setIsLoading(false);
    };
  
    if (currentAccount) {
      console.log("Conta Atual:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Batalhas no Metaverso ⚔️</p>
          <p className="sub-text">Junte-se a mim para vencer os inimigos do Metaverso!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Github Logo" className="github-logo" src={githubLogo} />
          <a
            className="footer-text"
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >{`construído por @${GITHUB_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
