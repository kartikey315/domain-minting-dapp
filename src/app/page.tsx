"use client";

import { config } from "@/context/Providers";
import { useIsMounted } from "@/hooks/useIsMounted";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { readContract } from "@wagmi/core";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  DOMAIN_MINITING_ABI,
  DOMAIN_MINITING_ADDRESS,
} from "@/utils/constants";
import { Address } from "viem";
import { MintDomain } from "@/components/mintDomain";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  const { isConnected, address } = useAccount();
  const isMounted = useIsMounted();
  const [domain, setDomain] = useState<string>();

  useEffect(() => {
    const fetchDomain = async () => {
      const domain = await readContract(config, {
        abi: DOMAIN_MINITING_ABI,
        address: DOMAIN_MINITING_ADDRESS,
        functionName: "getDomainByWallet",
        args: [address as Address],
      });
      if (domain != "") {
        console.log("check");
        setDomain(domain);
      }
    };

    if (isConnected && address) {
      fetchDomain();
    }
  }, [address, isConnected]);

  console.log(domain);

  if (!isMounted) return null;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <Fragment>
          {!isConnected && <ConnectButton />}
          {isConnected && domain && <Dashboard domain={domain} />}
          {isConnected && !domain && <MintDomain />}
        </Fragment>
      </div>
    </main>
  );
}
