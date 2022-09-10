import './App.css';
import React from "react"
import Die from "./Components/Die"
import Scores from "./Components/Scores"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [gameClicks, setGameClicks] = React.useState(0)
    const [lastGameClicks, setLastGameClicks] = React.useState(localStorage.getItem("lastGame") || 0)
    const [worstScoreClicks, setWorstScoreClicks] = React.useState(localStorage.getItem("worstGame") || 0)
    const [bestScoreClicks, setBestScoreClicks] = React.useState(localStorage.getItem("bestGame") || "No scores yet")

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
          setGameClicks(oldValue => oldValue + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setLastGameClicks(gameClicks)
            localStorage.setItem("lastGame", gameClicks)
            if (gameClicks > worstScoreClicks) {
              setWorstScoreClicks(gameClicks)
              localStorage.setItem("worstGame", gameClicks)
            }
            if (bestScoreClicks === "No scores yet") {
              setBestScoreClicks(gameClicks)
              localStorage.setItem("bestGame", gameClicks)
            } else if (bestScoreClicks > gameClicks) {
              setBestScoreClicks(gameClicks)
              localStorage.setItem("bestGame", gameClicks)
            }
            setGameClicks(0)
            
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <Scores
              currentScore={gameClicks}
              lastScore={lastGameClicks}
              worstScore={worstScoreClicks}
              bestScore={bestScoreClicks}/>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
