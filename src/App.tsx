import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { WriteContract, WriteContractData } from './components/WriteContract';
import { SignMessage, SignMessageProps } from './components/SignMessage';
import { Account } from './components/Account';
import { Connect } from './components/Connect';
import ReactJson from 'react-json-view';
import { getSchemaError, sendEvent } from './utils';

export default function App() {
  const { isConnected } = useAccount();
  const [ transactionData, setTransactionData ] = useState<WriteContractData>()
  const [ signMessageData, setSignMessageData ] = useState<SignMessageProps>();
  const [ callbackEndpoint, setCallbackEndpoint ] = useState('');
  const [ schemaError, setSchemaError ] = useState<any>(false);
  const [ callbackError, setCallbackError ] = useState<any>();
  const [ uid, setUid ] = useState<string | undefined>();
  const [ operationType, setOperationType ] = useState<string>("");
  const [ botName, setBotName ] = useState<string>("");

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const source = queryParameters.get("source") as string;
    setBotName(queryParameters.get("botName") as string);
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
            actionType === "signature" ? setSignMessageData(data) : setTransactionData(data)
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
      {isConnected && !schemaError && <Account botName={botName}/>}
      {!isConnected && !schemaError && <Connect />}
      {isConnected && !schemaError && (transactionData || signMessageData) && 
        <>
          {(operationType === "transaction") && transactionData && uid &&
          <>
            <div className="container">
              <ReactJson src={transactionData} collapsed theme="monokai" />
            </div>
            <WriteContract
              uid={uid}
              chainId={transactionData.chainId}
              address={transactionData.address}
              abi={transactionData.abi}
              functionName={transactionData.functionName}
              args={transactionData.args}
              sendEvent={(data: any) => sendEvent(uid, callbackEndpoint, onCallbackError, {...data , transaction: true })}
            />
          </>
          }
          {(operationType === "signature") && signMessageData && uid &&
          <>
            <div className="container">
              <ReactJson src={signMessageData} collapsed theme="monokai" />
            </div>
            <SignMessage
              uid={uid}
              domain={signMessageData.domain}
              primaryType={signMessageData.primaryType}
              types={signMessageData.types}
              message={signMessageData.message}
              sendEvent={(data: any) => sendEvent(uid, callbackEndpoint, onCallbackError, {...data, signature: true })}
            />
          </>
          }

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
