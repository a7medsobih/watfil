import createNextIntlPlugin from "next-intl/plugin";

function buildImageRemotePatterns() {
  const patterns = [
    { protocol: "https", hostname: "images.unsplash.com" },
  ];

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  let apiHost = null;
  if (apiUrl) {
    try {
      apiHost = new URL(apiUrl).hostname;
    } catch {
      apiHost = null;
    }
  }

  if (apiHost) {
    patterns.push({
      protocol: "https",
      hostname: apiHost,
      pathname: "/**",
    });
  }

  if (apiHost !== "watfil-backend.glitchfic-calw.io") {
    patterns.push({
      protocol: "https",
      hostname: "watfil-backend.glitchfic-calw.io",
      pathname: "/**",
    });
  }

  return patterns;
}

const nextConfig = {
  images: {
    remotePatterns: buildImageRemotePatterns(),
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
