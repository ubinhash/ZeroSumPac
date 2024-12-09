import React, { useEffect } from "react";
import { useNetwork } from "wagmi";

const ChainInfo = ({ onNetworkReady }) => {
  const { chain } = useNetwork();

  useEffect(() => {
    if (chain && onNetworkReady) {
      // Notify the parent when chain data is available
    //   onNetworkReady(chain)
      if(chain.id=='11011'){
        onNetworkReady('shape-sepolia');
      }
      if(chain.id=='360'){
        onNetworkReady('shape-mainnet');
      }
    }
  }, [chain, onNetworkReady]);

  return (<></>);
//   return (
//     <div>
//       <h2>Chain Info</h2>
//       {chain ? (
//         <p>Connected to: {chain.name} (ID: {chain.id})</p>
//       ) : (
//         <p>Not connected to any chain.</p>
//       )}
//     </div>
//   );
};

export default ChainInfo;
