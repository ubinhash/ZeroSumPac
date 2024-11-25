import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from './game.module.css';
import { useState } from 'react';
export default function Game() {

  const mainStyle = {

  };
  const [totalMaze,setTotalMaze] = useState(10);
  const [display,setDisplay] = useState('maze')
  const [maze, setMaze] = useState(0); // State to store selected maze

  const handleMazeSelect = (mazeNumber) => {
    setDisplay('maze');
    setMaze(mazeNumber); // Update state with selected maze number
    console.log(`Selected Maze: ${mazeNumber}`); // Optional: For debugging
  };
  const handleOptionSelect =(option) =>{
    setDisplay(option);
  }

  return (
    <Layout home>
      <Head>
        <title>Let's Play</title>
      </Head>
    <div className={styles.grid}>
        
    
    <div className={`${styles.section} ${styles.section1}`}>
        <div className={styles.mazeSelector}>
            <div  className={styles.mazeButtons}>
                {/* Maze selection buttons */}
                {[...Array(totalMaze-1).keys()].map((mazeNumber) => (
                    <button key={mazeNumber} className={`${ maze === mazeNumber && display ==="maze" ? styles.active : ""}`}
                    onClick={() => handleMazeSelect(mazeNumber)}>
                        Maze {mazeNumber}
                    </button>
                ))}
                <button key={totalMaze-1}  className={`${ maze === 9 && display ==="maze"  ? styles.active : ""}`}
                onClick={() => handleMazeSelect(9)}>
                    Special
                </button>
            </div>
            <div className={styles.mazeInfo}>
                There are total of [] mazes. Maze [] will unlock when [] nft are minted.
            </div>
            {/* Add as many buttons as needed */}
        </div>
        <div className={styles.menuOptions}>
            {/* Menu option buttons */}
            <button onClick={() => handleOptionSelect('log')} >Log</button>
            <button onClick={() => handleOptionSelect('ranking')} >Ranking</button>
            <button onClick={() => handleOptionSelect('forfeit')}>Forfeit</button>
            <button onClick={() => handleOptionSelect('lockin')}>Lock-in</button>
        </div>
    </div>
      <div className={`${styles.section} ${styles.section2}`}>
      {display === "maze" && <h1>Maze {maze}</h1>} 
      {display === "log" && <h1>Log </h1>} {/* Replace with your actual Log component */}
      {display === "ranking" && <h1>Ranking</h1>} {/* Replace with your actual Ranking component */}
      {display === "forfeit" && <h1>Forfeit</h1>} {/* Replace with your actual Log component */}
      {display === "lockin" && <h1>lockin</h1>} {/* Replace with your actual Ranking component */}
      </div>
      <div className={`${styles.section} ${styles.section3}`}>
        <h1>Section 3</h1>
      </div>
    </div>


    </Layout>
  )
}
