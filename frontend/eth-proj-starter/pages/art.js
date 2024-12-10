import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from './art.module.css';
export default function Home() {

  const back_text=["Infinite","greed","leads","to","Dead-End","Collaboration","is","the","key"];
  return (
    <Layout home>
      <Head>
        <title>Title</title>
      </Head>
    <div className={styles.grid}>
      <div className={`${styles.section} ${styles.section1}`}>
      <div className={styles.section1_left}>
            <div className={styles.section1_title}>
              ART, <br />
              VISION, <br />
              INTENT
            </div>
            <div className={styles.section1_wallOfText}>
              <div className={styles.section1_question}>What is ZERO-SUM-PAC(T)?</div>
              <ul>
                <li>It's an <span className={styles.highlight}> art collection</span> on war</li>
                <li>It's large-scale <span className={styles.highlight2}> strategy board game </span></li>
                <li>It’s a <span className={styles.highlight3}>  reflection on our world</span> entangled in war, of how boundless greed and finite resources drives conflict and division.</li>
                <li>The choice to collaborate or consume one another, is in the player's hands.</li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className={styles.section1_right}>
            {/* Grid of images */}
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className={styles.section1_card}>
              <div className={styles.section1_cardContent}>
                <div className={styles.section1_front}>
                  <img
                    src={`images/nft/pfp/${index + 1}.jpg`} /* Update with actual image paths */
                    alt={`Image ${index + 1}`}
                    className={styles.section1_image}
                  />
                </div>
                <div className={styles.section1_back}>
                  <p>{back_text[index]}</p>
                </div>
              </div>
            </div>
            ))}
          </div>
      </div>
      <div className={`${styles.section} ${styles.section2}`}>
      <div className={styles.section2_left}>
          <div className={styles.section2_text}>
            <h3>ARTIST</h3>
            The collection is created by a talented artist Kikuchi Nami, whom had experience working for a few gaming company.
            <br></br>
            <br></br>
            Growing up between Japan and China,the unresolved scars of the historical conflict that once torn these nations apart still echos in her daily life.
            <br></br>
            <br></br>
            In this collection, The artist aim to explore on the theme “scars of wars”. 
            <br></br><br></br>
            Each trait is carefuly crafted facet of 
            war: shattered childhood, seperated family, inflation, greed and gluttony. 

            <h3>INSPIRATION</h3>
            Our design process began with the Shape's minimalistic black circle logo. After realizing it resembled a Pac-Man with a closed mouth, the concept evolved into a Pac-like figure. It's also a perfect symbol for the insatiable appetite for resources which is the root of conflicts.
            <h3>MESSAGE</h3>

            The theme for shapecraft is bringing the "worlds" togethers. We hope that it's not only for the creative world we built, but also the literal worlds we inhabit.
            <br></br>        <br></br>
            By building a competitive-collaborative strategy game, we hope our game and art works in sychrony to bring the community together and help people reflect on the increasingly divided world we are living in.
            <br></br>        <br></br>
            While selfish actors may find locally optimal solutions, sometimes you have to work with others to escape from the local optimal, for a better reward.
          </div>
        </div>
        <div className={styles.section2_right}>
            <div className={styles.section1_title}>
              ARTIST, <br />
              BACKGROUND, <br />
              INSPIRATION
            </div>
            {/* <div className={styles.section2_right_bottom}><img
                    src={`images/nft/pfp/1.jpg`}
                    className={styles.section2_image}
                  />
            </div> */}
        </div>
      </div>
      <div className={`${styles.section} ${styles.section3}`}>
        <div className={styles.section3_left}>
          <h1 className={styles.section3_title}>One On One & Rarity</h1>
          <div className={styles.section3_text}>
 
          <li>There are 555 NFT in total, 66 will be animated.</li>

          <li>There’s a rare <span className={styles.highlight}>“revolving trait” </span>solely <span className={styles.highlight4}> earnable from game.</span></li>

          <li>There are 10 <span className={styles.highlight2}>one of one </span> in total, solely <span className={styles.highlight4}> earnable from game.</span></li>

          <li> There is 1 <span className={styles.highlight3}>god tier nft</span> , in which you can ask artist to design custom trait for you , solely <span className={styles.highlight4}> earnable from game.</span></li>
              
          <li>Percentage of mint fund also goes to the reward pool. <span className={styles.highlight4}>It will be distributed to players in different ways depnding on the game ending.</span></li>
          </div>
        </div>
  
          <div className={styles.section3_right}>
            <div className={styles.section3_imageContainer}>
              <div className={styles.section3_imageItem}>
                <img src="images/nft/oneone/1.gif" alt="Image 1" />
                <div className={styles.section3_imageTitle}>"THE UN-BORN"</div>
              </div>
              <div className={styles.section3_imageItem}>
                <img src="images/nft/oneone/2.gif" alt="Image 2" />
                <div className={styles.section3_imageTitle}>"Liberty"</div>
              </div>
              <div className={styles.section3_imageItem}>
                <img src="images/nft/oneone/3.jpg" alt="Image 3" />
                <div className={styles.section3_imageTitle}>"PAC-PLE"</div>
                <div className={styles.section3_fineprint}>In Tribute to Deekay's Deeple</div>
              </div>
              <div className={styles.section3_imageItem}>
                <img src="images/nft/oneone/4.jpg" alt="Image 4" />
                <div className={styles.section3_imageTitle}>"PAC-TOM"</div>
                <div className={styles.section3_fineprint}>In Tribute to Golid's OTOM</div>
              </div>
              
            </div>
            <div className={styles.section3_more}>and more...</div>
            
          </div>
      </div>
    </div>


    </Layout>
  )
}
