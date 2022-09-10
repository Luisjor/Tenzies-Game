import React from "react"

export default function Scores(props) {
    return (
        <div className='score--game'>
            <p>Your rolls: {props.currentScore}</p>
            <p>Last game rolls: {props.lastScore}</p>
            <p>Worst game: {props.worstScore}</p>
            <p>Best game: {props.bestScore}</p>

        </div>
    )
}