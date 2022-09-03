import React, {useState, useEffect} from 'react';
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        console.log("Mintando personagem...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
    }
  };
  
  useEffect(() => {
    const { ethereum } = window;
  
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
  
      setGameContract(gameContract);
    } else {
      console.log("Objeto Ethereum não encontrado");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Buscando contrato de personagens para mintar");
  
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);
  
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );
  
        setCharacters(characters);
      } catch (error) {
        console.error("Algo deu errado ao buscar personagens:", error);
      }
    };
  
    if (gameContract) {
      getCharacters();
    }
  }, [gameContract]);

  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={index}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          // onClick={mintCharacterNFTAction(index)} 
          // você deve descomentar essa linha depois que criar a função mintCharacterNFTAction
        >{`Mintar ${character.name}`}</button>
      </div>
    )
  );
  
  return (
    <div className="select-character-container">
      <h2>Minte seu Herói. Escolha com sabedoria.</h2>
      {characters && characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
    </div>
  )
}

export default SelectCharacter;