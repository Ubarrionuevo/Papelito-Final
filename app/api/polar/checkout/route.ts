import { Checkout } from "@polar-sh/nextjs";
import { NextResponse } from "next/server";

const accessToken = process.env.POLAR_ACCESS_TOKEN;

const serverEnv = process.env.POLAR_ENVIRONMENT === "sandbox" ? "sandbox" : "production";

const checkoutHandler = accessToken
  ? Checkout({
      accessToken,
      successUrl: process.env.POLAR_SUCCESS_URL,
      server: serverEnv,
    })
  : null;

export const GET = (request: Request) => {
  if (!checkoutHandler) {
    return NextResponse.json({ error: "Polar access token not configured" }, { status: 500 });
  }

  const url = new URL(request.url);
  const products = url.searchParams.getAll("products");

  if (products.length === 0) {
    const checkoutId = url.searchParams.get("checkoutId");
    if (checkoutId) {
      return NextResponse.redirect(`https://buy.polar.sh/${checkoutId}`);
    }

    return NextResponse.json({ error: "Missing products query parameter" }, { status: 400 });
  }

  return checkoutHandler(request).catch((error: unknown) => {
    console.error("Polar checkout error:", error);
    return NextResponse.json(
      {
        error: "Polar checkout creation failed",
        details:
          error instanceof Error ? error.message : "Unknown error communicating with Polar",
      },
      { status: 500 },
    );
  });
};

