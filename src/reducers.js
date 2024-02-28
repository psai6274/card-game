
// reducers.js
import { combineReducers } from 'redux';
// import axios from "axios";
import {
    START_GAME,
    DRAW_CARD,
    DEFUSE_BOMB,
    GET_LEADERBOARD,
} from './actions.js';

const initialState = {
    gameStarted: false,
    deck: [],
    playerHand: [],
    bombsDrawn: 0,
    defuseCards: 0,
    leaderboard: [],
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_GAME:
            const shuffledDeck = shuffleArray(['Cat', 'Shuffle', 'Bomb', 'Defuse']);
            return {
                ...state,
                gameStarted: true,
                deck: shuffledDeck,
            };

        case DRAW_CARD:
            if (state.playerHand.length < 5 && state.deck.length > 0) {
                const randomIndex = Math.floor(Math.random() * state.deck.length);
                const drawnCard = state.deck[randomIndex];

                const updatedDeck = [...state.deck];
                updatedDeck.splice(randomIndex, 1);

                const updatedHand = [...state.playerHand, drawnCard];

                let updatedBombsDrawn = state.bombsDrawn;
                let updatedDefuseCards = state.defuseCards;

                if (drawnCard === 'Bomb') {
                    if (updatedDefuseCards > 0) {
                        // Player has a defuse card, defuse one bomb
                        updatedDefuseCards -= 1;
                        updatedBombsDrawn -= 1;
                    } else {
                        // Player doesn't have a defuse card, display lose message
                        alert('You lost! Game over.');
                        return initialState; // Restart the game
                    }
                } else if (drawnCard === 'Defuse') {
                    updatedDefuseCards += 1;
                } else if (drawnCard === 'Shuffle') {
                    // Restart the game from the initial state if a "Shuffle" card is drawn
                    return {
                        ...initialState,
                        gameStarted: true,
                        deck: shuffleArray(['Cat', 'Shuffle', 'Bomb', 'Defuse']),
                    };
                }

                return {
                    ...state,
                    deck: updatedDeck,
                    playerHand: updatedHand,
                    bombsDrawn: updatedBombsDrawn,
                    defuseCards: updatedDefuseCards,
                };
            }

            return state;

        case DEFUSE_BOMB:
            if (state.defuseCards > 0 && state.bombsDrawn > 0) {
                const updatedBombsDrawn = state.bombsDrawn - 1;
                const updatedDefuseCards = state.defuseCards - 1;

                return {
                    ...state,
                    bombsDrawn: updatedBombsDrawn,
                    defuseCards: updatedDefuseCards,
                };
            }

            return state;

        case GET_LEADERBOARD:
            return {
                ...state,
                leaderboard: action.payload,
            };

        default:
            return state;
    }
};

const rootReducer = combineReducers({
    game: gameReducer,
    // Add other reducers if you have them
});

const shuffleArray = (array) => {
    const shuffledArray = [];

    // Randomly select 5 cards from the initial array
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * array.length);
        shuffledArray.push(array[randomIndex]);
    }

    // Repeat one of the cards
    const repeatedCard = array[Math.floor(Math.random() * array.length)];
    shuffledArray.push(repeatedCard);

    return shuffledArray;
};

export default rootReducer;
