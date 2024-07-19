"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { config } from "@/context/Providers";
import {
  DOMAIN_MINITING_ABI,
  DOMAIN_MINITING_ADDRESS,
} from "@/utils/constants";
import {
  readContract,
  waitForTransactionReceipt,
  simulateContract,
  writeContract,
} from "@wagmi/core";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

export const MintDomain = () => {
  const { isConnected, address } = useAccount();
  const [domain, setDomain] = useState("");
  const [available, setAvailable] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const router = useRouter();

  const handleMintDomain = async () => {
    try {
      if (domain == "") {
        window.alert("Enter Domain Name");
        return;
      }
      setMintLoading(true);
      const { request } = await simulateContract(config, {
        abi: DOMAIN_MINITING_ABI,
        address: DOMAIN_MINITING_ADDRESS,
        functionName: "mintDomain",
        args: [domain],
      });
      const hash = await writeContract(config, request);

      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash,
      });

      console.log(transactionReceipt);
      window.alert("Domain Successfully Minted");
      window.location.reload();
    } catch (error) {
      console.error("Failed to mint domain", error);
      window.alert("Domain Minting Failed " + error);
    } finally {
      setMintLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    if (domain == "") {
      window.alert("Enter Domain Name");
      return;
    }
    const result = await readContract(config, {
      abi: DOMAIN_MINITING_ABI,
      address: DOMAIN_MINITING_ADDRESS,
      functionName: "domainExists",
      args: [domain],
    });
    if (!result) {
      window.alert("Domain Name is Available");
    } else {
      window.alert("Domain Name is Not Available");
    }

    setAvailable(!result);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Mint Your Unique Domain
      </h2>
      <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter domain name"
        className="border p-2 mb-4 w-full rounded-md"
      />
      <Button
        onClick={handleCheckAvailability}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-2"
      >
        Check Availability
      </Button>
      <Button
        onClick={handleMintDomain}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        disabled={!available}
      >
        {mintLoading ? <ClipLoader size="16px" /> : <div>Mint Domain</div>}
      </Button>
    </div>
  );
};
