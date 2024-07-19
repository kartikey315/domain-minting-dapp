"use client";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  DOMAIN_MINITING_ABI,
  DOMAIN_MINITING_ADDRESS,
} from "@/utils/constants";
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { config } from "@/context/Providers";
import { Address } from "viem";
import ClipLoader from "react-spinners/ClipLoader";

interface DashboardProps {
  domain: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  domain,
}: DashboardProps) => {
  const { address, isConnected } = useAccount();
  const [connectedWallets, setConnectedWallets] = useState<`0x${string}`[]>([]);
  const [availableWallets, setAvailableWallets] = useState<`0x${string}`[]>([]);
  const [connectLoading, setConnectLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const wallets = await readContract(config, {
        abi: DOMAIN_MINITING_ABI,
        address: DOMAIN_MINITING_ADDRESS,
        functionName: "getWalletsByDomain",
        args: [domain],
      });

      const points = await readContract(config, {
        abi: DOMAIN_MINITING_ABI,
        address: DOMAIN_MINITING_ADDRESS,
        functionName: "getPointsByDomain",
        args: [domain],
      });

      const walletList: any = wallets;
      const tempPoints: any = points;
      console.log(walletList);
      setConnectedWallets(walletList);
      setPoints(parseInt(tempPoints));
    };
    fetchData();
  }, [domain]);

  useEffect(() => {
    if (isConnected && address && connectedWallets.length > 0) {
      setAvailableWallets((prev) => {
        if (!connectedWallets.includes(address) && !prev.includes(address)) {
          return [...prev, address];
        }
        return prev;
      });
    } else {
      router.refresh();
    }
  }, [isConnected, address]);

  const handleConnectWallet = async () => {
    try {
      setConnectLoading(true);
      const { request } = await simulateContract(config, {
        abi: DOMAIN_MINITING_ABI,
        address: DOMAIN_MINITING_ADDRESS,
        functionName: "addWalletToDomain",
        args: [domain, address as Address],
      });
      const hash = await writeContract(config, request);

      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash,
      });
      console.log(transactionReceipt);
      window.alert("Wallet Connected Successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to add wallet", error);
      window.alert("Connect Wallet Failed " + error);
    } finally {
      setConnectLoading(false);
    }
  };

  console.log(connectedWallets);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Decentralized Domain Minting
      </h1>
      <div className="flex flex-col gap-2 items-center border border-white rounded-lg p-4">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Domain: {domain}
          </h2>
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Connected Wallets
          </h2>
          <ul className="list-disc pl-5">
            {connectedWallets.map((wallet, index) => (
              <li key={index} className="mb-2 text-white">
                {wallet}
              </li>
            ))}
          </ul>
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Available to Connect Wallets
          </h2>

          <ul className="list-disc pl-5">
            {availableWallets.map((wallet, index) => (
              <li key={index} className="mb-2 text-white">
                {wallet}
              </li>
            ))}
          </ul>
          <Button
            onClick={handleConnectWallet}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded mb-4"
            disabled={availableWallets.length == 0 ? true : false}
          >
            {connectLoading ? (
              <ClipLoader size="16px" />
            ) : (
              <div>Connect Wallet</div>
            )}
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4 flex text-center text-white">
            Total Points: {points}
          </h2>
        </div>
      </div>
    </div>
  );
};
