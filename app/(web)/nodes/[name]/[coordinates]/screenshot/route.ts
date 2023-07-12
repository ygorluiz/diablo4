import { isOverwolf } from "@/app/lib/env";
import { takeScreenshot } from "@/app/lib/screenshots";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 628,
};
const contentType = "image/jpeg";

async function _GET(request: NextRequest) {
  const url = `https://diablo4.th.gl/embed/${request.nextUrl.pathname.replace(
    "/screenshot",
    ""
  )}`;
  const screenshot = await takeScreenshot(url, size);
  const response = new NextResponse(screenshot, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, stale-while-revalidate",
    },
  });
  return response;
}

export const GET = isOverwolf ? undefined : _GET;
