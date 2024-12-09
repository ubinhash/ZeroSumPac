import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from './rules.module.css';
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
        <h1>Section 2</h1>
      </div>
      <div className={`${styles.section} ${styles.section2}`}>
        <h1>Section 2</h1>
      </div>
      <div className={`${styles.section} ${styles.section3}`}>
        <h1>Section 3</h1>
      </div>
    </div>


    </Layout>
  )
}
