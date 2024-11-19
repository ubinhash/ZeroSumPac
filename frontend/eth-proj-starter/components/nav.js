import React, { useState } from "react";
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from "./nav.module.css";
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
// npm install @fortawesome/react-fontawesome
//npm install @fortawesome/free-solid-svg-icons
//npm install @fortawesome/free-brands-svg-icons
export default function NavBar({ backgroundColor = '#ffffff50' ,children}) {
  const [click, setClick] = useState(false);
  const router = useRouter();
  const handleClick = () => setClick(!click);
  const navStyle = {
    backgroundColor: backgroundColor,
  };
  return (
    <div className={styles.grid}>
      <div className={`${styles.fixed} ${styles.center}`}>
        <img src="/icons/pac-right.png" className={styles.cornerIcon}
        />
      </div>
      <div className={styles.fixed}>
      <div className={styles.subGrid}>
        <div className={`${styles.cell} ${router.pathname === '/' ? styles.active : ''}`}>
              <Link style={{ textDecoration: 'none',color:"inherit" }} className={styles.link} exact href="/" 
                onClick={handleClick}>
                ZeroSumPac
              </Link>
        </div>
        <div className={`${styles.cell} ${router.pathname === '/art' ? styles.active : ''}`}>
            <Link style={{ textDecoration: 'none',color:"inherit" }} className={styles.link} exact href="/art" 
                onClick={handleClick}>
                Art
              </Link>
        </div>
        <div className={styles.cell}>Game</div>
        <div className={styles.cell}>RULES</div>
        <div className={styles.cell}>MINT</div>
        <div className={styles.walletcell}>
        <ConnectButton />
        </div>
    </div>
        
      </div>
      <div className={`${styles.fixed} ${styles.center}`}>
        <img src="/icons/pac-left.png" className={styles.cornerIcon}
        />
      </div>
      <div className={styles.fixed}></div>
      <div className={styles.main}>{children}</div>
      <div className={styles.fixed}></div>
      <div className={`${styles.fixed} ${styles.center}`}>
        <img src="/icons/dev.png" className={styles.cornerIcon2}
        />
      </div>
      <div className={styles.fixed}></div>
      <div className={`${styles.fixed} ${styles.center}`}>
        <img src="/icons/artist.png" className={styles.cornerIcon2}
        />
      </div>
    </div>
  );
}