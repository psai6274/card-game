// App.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGame, drawCard, defuseBomb, getLeaderboard } from "./actions";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const { gameStarted, deck, playerHand, bombsDrawn, defuseCards } = useSelector((state) => state.game);

  const handleStartGame = () => {
    dispatch(startGame());


    axios.post("/startGame")
      .then(response => {

        console.log("Game started successfully", response);
      })
      .catch(error => {
        console.error("Error starting the game:", error);
      });
  };


  const handleDrawCard = () => {
    dispatch(drawCard());

  };

  const handleDefuseBomb = () => {
    dispatch(defuseBomb());

  };

  const handleGetLeaderboard = () => {
    dispatch(getLeaderboard());

  };

  const renderPlayerHand = () => {
    return (
      <div>
        <h2>Your Hand:</h2>
        <ul>
          { playerHand.map((card, index) => (
            <li key={ index }>{ card }</li>
          )) }
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h1>Exploding Kittens Game</h1>
      { !gameStarted ? (
        <button onClick={ handleStartGame }>Start Game</button>
      ) : (
        <div>
          <button onClick={ handleDrawCard }>Draw Card</button>
          <button
            onClick={ handleDefuseBomb }
            disabled={ defuseCards === 0 || bombsDrawn === 0 }
          >
            Defuse Bomb
          </button>
          <button onClick={ handleGetLeaderboard }>Get Leaderboard</button>
          { renderPlayerHand() }
          <p>Bombs Drawn: { bombsDrawn }</p>
          <p>Defuse Cards: { defuseCards }</p>
          { deck.length > 0 && <p>Cards Remaining in Deck: { deck.length }</p> }
        </div>
      ) }
    </div>
  );
}

export default App;
