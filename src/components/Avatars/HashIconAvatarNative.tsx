import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { useHashicon } from "@/providers/Hashicon/Provider";

export default function HashIconAvatarNative({ id, size = 40 }: { id: string; size?: number }) {
  const getIcon = useHashicon();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getIcon(id, size).then((u) => alive && setUrl(u));
    return () => { alive = false; };
  }, [id, size, getIcon]);

  if (!url) return null;
  return (
    <Image
      source={{ uri: url }}   // data:image/png;base64,...
      contentFit="cover"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
