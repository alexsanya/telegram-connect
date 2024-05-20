import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { WriteContract, WriteContractData } from './components/WriteContract';
import { SignMessage } from './components/SignMessage';
import { Account } from './components/Account';
import { Connect } from './components/Connect';
import ReactJson from 'react-json-view';
import { getSchemaError, sendEvent } from './utils';

export default function App() {
  const { isConnected } = useAccount();
  const [ operationData, setOperationData ] = useState<WriteContractData>();
  const [ callbackEndpoint, setCallbackEndpoint ] = useState('');
  const [ schemaError, setSchemaError ] = useState<any>(false);
  const [ callbackError, setCallbackError ] = useState<any>();
  const [ uid, setUid ] = useState<string | undefined>();
  const [ operationType, setOperationType ] = useState<string>("");

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const source = queryParameters.get("source") as string;
    setUid(queryParameters.get("uid") as string);
    setCallbackEndpoint(queryParameters.get("callback") as string);

    const actionType = queryParameters.get("type") === "signature" ? "signature" : "transaction";
    setOperationType(actionType);


    fetch(source)
      .then(response => response.json())
      .then(data => {
          const error = getSchemaError(actionType, data)
          if (error) {
            setSchemaError(error)
          } else {
            setOperationData(data)
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
      {isConnected && !schemaError && operationData && 
        <>
          <div className="container">
            <ReactJson src={operationData} collapsed theme="monokai" />
          </div>
          {(operationType === "transaction") && operationData && uid && <WriteContract
            uid={uid}
            chainId={operationData.chainId}
            address={operationData.address}
            abi={operationData.abi}
            functionName={operationData.functionName}
            args={operationData.args}
            sendEvent={(data: any) => sendEvent(uid, callbackEndpoint, onCallbackError, data)}
          />}
          {(operationType === "signature") && operationData && uid && <SignMessage
            uid={uid}
            domain={operationData.domain}
            primaryType={operationData.primaryType}
            types={operationData.types}
            message={operationData.message}
            callback={callbackEndpoint}
            onCallbackError={onCallbackError}
          />}

        </>
      }
      {
        schemaError &&
        <div className="container parsingError">
          <div>Source doesnt match schema</div>
          <ReactJson src={JSON.parse(JSON.stringify(schemaError))} collapsed theme="monokai" />
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
