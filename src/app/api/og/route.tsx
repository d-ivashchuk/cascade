import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const imageData = await fetch(new URL("./cascade.png", import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* @ts-expect-error this works, so error is not so important :D  */}
        <img width="500" src={imageData} />
        <h1
          style={{
            fontFamily: "sans-serif",
            fontSize: "3rem",
            color: "#333",
            marginTop: "1rem",
          }}
        >
          Open-source SaaS starter kit
        </h1>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "1.8rem",
            color: "#666",
          }}
        >
          Auth | Subscriptions | Background jobs | Emails | Analytics | User
          management
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
