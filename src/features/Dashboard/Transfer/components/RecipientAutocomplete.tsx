import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Pressable,
  ScrollView,
  Keyboard,
  Text as RNText,
  Modal,
  TextInput as NativeTextInput,
  Platform,
} from "react-native";
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

const isIOS = Platform.OS === "ios";

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
  const interactingRef = useRef(false); // prevents closing while scrolling (Android)
  const selectingRef = useRef(false);

  // iOS: anchor the Modal/clone input
  const inputRef = useRef<NativeTextInput>(null);
  const modalInputRef = useRef<NativeTextInput>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });

  const measureAnchor = () => {
    inputRef.current?.measureInWindow?.((x, y, w, h) => {
      setAnchor({ x, y, w, h });
    });
  };

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
      defaultValue=""
      render={({ field: { onChange, onBlur, value } }) => {
        const data = filterItems(query || String(value || ""));

        const handleSelect = (rs: string) => {
          onChange(rs);
          setOpen(false);
          Keyboard.dismiss();
        };

        const defer = (fn: () => void, ms = 100) => setTimeout(fn, ms);

        return (
          <View className="w-full">
            {/* Shared input field (iOS: focus only starts modal, Android: active field) */}
            <TextInput
              ref={inputRef}
              placeholder={placeholder}
              size={size}
              value={String(value ?? "")} // always bind as string
              editable={!isIOS ? true : !open}  // iOS locks the original during modal
              onLayout={() => isIOS && measureAnchor()}
              onFocus={() => {
                setQuery(String(value || ""));
                setOpen(true);
                if (isIOS) {
                  // iOS: open modal & focus clone input
                  setTimeout(() => {
                    measureAnchor();
                    setTimeout(() => modalInputRef.current?.focus(), 0);
                  }, 0);
                }
              }}
              onBlur={onBlur} // no close on onBlur → avoids race
              onChangeText={(txt) => {
                onChange(txt);
                setQuery(txt);
                if (!open) setOpen(true);
              }}
            />

            {/* ANDROID: Inline dropdown within normal layout flow */}
            {!isIOS && open && (
              data.length > 0 ? (
                <View className="mt-2 rounded-2xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
                  <ScrollView
                    style={{ maxHeight: 235 }}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="none"
                    scrollsToTop={false}
                    bounces={false}
                    onTouchStart={() => { interactingRef.current = true; }}
                    onScrollBeginDrag={() => { interactingRef.current = true; }}
                    onTouchEnd={() => { defer(() => (interactingRef.current = false), 120); }}
                    onScrollEndDrag={() => { defer(() => (interactingRef.current = false), 120); }}
                  >
                    {data.map((item) => (
                      <Pressable
                        key={item.key}
                        onPressIn={() => { selectingRef.current = true; }}
                        onPress={() => {
                          selectingRef.current = false;
                          handleSelect(item.rs);
                        }}
                        className="flex-row items-center gap-3 px-3 py-2 min-h-12"
                      >
                        <AccountAvatar
                          loading={item.loading}
                          accountId={item.accountId}
                          description={item.description}
                        />
                        <View className="flex-1 justify-center gap-0.5">
                          {item.title ? (
                            <RNText numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight: "600", includeFontPadding: false }}>
                              {item.title}
                            </RNText>
                          ) : null}
                          <RNText numberOfLines={1} ellipsizeMode="middle" style={{ opacity: 0.7, includeFontPadding: false }}>
                            {item.rs}
                          </RNText>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              ) : null
            )}

            {/* iOS: stable modal with clone input + dropdown */}
            {isIOS && (
              <Modal
                visible={open}
                transparent
                animationType="none"
                presentationStyle="overFullScreen"
                statusBarTranslucent
                onShow={() => {
                  measureAnchor();
                  setTimeout(() => modalInputRef.current?.focus(), 0);
                }}
                onRequestClose={() => setOpen(false)}
              >
                {/* Backdrop: tap outside closes modal */}
                <Pressable className="flex-1 bg-black/0" onPress={() => setOpen(false)}>
                  {/* Clone input exactly over the original */}
                  <View
                    style={{
                      position: "absolute",
                      left: anchor.x,
                      top: anchor.y,
                      width: anchor.w,
                      height: anchor.h,
                    }}
                  >
                    <TextInput
                      ref={modalInputRef}
                      placeholder={placeholder}
                      size={size}
                      value={String(value ?? "")}
                      autoFocus
                      onChangeText={(txt) => {
                        onChange(txt);
                        setQuery(txt);
                      }}
                    />
                  </View>

                  {/* Dropdown below clone input (8px gap) */}
                  <View
                    style={{
                      position: "absolute",
                      left: anchor.x,
                      top: anchor.y + anchor.h + 8,
                      width: anchor.w,
                    }}
                    className="rounded-2xl border border-neutral-200 bg-white shadow-lg overflow-hidden"
                  >
                    {data.length > 0 && (
                      <ScrollView
                        style={{ maxHeight: 235 }}
                        keyboardShouldPersistTaps="always"
                        keyboardDismissMode="none"
                        scrollsToTop={false}
                        bounces={false}
                      >
                        {data.map((item) => (
                          <Pressable
                            key={item.key}
                            onPressIn={() => { selectingRef.current = true; }}
                            onPress={() => {
                              selectingRef.current = false;
                              handleSelect(item.rs);
                            }}
                            className="flex-row items-center gap-3 px-3 py-2 min-h-12"
                          >
                            <AccountAvatar
                              loading={item.loading}
                              accountId={item.accountId}
                              description={item.description}
                            />
                            <View className="flex-1 justify-center gap-0.5">
                              {item.title ? (
                                <RNText numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight: "600", includeFontPadding: false }}>
                                  {item.title}
                                </RNText>
                              ) : null}
                              <RNText numberOfLines={1} ellipsizeMode="middle" style={{ opacity: 0.7, includeFontPadding: false }}>
                                {item.rs}
                              </RNText>
                            </View>
                          </Pressable>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                </Pressable>
              </Modal>
            )}
          </View>
        );
      }}
    />
  );
};

export default RecipientAutocomplete;
