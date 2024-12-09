import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from './mint.module.css';
import MintComponent from '../components/MintComponent/mint';
import PopupMessage from '../components/GameComponent/popup.js';
import React, { useState,useEffect } from 'react';
export default function MintPage() {

    const [popupMsg,setPopupMsg]=useState("")
  return (
    <Layout home>
      <Head>
        <title>Mint</title>
      </Head>
    <div className={styles.grid}>
      <div className={`${styles.section} ${styles.section1}`}>
                
                <PopupMessage msg={popupMsg} setMsg={setPopupMsg}></PopupMessage>
                <MintComponent setPopupMsg={setPopupMsg}></MintComponent>
      </div>
    </div>


    </Layout>
  )
}
