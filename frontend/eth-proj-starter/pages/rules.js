import Head from 'next/head';
import Layout from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import styles from './rules.module.css';
import EndingComponent from '../components/DisplayComponent/ending';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>Title</title>
      </Head>
      <div className={styles.grid}>
        <div className={`${styles.section} ${styles.section1}`}>

          <div className={styles.faq}>
            {/* HOW TO PLAY */}
            <h2>HOW TO PLAY?</h2>
            <ul>
              <li>Mint a Pac &gt; Eat the Dots &gt; Level Up!</li>
              <li>Leveling up will give you advantage in game and unlock rewards.</li>
              <li>Only 3780 dots are available out there, scattered across 10 mazes,
              you will be competing with other players for limited resource.</li>

            </ul>

            {/* LEVEL UP */}
            <h2>LEVEL UP?</h2>
            <ul className={styles.levels}>
              <li>
                <span className={styles.icon}><img src="icons/rules/lv1.svg"></img></span> Lv1: EVERYONE
              </li>
              <li>
                <span className={styles.icon}><img src="icons/rules/lv2.svg"></img></span> Lv2: Hold &gt;=21 dots (max 180 ppl achievable)
              </li>
              <li>
                <span className={styles.icon}><img src="icons/rules/lv3.svg"></img></span> Lv3: Hold &gt;=90 dots (max 21 ppl lock-in, 42 achievable)
              </li>
              <li>
                <span className={styles.icon}><img src="icons/rules/lv4.svg"></img></span> Lv4: Hold &gt;=189 dots (max 10 ppl lock-in, 20 achievable)
              </li>
              <li>
                <span className={styles.icon}><img src="icons/rules/lvgod.svg"></img></span> Lv God: Hold &gt; 50% of dots (max 1 person)
              </li>
            </ul>


            <h2>LEVEL Down?</h2>
            <ul className={styles.levels}>
              <li>
                If you lose your dots, you will lose your level.
              </li>
              <li>
              So when you reach lv 3 or above, you may “lock-in” your level to claim level reward. But you will not be able to play the game or level up once locked.
              </li>
            </ul>
            <h2>Endings and Reward</h2>
          <p>The game ends when players from a level dominates the resource.</p>
          <p> There are different rewards distribution for different endings, so players might be aiming for different endings based on their current standing. </p>
            <EndingComponent></EndingComponent>

            <h2>Level Reward?</h2>
            <ul>
              <li> <b>In Game Advantage</b></li>
                <ul>
                  <li>Lv2: you cannot be eaten by lower level players, +5 moves/day</li>
                  <li>Lv3: unlocks shield, ability to lock-in, +5 moves/day</li>
                  <li>Lv4: + 5 moves/day</li>
                </ul>
              <li><b>Outside of Game</b></li>
              <ul>
                <li>Lv3: Unlocks Secret NFT Trait</li> 
                <li>Lv4: Unlocks 1/1 NFT (10 Total)</li> 
                <li>Lv God: Unlocks Personalized 1/1 NFT (1 Total)</li> 
              </ul>
            </ul>
            <h2>How to obtain dots?</h2>
            <ul className={styles.levels}>
              <li>
                A.Moving to a square on board with dot.
              </li>
              <img className={styles.method} src="icons/rules/method1.gif"></img>
              <li>
                B.Moving to a square with a same/lower level Pac.
              </li>
                <ul>
                  <li>• You will get some percentage of it's dots, round up to integer (0.1=&gt;1)</li>
                  <li>•  You two will swap places.</li>
                  <li>•  The percentage is can be changed by the "governer" everyday. (See governor election section) </li>
                </ul>

                <img className={styles.method} src="icons/rules/method2.gif"></img>
              <li>
                C.Collaborate to surround a pac with other player and click "rob"!
              </li>
                 <ul>
                  <li>• Each surrounding player get 10% of it's dots</li>
                  <li>• You may rob higher level player this way, it must have minimum of 4 dots! </li>
                  <li>• You will need less player to surround if the victim is adjacent to border/obstacle</li>
                </ul>
                <div className={styles.method_container}>
                <img className={styles.method2} src="icons/rules/method3.gif"></img>
                <img className={styles.method2} src="icons/rules/method3-2.gif"></img>
                </div>
            </ul>

            <h2>Detailed Mechanism</h2>
            <ul>
              <li>&gt; 10 Steps / Day (+5 steps when you rank up)</li>
              <li>&gt; 10 sec cool-down / Move</li>
              <li>&gt; 60 sec cool-down  when you enter game or switch maze</li>
              <li>&gt; If a PAC got eaten, it will be safe for 12 hrs. The protection expires when the player moves.</li>
              <li>&gt; Shield prevents you from losing dots, max 24 hrs [Unlocks at Lv 3]</li>
              <li>&gt; Even when shielded, you will still be vulnerable to attack for 10 min window when you move</li>
              <li>&gt; you may switch maze once a week, or pay 0.001 ETH bribe to escape</li>
            </ul>


            <h2>How to shield?</h2>
            <ul>
                  <li>You can increase your shield time to max 24 hour by burning an OTOM molecule (NOT singleton otom) to our contract. </li>
                  <li>The duration of shield time is determined by hardness & toughness of the molecule.</li>
                  <li>Shield prevents you from losing dots. But be aware, you will be open for attack for 10 min everytime you move!</li>
            </ul>
            <h2>Shapecraft Key & Shapecraft Eyes?</h2>
            <ul>
                  <li> <span className={styles.icon}><img src="icons/keys.png"></img></span>Shapecraft key unlocks a special maze</li>
                  <li> <span className={styles.icon}><img src="icons/eyes.png"></img></span>Shapecraft eye will increase your stride to 2.</li>
                  <li>Note: Each key/eye can only be equipped to one Pac NFT once per game! No transfer required.</li>
            </ul>

            <h2>Can I transfer my dots?</h2>
            <ul>
                  <li>Yes, but only when you forfeit the game.</li>
                  <li>You must transfer all your dots to an active player when you forfeit. You will not be able to re-join the game again when you forfeit. </li>
            </ul>

            <h2>Governor Election (Experimental)</h2>
            <ul>
                  <li><i><b>This is an experimental feature we’re adding to see what will happen when we give player the control to edit game parameter that affects every player in decentralized world.</b></i></li>
                  <li>Player can vote for a governor everyday, the highest voted player will become the governor at UTC 0:00. (If there’s a tie, the earliest  player that reach that vote count will win)</li>
                  <li>Governor will be able to adjust the % of dot you obtain from eating another player.
                  </li>
            </ul>
            <h2>Elimination Mode(Experimental)</h2>
            <ul>
                <li>To ensure the game will eventually come to an end,we added this feature </li>
                <li>Elimination mode will activate when all dots across all mazes are depleted yet we haven't triggered the ending condition, with the following changes:</li>
               <ul>
                  <li>&gt;If a pac got eaten, it loses 100% of dots.</li>
                  <li>&gt;When a pac got rob, each surrounding player will get 25% of dots.</li>
                  <li>&gt;Player with 0 dot will be eliminated immediately.</li>
               </ul>
            </ul>

            <h2>Future Seaons and collaborations?</h2>
            <ul>
              <li>We hope that our game can become a platform for other communities to distribute reward / whitelist to their most active members in a transparent, fun &  bonding way (also kinda proof-of-work).  Whales will have a good advantage,but the commons will have chance to climb to the top as well by collaborating, no one have enough power to decide the game unless they owns 50% of the NFT.</li>
              <li>We are open to invite other communites to join the game and we can both contribute something to the reward pool for future seasons! We may add new mechanism, adjust some parameter based to either speed-up or slow-down the game.</li>
              <li>Since the reward and game contracts are separate from the NFT contract,we have the flexibility to introduce different rewards, such as NFT from other communities, cash prizes in the next season.</li>
              <li>We are open to welcome other Shape NFT communities, like Deeple, Shapet, (for non-nft community we can help to distribute a soul-bound token if needed as a entrance ticket) to co-host a season or invite their NFT to join future phases and compete with PAC holders.Please reach out to us if it sounds interesting!</li>
            </ul>



          </div>
        </div>
      </div>
    </Layout>
  );
}
