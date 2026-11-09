import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PropGuard Risk Hub",
    short_name: "PropGuard",
    description: "Institutional Prop Firm Risk & Lot Size Sizing Engine",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#10b981",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

