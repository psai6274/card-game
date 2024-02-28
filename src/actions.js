
export const START_GAME = 'START_GAME';
export const DRAW_CARD = 'DRAW_CARD';
export const DEFUSE_BOMB = 'DEFUSE_BOMB';
export const GET_LEADERBOARD = 'GET_LEADERBOARD';

export const startGame = () => ({ type: START_GAME });
export const drawCard = () => ({ type: DRAW_CARD });
export const defuseBomb = () => ({ type: DEFUSE_BOMB });
export const getLeaderboard = () => ({ type: GET_LEADERBOARD });
export const updateLeaderboard = (username, points) => {
    return fetch(`http://l127.0.0.1:6379/update-leaderboard/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points }),
    })
        .then(response => response.json())
        .then(data => {

            console.log('Leaderboard updated:', data);
        })
        .catch(error => {
            console.error('Error updating leaderboard:', error);
        });
};


