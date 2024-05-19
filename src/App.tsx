import { useAccount } from 'wagmi';
import { WriteContract } from './components/WriteContract';
import { Account } from './components/Account';
import { Connect } from './components/Connect';
import ReactJson from 'react-json-view';

const transaction = {
  chainId: 324,
  address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
  abi: [
    'function approve(address spender, uint256 value)'
  ],
  functionName: 'approve',
  args: [
    '0x4a89caAE3daf3Ec08823479dD2389cE34f0E6c96',
    456
  ]
}

export default function App() {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? <Account /> : <Connect />}
      {isConnected &&
        <>
          <div className="container">
            <ReactJson src={transaction} collapsed theme="monokai" />
          </div>
          <WriteContract
            chainId={transaction.chainId}
            address={transaction.address}
            abi={transaction.abi}
            functionName={transaction.functionName}
            args={transaction.args}
          />
        </>
      }
    </>
  );
}
