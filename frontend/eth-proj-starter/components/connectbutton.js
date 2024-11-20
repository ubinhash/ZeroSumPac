import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './connectbutton.module.css';
export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className={styles.wrapper}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button"
                    className={styles.mybutton}
                  > 
                   <span className={`${styles.dot} ${styles.dotleft}`}></span>
                    Connect Wallet
                    <span className={`${styles.dot} ${styles.dotright}`}></span>
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button"
                  className={styles.mybutton}>
                    Wrong network
                  </button>
                );
              }
              return (
                <div   className={styles.wrapper} >
                    <div  className={styles.innerwrapper} >
                        <button
                            onClick={openChainModal}
                            className={styles.mybutton}
                            type="button"
                        >
                            {chain.hasIcon && (
                           <span className={styles.iconWrapper}>
                                {chain.iconUrl && (
                                    <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    className={styles.icon}
                                    />
                                )}
                         </span>
                            )}
                            {chain.name}
                        </button>
                    </div>
                    <div className={styles.innerwrapper} >
                        <button onClick={openAccountModal}
                        className={styles.mybutton}
                        type="button"> {account.displayName}</button>
                   </div>
                    <div className={styles.innerwrapper} >
                        {account.displayBalance
                      ? ` ${account.displayBalance}`
                      : ''}
                    </div>
                  
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};