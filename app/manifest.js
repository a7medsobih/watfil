export default function manifest() {
  return {
    name: "Watfil",
    short_name: "Watfil",
    description: "Pure Water. Trusted Technology.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00A3E0",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
