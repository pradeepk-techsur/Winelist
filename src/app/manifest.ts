import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wine Cellar",
    short_name: "Cellar",
    description: "Your personal wine collection",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#1a0a0a",
    background_color: "#0d0605",
    display: "standalone",
    orientation: "portrait",
    start_url: "/",
    scope: "/",
  };
}
