import { Suspense } from "react";
import Stripe from "stripe";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Cookie, Phone, Mail, ArrowLeft } from "lucide-react";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function SuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    notFound();
  }

  let session: Stripe.Checkout.Session;
  let lineItems: Stripe.LineItem[] = [];

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    lineItems = session.line_items?.data || [];
  } catch {
    notFound();
  }

  const metadata = session.metadata || {};
  const totalAmount = session.amount_total ? session.amount_total / 100 : 0;

  return (
    <div className="overflow-hidden">
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#1A1614] bg-noise">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-[#6B8F71] rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#F5F0E8] mb-6 tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-[#A09890]">
            Your cookies are on the way! We&apos;ll reach out to confirm your
            order details.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E2D9]">
            <div className="flex items-center gap-3 mb-8">
              <Cookie className="w-6 h-6 text-[#C8A96E]" />
              <h2 className="font-serif text-2xl font-semibold text-[#2C1810]">
                Order Confirmation
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-[#8B7E74] mb-3">
                  Order Items
                </h3>
                <div className="space-y-2">
                  {lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-2 border-b border-[#E8E2D9]"
                    >
                      <span className="text-[#2C1810]">
                        {item.description} × {item.quantity}
                      </span>
                      <span className="font-medium text-[#2C1810]">
                        ${(item.amount_total || 0) / 100}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E8E2D9]">
                <span className="font-semibold text-[#2C1810]">Total</span>
                <span className="font-semibold text-[#C8A96E] text-xl">
                  ${totalAmount}
                </span>
              </div>

              {metadata.customerName && (
                <div className="pt-4 border-t border-[#E8E2D9]">
                  <h3 className="text-sm font-medium text-[#8B7E74] mb-3">
                    Order Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-[#2C1810]">
                      <span className="text-[#8B7E74]">Name:</span>{" "}
                      {metadata.customerName}
                    </p>
                    {metadata.deliveryMethod && (
                      <p className="text-[#2C1810]">
                        <span className="text-[#8B7E74]">Delivery:</span>{" "}
                        {metadata.deliveryMethod === "pickup"
                          ? "Pickup"
                          : metadata.deliveryMethod === "delivery"
                            ? "Local Delivery"
                            : "Shipping"}
                      </p>
                    )}
                    {metadata.address && (
                      <p className="text-[#2C1810]">
                        <span className="text-[#8B7E74]">Address:</span>{" "}
                        {metadata.address}
                      </p>
                    )}
                    {metadata.preferredDate && (
                      <p className="text-[#2C1810]">
                        <span className="text-[#8B7E74]">Preferred Date:</span>{" "}
                        {metadata.preferredDate}
                        {metadata.preferredTime &&
                          ` at ${metadata.preferredTime}`}
                      </p>
                    )}
                    {metadata.notes && (
                      <p className="text-[#2C1810]">
                        <span className="text-[#8B7E74]">Notes:</span>{" "}
                        {metadata.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-[#F5F0E8] rounded-2xl p-8 text-center">
            <h3 className="font-serif text-xl font-semibold text-[#2C1810] mb-4">
              Questions about your order?
            </h3>
            <div className="space-y-2 text-[#8B7E74]">
              <p className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Text us: 305-458-2119</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Email: nelupha@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#C8A96E] text-[#1A1614] px-8 py-4 rounded-full font-medium hover:bg-[#B8995E] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#8B7E74]">Loading your order...</p>
          </div>
        </div>
      }
    >
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
