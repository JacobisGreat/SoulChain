'use client';
import React from 'react';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { soulChainABI, soulChainAddress } from '../../lib/soulchain';

const getTimeRemaining = (lastPing: number, timeout: number) => {
  const expireTime = lastPing + timeout;
  const secondsLeft = expireTime - Math.floor(Date.now() / 1000);
  if (secondsLeft <= 0) return '🕳 Inactive';
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

export default function Home() {
  const { isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const { data: lastPing } = useReadContract({
    address: soulChainAddress,
    abi: soulChainABI,
    functionName: 'lastPing',
  });

  const { data: timeout } = useReadContract({
    address: soulChainAddress,
    abi: soulChainABI,
    functionName: 'timeout',
  });

  const [wallets, setWallets] = useState(['']);
  const [percentages, setPercentages] = useState(['']);

  const handlePing = () => {
    writeContract({
      address: soulChainAddress,
      abi: soulChainABI,
      functionName: 'ping',
    });
  };

  const handleTrigger = () => {
    writeContract({
      address: soulChainAddress,
      abi: soulChainABI,
      functionName: 'triggerAfterlife',
    });
  };

  const handleSetBeneficiaries = () => {
    const walletAddrs = wallets.map(w => w.trim());
    const percents = percentages.map(p => parseInt(p.trim()));
    writeContract({
      address: soulChainAddress,
      abi: soulChainABI,
      functionName: 'setBeneficiaries',
      args: [walletAddrs, percents],
    });
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">🧬 SoulChain</h1>
      <ConnectButton />

      {isConnected && (
        <>
          <button onClick={handlePing} className="px-4 py-2 bg-blue-600 text-white rounded">
            Ping 👋
          </button>

          <button onClick={handleTrigger} className="px-4 py-2 bg-red-600 text-white rounded">
            Trigger Afterlife 💀
          </button>

          <div>
            <p><strong>Last Ping:</strong> {lastPing?.toString()}</p>
            <p><strong>Timeout:</strong> {timeout?.toString()}s</p>
            {lastPing && timeout && (
              <p>⏳ Time remaining: {getTimeRemaining(Number(lastPing), Number(timeout))}</p>
            )}
          </div>

          <div className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold">Set Beneficiaries</h2>
            {wallets.map((_, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder="Wallet address"
                  value={wallets[i]}
                  onChange={(e) => {
                    const copy = [...wallets];
                    copy[i] = e.target.value;
                    setWallets(copy);
                  }}
                  className="p-2 border w-full"
                />
                <input
                  placeholder="e.g. 5000 = 50%"
                  value={percentages[i]}
                  onChange={(e) => {
                    const copy = [...percentages];
                    copy[i] = e.target.value;
                    setPercentages(copy);
                  }}
                  className="p-2 border w-40"
                />
              </div>
            ))}
            <button
              onClick={() => {
                setWallets([...wallets, '']);
                setPercentages([...percentages, '']);
              }}
              className="px-3 py-1 bg-gray-700 text-white rounded"
            >
              + Add More
            </button>

            <button
              onClick={handleSetBeneficiaries}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit Will 📜
            </button>
          </div>
        </>
      )}
    </main>
  );
}
