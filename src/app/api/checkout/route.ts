import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface LineItem {
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutRequest {
  lineItems: LineItem[];
  customerEmail: string;
  metadata: {
    customerName: string;
    phone: string;
    deliveryMethod: string;
    address: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
    hearAboutUs: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { lineItems, customerEmail, metadata } = body;

    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: "No items in order" },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email is required" },
        { status: 400 }
      );
    }

    const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      lineItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: `${item.quantity} dozen freshly baked crinkle cookies`,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      customer_email: customerEmail,
      metadata: {
        customerName: metadata.customerName || "",
        phone: metadata.phone || "",
        deliveryMethod: metadata.deliveryMethod || "",
        address: metadata.address || "",
        preferredDate: metadata.preferredDate || "",
        preferredTime: metadata.preferredTime || "",
        notes: metadata.notes || "",
        hearAboutUs: metadata.hearAboutUs || "",
      },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create checkout session: ${message}` },
      { status: 500 }
    );
  }
}
