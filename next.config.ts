import { withSerwist } from "@serwist/turbopack";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // no special config needed beyond Serwist
};

export default withSerwist(nextConfig);
