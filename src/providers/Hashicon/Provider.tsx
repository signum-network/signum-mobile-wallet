import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: -1000,       // weit außerhalb
    left: -1000,
    width: 0,
    height: 0,
    overflow: "hidden",
  },
  web: {
    width: 1,
    height: 1,
    opacity: 0,
    backgroundColor: "transparent",
  },
});

type GetIcon = (seed: string, size?: number) => Promise<string>;
const Ctx = createContext<GetIcon>(() => Promise.reject("HashiconProvider missing"));

export function HashiconProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const cache = useRef(new Map<string, string>());
  const inflight = useRef(new Map<string, (u: string) => void>());

  const onMessage = (e: WebViewMessageEvent) => {
    const msg = JSON.parse(e.nativeEvent.data || "{}");
    if (msg.type === "ready") setReady(true);
    if (msg.type === "res" && msg.key && msg.url) {
      cache.current.set(msg.key, msg.url);
      inflight.current.get(msg.key)?.(msg.url);
      inflight.current.delete(msg.key);
    }
    if (msg.type === "err") console.warn("[hashicon]", msg.error);
  };

  const getIcon: GetIcon = (seed, size = 40) => {
    const key = `${seed}|${size}`;
    const hit = cache.current.get(key);
    if (hit) return Promise.resolve(hit);
    return new Promise((resolve) => {
      inflight.current.set(key, resolve);
      const send = () =>
        ref.current?.postMessage(JSON.stringify({ type: "gen", seed, size, key }));
      if (ready) send();
      else {
        const t = setInterval(() => {
          if (!ready) return;
          clearInterval(t);
          send();
        }, 20);
      }
    });
  };

  const source = useMemo(() => require("@/assets/hashicon/index.html"), []);

  return (
    <>
      <View pointerEvents="none" style={styles.wrap}>
        <WebView
          ref={ref}
          source={source}
          onMessage={onMessage}
          originWhitelist={["*"]}
          javaScriptEnabled
          allowFileAccess
          allowingReadAccessToURL={"*"}
          style={styles.web}
        />
      </View>
      <Ctx.Provider value={getIcon}>{children}</Ctx.Provider>
    </>
  );
}

export const useHashicon = () => useContext(Ctx);
