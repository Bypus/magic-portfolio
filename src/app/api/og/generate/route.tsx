import { ImageResponse } from "next/og";
import { baseURL, person } from "@/resources";
import { guardApiRequest } from "@/utils/apiSecurity";
import { RateLimiter } from "@/utils/rateLimit";

export const runtime = "nodejs";
const limiter = new RateLimiter(30, 60_000);

export async function GET(request: Request) {
  // Social crawlers and image previews must be able to request this public image.
  const denied = guardApiRequest(request, limiter, false);
  if (denied) return denied;
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Portfolio";
  if (title.length > 200) {
    return Response.json({ error: "Title too long" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  async function loadGoogleFont(font: string) {
    const url = `https://fonts.googleapis.com/css2?family=${font}`;
    const css = await (await fetch(url, { signal: AbortSignal.timeout(5000), next: { revalidate: 86400 } })).text();
    const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

    if (resource) {
      const resourceUrl = new URL(resource[1]);
      if (resourceUrl.protocol !== "https:" || resourceUrl.hostname !== "fonts.gstatic.com") {
        throw new Error("Unexpected font source");
      }
      const response = await fetch(resourceUrl, { signal: AbortSignal.timeout(5000), redirect: "error", next: { revalidate: 86400 } });
      if (response.status == 200) {
        return await response.arrayBuffer();
      }
    }

    throw new Error("failed to load font data");
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "6rem",
        background: "#151515",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "4rem",
          fontStyle: "normal",
          color: "white",
        }}
      >
        <span
          style={{
            padding: "1rem",
            fontSize: "6rem",
            lineHeight: "8rem",
            letterSpacing: "-0.05em",
            whiteSpace: "wrap",
            textWrap: "balance",
            overflow: "hidden",
          }}
        >
          {title}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5rem",
          }}
        >
          <img
            src={baseURL + person.avatar}
            style={{
              width: "12rem",
              height: "12rem",
              objectFit: "cover",
              borderRadius: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "4.5rem",
                lineHeight: "4.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
              }}
            >
              {person.name}
            </span>
            <span
              style={{
                fontSize: "2.5rem",
                lineHeight: "2.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
                opacity: "0.6",
              }}
            >
              {person.role}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1280,
      height: 720,
      fonts: [
        {
          name: "Geist",
          data: await loadGoogleFont("Geist:wght@400"),
          style: "normal",
        },
      ],
    },
  );
}
