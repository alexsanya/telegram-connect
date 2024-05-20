import { useEffect, useState } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'

interface Domain {
  name: string,
  version: string,
  chainId: number,
  verifyingContract: string
}

interface SignMessageProps {
  domain: Domain,
  primaryType: string,
  types: any,
  message: any,
  uid: string,
  callback: string,
  onCallbackError: (error: any)=>void
}

export function SignMessage(props: SignMessageProps) {
  const { domain, primaryType, types, message, onCallbackError } = props;
  const { signTypedData } = useSignTypedData();
  const [ error, setError ] = useState();
  const [ hash, setHash ] = useState();

  const signFMessage = () => {
    signTypedData({
        domain,
        primaryType,
        types,
        message
      },
      {
        onError: error => setError(error),
        onSuccess: hash => setHash(hash)
      }
    );
  }

  const callback = (result: { hash?: `0x${string}`, error?: any }) => {

    const xhr = new XMLHttpRequest();
    xhr.open("POST", props.callback, true);
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
        } else {
          console.error(xhr.statusText);
          onCallbackError({
            status: xhr.status,
            text: xhr.statusText
          });
        }
      }
    };
    xhr.onerror = () => {
      console.error(xhr.statusText);
      props.onCallbackError({
        status: xhr.status,
        text: xhr.statusText
      });
    };
    xhr.send(JSON.stringify({
      ...result,
      uid: props.uid
    }));

  }

  const StatusPanel = () => {
    return (
      <div className="container signatureStatus">
        {hash && <div>Signature hash: {hash}</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    )
  }

  useEffect(() => {
    if (hash) {
      callback({ hash })
    }
    if (error) {
      callback({ error })
    }
  }, [hash, error])

  return (
    <>
      <div className="container">
        <div className="stack">
          <div className="buttonContainer">
            <button className="transcationButton" onClick={signFMessage}>
              Sign message
            </button>
          </div>
        </div>
      </div>
      { (hash || error) && <StatusPanel /> }
    </>
  )

}

