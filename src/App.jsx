import './App.css';
import { useState } from 'react';
import { Square } from './Components/Square.jsx'
import { TURNS } from './Constants';
import { checkWinner, checkEndGame } from './Components/Logic/board';
import { WinnerModal } from './Components/WinnerModal';



function App() {
 
 const [board, setBoard] = useState(()=>{
  const boardFromLocalStorage = window.localStorage.getItem('board')
  return boardFromLocalStorage ? JSON.parse(boardFromLocalStorage) : Array(9).fill(null)
 })
 const [turn, setTurn] = useState(() => {
  const turnFromLocalStorage = window.localStorage.getItem('turn')
  return turnFromLocalStorage ??  TURNS.X
 })
 const [winner, setWinner] =useState(null)

 

const resetGame = () => {
  setBoard(Array(9).fill(null))
  setTurn(TURNS.X)
  setWinner(null)
  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
}
  
  const updateBoard = (index) => {
    if(board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    const newWinner = checkWinner(newBoard)
    if(newWinner){
      setWinner(newWinner)
    }else if (checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  return (
    <main className='board'>
      <h1>Tateti</h1>
      <button onClick={resetGame}> Resetear el juego</button>
      <section className='game'>
        {
          board.map((_, index) =>{
            return(
             <Square 
                key={index}
                index={index}
                updateBoard={updateBoard}
                >
                  {board[index]}
              </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={ turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={ turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
      <WinnerModal winner={winner} resetGame={resetGame} />
    </main>
  );
}

export default App;
