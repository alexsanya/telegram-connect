import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { WriteContract, WriteContractData } from './components/WriteContract';
import { Account } from './components/Account';
import { Connect } from './components/Connect';
import ReactJson from 'react-json-view';

export default function App() {
  const { isConnected } = useAccount();
  const [ transactionData, setTransactionData ] = useState<WriteContractData>();
  const [ callbackEndpoint, setCallbackEndpoint ] = useState('');

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const source = queryParameters.get("source") as string;
    setCallbackEndpoint(queryParameters.get("callback") as string);
    fetch(source)
      .then(response => response.json())
      //TODO Validate schema
      .then(data => {
          setTransactionData(data)
      });

  }, [])

  return (
    <>
      {isConnected ? <Account /> : <Connect />}
      {isConnected && transactionData &&
        <>
          <div className="container">
            <ReactJson src={transactionData} collapsed theme="monokai" />
          </div>
          {transactionData && <WriteContract
            chainId={transactionData.chainId}
            address={transactionData.address}
            abi={transactionData.abi}
            functionName={transactionData.functionName}
            args={transactionData.args}
            callback={callbackEndpoint}
          />}
        </>
      }
    </>
  );
}
