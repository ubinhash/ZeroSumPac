import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from './index.module.css';
import Link from 'next/link';
export default function Home() {

  const mainStyle = {

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
            </div>
            <div className={styles.leftBottom}>
              <div className={styles.description}>
              <b>(art)=&gt;</b> a reflective journey on the scars of wars <br></br>
              <div className={styles.seperator}></div>
              <b>(game)=&gt;</b> a semi-collabrative strategy game that mirrors our insatiable world of endless conflicts.
              <div className={styles.seperator}></div>
              <b>(shaper)=&gt;</b> welcome to join our world
              </div>
              <Link href="/art">
              <button href="/art" className={styles.nextbutton}>Tell me more?</button>
              </Link>
            </div>
          </div>
        
            <img
              src="/images/frontpage.png"
              alt="Description"
              className={styles.image}
            />
       
        </div>
      </div>
    </div>


    </Layout>
  )
}
