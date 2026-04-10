"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useSendTransaction, useBalance } from "wagmi";
import { parseEther } from "viem";
import Modal from "@/components/ui/Modal";
import { CopyButton } from "@/components/ui/CopyButton";
import { useTranslation } from "react-i18next";

const EVM_ADDRESS = "0xf09bA63D240Fb5144717CdD1b8375a1025F9Fa10";

const CRYPTO = [
  { name: "Ethereum",  symbol: "ETH", address: EVM_ADDRESS,                                       deeplink: (a: string) => `ethereum:${a}`, evm: true  },
  { name: "Bitcoin",   symbol: "BTC", address: "bc1qdmwq3ekcxmk7cewvxjmru8qg4m9x9qrkmacc8a",     deeplink: (a: string) => `bitcoin:${a}`,  evm: false },
  { name: "Solana",    symbol: "SOL", address: "Erv8bUB1aB4wwYSj9Vh3HLAY3LMoLmTHQNmp6s52pxK4",  deeplink: (a: string) => `solana:${a}`,   evm: false },
  { name: "Linea",     symbol: "ETH", address: EVM_ADDRESS,                                       deeplink: (a: string) => `ethereum:${a}`, evm: true  },
  { name: "Base",      symbol: "ETH", address: EVM_ADDRESS,                                       deeplink: (a: string) => `ethereum:${a}`, evm: true  },
  { name: "BNB Chain", symbol: "BNB", address: EVM_ADDRESS,                                       deeplink: (a: string) => `ethereum:${a}`, evm: true  },
  { name: "Tron",      symbol: "TRX", address: "THd6HJYV442wtt9ji87rSCZQBnPvv6BhYq",             deeplink: (a: string) => `tron:${a}`,     evm: false },
] as const;

const AMOUNTS = ["0.001", "0.005", "0.01", "0.05"];

function EvmDonate() {
  const { t } = useTranslation();
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { data: balance } = useBalance({ address: address as `0x${string}` | undefined });
  const { sendTransaction, isPending, isSuccess, isError } = useSendTransaction();
  const [amount, setAmount] = useState("0.005");

  if (!isConnected) {
    return (
      <div className="mt-3 flex flex-col items-center gap-3">
        <p className="text-xs text-zinc-500">{t("sponsors.connectToSend")}</p>
        <button
          onClick={() => open()}
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        >
          {t("sponsors.connectWallet")}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center justify-between">
        {balance && (
          <p className="text-xs text-zinc-500">
            {t("sponsors.balance")}: <span className="text-zinc-300">{parseFloat(balance.formatted).toFixed(4)} {balance.symbol}</span>
          </p>
        )}
        <button onClick={() => open()} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-auto">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => setAmount(a)}
            className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
              amount === a
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                : "bg-white/5 border border-white/8 text-zinc-400 hover:text-white"
            }`}
          >
            {a} ETH
          </button>
        ))}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.001"
          min="0.0001"
          className="w-24 rounded-md border border-white/8 bg-white/5 px-2 py-1 text-xs text-white focus:border-emerald-500/40 focus:outline-none"
          placeholder="custom"
        />
      </div>
      <button
        onClick={() => sendTransaction({ to: EVM_ADDRESS as `0x${string}`, value: parseEther(amount) })}
        disabled={isPending}
        className="w-full rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-4 py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? t("sponsors.sending") : `${t("sponsors.send")} ${amount} ETH`}
      </button>
      {isSuccess && <p className="text-xs text-emerald-400 text-center">✓ {t("sponsors.txSuccess")}</p>}
      {isError   && <p className="text-xs text-red-400 text-center">✗ {t("sponsors.txError")}</p>}
    </div>
  );
}

interface DonateModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DonateModal({ open, onClose }: DonateModalProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const coin = CRYPTO[selected];

  return (
    <Modal open={open} onClose={onClose} title={t("sponsors.donateTitle")}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {CRYPTO.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setSelected(i)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selected === i
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                  : "bg-white/5 border border-white/8 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex gap-4 items-start">
          <div className="shrink-0 rounded-xl border border-white/10 bg-white p-2.5">
            <QRCodeSVG value={coin.deeplink(coin.address)} size={110} bgColor="#ffffff" fgColor="#000000" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <p className="text-[10px] text-zinc-600 mb-0.5">{t("sponsors.network")}</p>
              <p className="text-sm font-medium text-white">{coin.name} <span className="text-zinc-500 text-xs">({coin.symbol})</span></p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 mb-0.5">{t("sponsors.address")}</p>
              <p className="text-[11px] font-mono text-zinc-400 break-all leading-relaxed">{coin.address}</p>
            </div>
            <div className="flex gap-2">
              <CopyButton
                textToCopy={coin.address}
                successMessage={t("sponsors.cryptoCopied")}
                className="flex-1 rounded-lg border border-white/8 bg-white/5 px-2 py-1.5 text-xs text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors text-center"
              >
                {t("common.copy")}
              </CopyButton>
              <a
                href={coin.deeplink(coin.address)}
                className="flex-1 rounded-lg border border-white/8 bg-white/5 px-2 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors text-center"
              >
                {t("sponsors.openWallet")}
              </a>
            </div>
          </div>
        </div>

        {coin.evm && <EvmDonate />}

        <p className="text-[10px] text-zinc-600 text-center">{t("sponsors.qrHint")}</p>
      </div>
    </Modal>
  );
}
