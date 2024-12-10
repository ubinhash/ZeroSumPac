import React from 'react';
import styles from './ending.module.css';

const EndingComponent = () => {
    return (
        <div>
          {/* Ending1 */}
          <h2>Endings and Reward</h2>
          <p>The game ends when players from a level dominates the resource.</p>
          <p> There are different rewards distribution for different endings, so players might be aiming for different endings based on their current standing. </p>
          <div className={styles.endingBlock}>
            <div className={`${styles.ending1} ${styles.ending}`}>
                <div className={styles.ending_title}>ENDING 1 : “MONOPOLY” -- Winner Takes All</div>
                <div className={styles.ending_description}> 1 Player reached Lv God = Controls 50% of the Dots </div>
            </div>
            <div className={styles.indentedBlock}>
                <b>Reward</b>
                <ul>
                    <li>• The player alone gets 10% of the mint fund.</li>
                    <li>• The only God-Tier NFT, personalized based on your request</li>
                    <li>• All the unclaimed 1/1 NFT, someone reaching Lv God means there will be less than 10 person that locked-in at lv 4.</li>
                </ul>
            </div>
          </div>
    
          {/* Ending2 */}
          <div className={styles.endingBlock}>
            <div className={`${styles.ending2} ${styles.ending}`}>
                <div className={styles.ending_title}>ENDING 2 : “Oligarchy” - The Privileged Few </div>
                <div className={styles.ending_description}>     Players that locked-in at lv4 collectively holds &gt;=50% of the Dots in total.  (Max 10 Players)</div>
            </div>
            <div className={styles.indentedBlock}>
                <b>Reward</b>
                <ul>
                    <li>• All player on Lv4 share 10% of the mint fund, proportional to the dots they hold.</li>
                    <li>• Players locked-in at lv 4 gets an 1/1 NFT (Max 10)</li>
                    <li>• Remaining 1/1 NFT goes to unlocked players based on ranking</li>
                </ul>
            </div>
          </div>
    
          {/* Ending3 */}
          <div className={styles.endingBlock}>
          <div className={`${styles.ending3} ${styles.ending}`}>
                <div className={styles.ending_title}>ENDING 3 : “CO-GOVERNENCE” - Success Of The Commons</div>
                <div className={styles.ending_description}>Players that locked in at lv3 collectively holds &gt;=50% of Dots in total.  (Max 21 Players)</div>
            </div>
            <div className={styles.indentedBlock}>
                <b>Reward</b>
                <ul>
                    <li>• All Players on Lv 3 will share 6% of the mint fund proportionally</li>
                    <li>• All players below lv 3 will share 4% of the mint fund proportionally.</li>
                    <li>• Remaining 1/1 NFT will be raffled amongst all players on or below lv 3, proportional to the dots they hold.</li>
                </ul>
            </div>
          </div>
        </div>
      );
};

export default EndingComponent;
