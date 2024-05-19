import { useEffect } from 'react';
import { type BaseError, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseAbi, toHex } from 'viem';

export interface WriteContractData {
  chainId: number,
  address: `0x{string}`,
  abi: string[],
  functionName: string,
  args: any[]
}


export function WriteContract(data: WriteContractData & { callback: string }) {
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const account = useAccount()

  const callback = (result: { hash?: `0x${string}`, error?: any, confirmed?: boolean }) => {
    fetch(data.callback, {
      mode:  'no-cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    })
  }

  useEffect(() => {
    if (!account.chainId) {
      return;
    }
    if (account.chainId === data.chainId) {
      return;
    }
    const provider = window.ethereum;
    if(!provider){
      console.log("Metamask is not installed, please install!");
    }
    provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: toHex(data.chainId) }],
    });
  }, [account])

  async function submit() {
    writeContract({
      address: data.address,
      abi: parseAbi(data.abi),
      functionName: data.functionName,
      args: data.args,
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    if (hash) {
      callback({ hash })
    }
    if (error) {
      callback({ error })
    }
    if (isConfirmed) {
      callback({ confirmed: true })
    }
  }, [hash, error, isConfirmed])


  const StatusPanel = () => {
    return (
      <div className="container transactionStatus">
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="stack">
          <div className="buttonContainer">
            <button className="transcationButton" disabled={isPending} onClick={submit}>
              {isPending ? 'Confirming...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
      { (hash || isConfirming || isConfirmed || error) && <StatusPanel /> }
    </>
  )
}
