"use dom";

// @ts-ignore
import hashicon from "hashicon";

export default function DOMComponent({ accountId }: { accountId: string }) {
  const imageSrcUrl = hashicon(accountId, { size: 20 }).toDataURL();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={imageSrcUrl}
        style={{ width: "100%", height: "100%", alignContent: "center" }}
      />
    </div>
  );
}
