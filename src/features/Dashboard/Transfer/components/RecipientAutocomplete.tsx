import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Pressable, ScrollView, Keyboard, Text as RNText } from "react-native";
import { Controller, type Control } from "react-hook-form";
import { TextInput } from "@/components/TextInput";
import { AccountAvatar } from "@/components/Account/Avatar";
import { Address, composeApi } from "@signumjs/core";

import { recipientsStore } from "@/states/recipientsStore";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";

type Size = "small" | "medium" | "large";

type RecipientAutocompleteProps = {
  control: Control<any>;
  name: string;
  placeholder?: string;
  size?: Size;
  maxSuggestions?: number;
};

type ListItem = {
  key: string;
  isOwn: boolean;
  accountId: string;   // numeric id (String) -> AccountAvatar
  rs: string;          // RS address
  title?: string;      // wallet name (own) or loaded name (foreign)
  description: string; // src44 description ("" if unknown)
  loading: boolean;
};

function isNumericAddress(v: string) {
  return /^[0-9]+$/.test(v);
}
function trimName(name?: string, max = 30) {
  const n = (name ?? "").trim();
  return n.length > max ? `${n.slice(0, max)}…` : n;
}

export const RecipientAutocomplete: React.FC<RecipientAutocompleteProps> = ({
  control,
  name,
  placeholder,
  size = "medium",
  maxSuggestions = 20,
}) => {
  const { accounts, activeAccount, accountWalletNames } = useAccountStore();
  const { currentNetwork, activeNodeHost } = useNodeHostStore();
  const nodeUrl = activeNodeHost?.url;

  const prefix = currentNetwork === "testnet" ? "TS" : "S";
  const getRecent = recipientsStore((s) => s.getRecent); // read-only

  // Own secured accounts (excluding active one) – title = walletName from store
  const ownAccountItems: ListItem[] = useMemo(() => {
    const entries = Object.entries(accounts ?? {});
    return entries
      .filter(([publicKey, acc]: any) => {
        if (publicKey === activeAccount) return false;
        try {
          return acc?.[currentNetwork]?.isSecured === true;
        } catch {
          return false;
        }
      })
      .map(([publicKey, acc]: any) => {
        const addr = Address.fromPublicKey(publicKey, prefix);
        const rs = addr.getReedSolomonAddress();
        const numericId = String(addr.getNumericId());

        // Wallet name exclusively from the store
        const walletNameFromStore = (acc?.walletName ?? "").trim();
        const title = walletNameFromStore || undefined;

        const description: string = acc?.[currentNetwork]?.description || "";
        const isSecured = acc?.[currentNetwork]?.isSecured === true;

        return {
          key: `own:${publicKey}`,
          isOwn: true,
          accountId: numericId,
          rs,
          title,           // shown on top if available
          description,     // for AccountAvatar (src44)
          loading: !isSecured,
        } as ListItem;
      });
    // Recomputed whenever any wallet name changes
  }, [accounts, activeAccount, currentNetwork, prefix, accountWalletNames]);

  // 8 most recent (read-only, RS + numeric derived)
  const recentItemsRaw = useMemo(() => {
    const recent = getRecent(8);
    const items: { rs: string; accountId: string }[] = [];
    for (const r of recent) {
      try {
        if (isNumericAddress(r.address)) {
          const addr = Address.fromNumericId(r.address, prefix);
          items.push({ rs: addr.getReedSolomonAddress(), accountId: String(addr.getNumericId()) });
        } else {
          const addr = Address.create(r.address);
          items.push({ rs: addr.getReedSolomonAddress(), accountId: String(addr.getNumericId()) });
        }
      } catch {
        // invalid -> skip
      }
    }
    return items;
  }, [getRecent, prefix]);

  // Name cache for foreign accounts (via Node API)
  const [nameCache, setNameCache] = useState<Record<string, string>>({}); // key=RS

  useEffect(() => {
    let cancelled = false;
    if (!nodeUrl || recentItemsRaw.length === 0) return;

    const api = composeApi({ nodeHost: nodeUrl });
    const toFetch = recentItemsRaw
      .map((it) => it.rs)
      .filter((rs) => !nameCache[rs]); // only missing ones

    if (toFetch.length === 0) return;

    (async () => {
      for (const rs of toFetch) {
        try {
          const acc = await api.account.getAccount({ accountId: rs });
          if (cancelled) return;
          const nm = trimName(acc?.name);
          if (nm) setNameCache((prev) => ({ ...prev, [rs]: nm }));
        } catch {
          // ignore -> no name
        }
      }
    })();

    return () => { cancelled = true; };
  }, [nodeUrl, recentItemsRaw, nameCache]);

  // Foreign items (with optionally loaded name)
  const recentItems: ListItem[] = useMemo(() => {
    return recentItemsRaw.map(({ rs, accountId }) => ({
      key: `recent:${rs}`,
      isOwn: false,
      accountId,
      rs,
      title: nameCache[rs], // optional
      description: "",      // no src44 → HashIcon fallback
      loading: false,
    }));
  }, [recentItemsRaw, nameCache]);

  // Merge + dedupe (by RS), order: recent → own
  const baseItems: ListItem[] = useMemo(() => {
    const byRs = new Map<string, ListItem>();
    for (const it of recentItems) byRs.set(it.rs, it);
    for (const it of ownAccountItems) if (!byRs.has(it.rs)) byRs.set(it.rs, it);
    return Array.from(byRs.values());
  }, [recentItems, ownAccountItems]);

  // UI state
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const interactingRef = useRef(false); // prevents closing while scrolling

  // Filter: prefix match on RS (case-insensitive) or numeric
  const filterItems = (q: string) => {
    const needle = (q ?? "").trim().toLowerCase();
    if (!needle) return baseItems.slice(0, maxSuggestions);

    const isNum = /^\d+$/.test(needle);
    const filtered = isNum
      ? baseItems.filter((i) => i.accountId.startsWith(needle))
      : baseItems.filter((i) => i.rs.toLowerCase().startsWith(needle));

    return filtered.slice(0, maxSuggestions);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
        const data = filterItems(query || String(value || ""));

        const handleSelect = (rs: string) => {
          onChange(rs);
          setOpen(false);
          setTimeout(() => Keyboard.dismiss(), 0);
        };

        const defer = (fn: () => void, ms = 100) => setTimeout(fn, ms);

        return (
          <View className="w-full">
            <TextInput
              placeholder={placeholder}
              size={size}
              value={value}
              onBlur={() => {
                // only close if NOT currently interacting with the dropdown
                defer(() => {
                  if (!interactingRef.current) setOpen(false);
                }, 80);
                onBlur();
              }}
              onFocus={() => {
                setQuery(String(value || ""));
                setOpen(true);
              }}
              onChangeText={(txt) => {
                onChange(txt);
                setQuery(txt);
                if (!open) setOpen(true);
              }}
            />

            {/* Dropdown below the text field */}
            {open && data.length > 0 && (
              <View className="mt-2 rounded-2xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
                <ScrollView
                  style={{ maxHeight: 235 }}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="always"
                  keyboardDismissMode="on-drag"
                  onTouchStart={() => { interactingRef.current = true; }}
                  onScrollBeginDrag={() => { interactingRef.current = true; }}
                  onTouchEnd={() => { defer(() => (interactingRef.current = false), 120); }}
                  onScrollEndDrag={() => { defer(() => (interactingRef.current = false), 120); }}
                >
                  {data.map((item) => (
                    <Pressable
                      key={item.key}
                      onPress={() => handleSelect(item.rs)}
                      className="flex-row items-center gap-3 px-3 py-2 min-h-12"
                    >
                      <AccountAvatar
                        loading={item.loading}
                        accountId={item.accountId}
                        description={item.description}
                      />
                      
                      <View className="flex-1 justify-center gap-0.5">
                        {/* Title line: wallet name (own) or loaded name (foreign) */}
                        {item.title ? (
                          <RNText
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{ fontWeight: "600", includeFontPadding: false }}
                          >
                            {item.title}
                          </RNText>
                        ) : null}

                        {/* RS line always visible */}
                        <RNText
                          numberOfLines={1}
                          ellipsizeMode="middle"
                          style={{ opacity: 0.7, includeFontPadding: false }}
                        >
                          {item.rs}
                        </RNText>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        );
      }}
    />
  );
};

export default RecipientAutocomplete;