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
  sendEvent: (event: any)=>void
}

export function SignMessage(props: SignMessageProps) {
  const { domain, primaryType, types, message, onCallbackError, sendEvent } = props;
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
      sendEvent({ hash })
    }
    if (error) {
      sendEvent({ error })
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

