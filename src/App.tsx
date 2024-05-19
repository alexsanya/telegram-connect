import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { WriteContract, WriteContractData } from './components/WriteContract';
import { Account } from './components/Account';
import { Connect } from './components/Connect';
import ReactJson from 'react-json-view';
import { getSchemaError } from './utils';

export default function App() {
  const { isConnected } = useAccount();
  const [ transactionData, setTransactionData ] = useState<WriteContractData>();
  const [ callbackEndpoint, setCallbackEndpoint ] = useState('');
  const [ schemaError, setSchemaError ] = useState<any>(false);
  const [ callbackError, setCallbackError ] = useState<any>();

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const source = queryParameters.get("source") as string;
    setCallbackEndpoint(queryParameters.get("callback") as string);
    fetch(source)
      .then(response => response.json())
      .then(data => {
          const error = getSchemaError(data)
          if (error) {
            setSchemaError(error)
          } else {
            setTransactionData(data)
          }
      })
      .catch(error => {
        setSchemaError(error)
      })

  }, [])

  const onCallbackError = (error: any) => {
    setCallbackError(error)
  }

  return (
    <>
      {isConnected && !schemaError && <Account />}
      {!isConnected && !schemaError && <Connect />}
      {isConnected && !schemaError && transactionData && 
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
            onCallbackError={onCallbackError}
          />}
        </>
      }
      {
        schemaError &&
        <div className="container parsingError">
          <div>Source doesnt match schema</div>
          <ReactJson src={schemaError} collapsed theme="monokai" />
        </div>
      }
      {
        callbackError &&
        <div className="container callbackError">
          <div>There was an error during callback request to {callbackEndpoint}</div>
          <ReactJson src={callbackError} collapsed theme="monokai" />
        </div>
      }

    </>
  );
}
