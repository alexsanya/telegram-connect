import { useEffect, useState } from 'react'
import { useSignTypedData } from 'wagmi'

interface Domain {
  name: string,
  version: string,
  chainId: number,
  verifyingContract: `0x${string}`
}

export interface SignMessageProps {
  domain: Domain,
  primaryType: string,
  types: any,
  message: any,
  uid: string,
  sendEvent: (event: any)=>void
}

export function SignMessage(props: SignMessageProps) {
  const { domain, primaryType, types, message, sendEvent } = props;
  const { signTypedData } = useSignTypedData();
  const [ error, setError ] = useState<any>();
  const [ hash, setHash ] = useState<`0x${string}`>();


  const signMessage = () => {
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
          <div>Error: {error.shortMessage || error.message}</div>
        )}
      </div>
    )
  }

  useEffect(() => {
    if (hash) {
      return sendEvent({ hash })
    }
    if (error) {
      return sendEvent({ error })
    }
  }, [hash, error])



  return (
    <>
      <div className="container">
        <div className="stack">
          <div className="buttonContainer">
            <button className="transcationButton" onClick={signMessage}>
              Sign message
            </button>
          </div>
        </div>
      </div>
      { (hash || error) && <StatusPanel /> }
    </>
  )

}

