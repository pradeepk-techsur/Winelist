import { createSerwistRoute } from "@serwist/turbopack";
import { NextResponse } from "next/server";

const serwistRoute = createSerwistRoute({
  swSrc: "src/app/sw.ts",
  useNativeEsbuild: true,
  esbuildOptions: {
    target: "chrome96",
  },
});

// These must be static literals for Next.js static analysis
export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

// Override generateStaticParams to return arrays as required by Next.js [..path] catch-all routes
export const generateStaticParams = async () => {
  const params = await serwistRoute.generateStaticParams();
  // Next.js 15 requires [...path] to return path as array, not string
  return params.map((p) => ({
    path: typeof p.path === "string" ? p.path.split("/") : p.path,
  }));
};

// Wrapper to convert array path params back to string for serwist handler
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string | string[] }> }
) {
  const resolvedParams = await params;
  const pathValue = resolvedParams.path;
  // Serwist GET expects path as a string, not array
  const pathString = Array.isArray(pathValue) ? pathValue.join("/") : pathValue;

  return serwistRoute.GET(request as Parameters<typeof serwistRoute.GET>[0], {
    params: Promise.resolve({ path: pathString }),
  }) as Promise<NextResponse>;
}
