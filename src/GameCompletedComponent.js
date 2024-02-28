// GameCompletedComponent.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLeaderboard } from './actions';

const GameCompletedComponent = () => {
    const dispatch = useDispatch();
    const { username, points } = useSelector(state => state);

    useEffect(() => {
        // Assuming the game is completed and you want to update the leaderboard
        dispatch(updateLeaderboard(username, points));
    }, [dispatch, username, points]);

    return (
        <div>
            <h2>Game Completed</h2>

        </div>
    );
};

export default GameCompletedComponent;
