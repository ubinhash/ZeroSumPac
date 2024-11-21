import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from './index.module.css';
import Link from 'next/link';
import { useState } from 'react';
export default function Home() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleFinePrint = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Layout home>
      <Head>
        <title>Title</title>
      </Head>
    <div className={styles.grid}>
      <div className={`${styles.section} ${styles.section1}`}>
          <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.leftTop}>
              <div className={styles.title}>
                 ZERO<br></br>SUM PACT
              </div>
              <div className={styles.subtitle}>A world that unites and divides</div>
            </div>
            <div className={styles.leftBottom}>
              <div className={styles.description}>
              <b>nft =&gt;</b> art on the scars of wars <br></br>
              <div className={styles.seperator}></div>
              <b>game(nft) =&gt;</b> a semi-collabrative strategy game where all players coordinate and compete for limited resources on a shared board. Inspired by Go and Pac-man.
              <div className={styles.seperator}></div>
              <b>game.append(shapers)=&gt;</b> welcome to join our world 
              <span onClick={toggleFinePrint} style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}> 
              &nbsp;&gt;&gt;&gt;
              </span>
            {isOpen && (
              <div className={styles.fineprint}>  We are open to co-host future season with other shape nft communities. Let's all bring something to the reward pool (items, special traits, whitelists) and have our holders compete in the same game. </div>
            )}
              </div>
              <Link href="/art">
              <button href="/art" className={styles.nextbutton}>Tell me more?</button>
              </Link>
            </div>
          </div>
          <div className={styles.right}>
          <div className={styles.imageContainer}>
            <img
              src="/images/1.png"
              alt="Layer 1"
              className={`${styles.image} ${styles.layer1}`}
            />
            <img
              src="/images/2.png"
              alt="Layer 2"
              className={`${styles.image} ${styles.layer2}`}
            />
            <img
              src="/images/3.png"
              alt="Layer 3"
              className={`${styles.image} ${styles.layer3}`}
            />
                <img
              src="/images/eyes.png"
              alt="Layer 3"
              className={`${styles.image} ${styles.layereyes}`}
            />
                <img
              src="/images/4.png"
              alt="Layer Raven"
              className={`${styles.image} ${styles.layer4}`}
            />
                   <img
              src="/images/5.png"
              alt="Soldier"
              className={`${styles.image} ${styles.layer5}`}
            />
            <div  className={`${styles.image} ${styles.layertext}`} > BUILT ON SHAPE </div>
   
            {/* <img src="/images/transparent.png" alt="none" className={`${styles.image} ${styles.layersquares}`}/>
            <img src="/images/transparent.png" alt="none" className={`${styles.image} ${styles.layersquares} ${styles.rotate1}`}/>
            <img src="/images/transparent.png" alt="none" className={`${styles.image} ${styles.layersquares} ${styles.rotate2}`}/> */}
          </div>


          </div>
        
          
       
        </div>
      </div>
    </div>


    </Layout>
  )
}
