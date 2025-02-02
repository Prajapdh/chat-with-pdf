// ./app/pricing/page.tsx

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { auth } from "@clerk/nextjs/server"
import { checkSubscription } from "@/lib/subscription"

const PricingPage = async () => {
  const { userId } = await auth();
  const isPro = userId ? await checkSubscription(userId) : false;
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "For casual users",
      features: ["5 PDF uploads per month", "Basic chat functionality", "Standard processing speed"],
      cta: isPro ? "Get Started" : "Current Plan",
      ctaLink: "/signup",
    },
    {
      name: "Pro",
      price: "$19.99",
      description: "For power users",
      features: [
        "Unlimited PDF uploads",
        "Advanced chat with context awareness",
        "Priority processing speed",
        "API access",
      ],
      cta: isPro ? "Current Plan" : "Upgrade to Pro",
      ctaLink: "/signup?plan=pro",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>

     {/* Pricing Cards */}
     <div className="grid md:grid-cols-2 gap-8 mb-20">
        {plans.map((plan, index) => (
          <Card key={index} className={`${(isPro && plan.name === "Pro") || (!isPro && plan.name === "Free") ? "border-primary" : ""}`}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4">
                {plan.price}
                <span className="text-base font-normal">/month</span>
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="w-5 h-5 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild disabled={(isPro && plan.name === "Pro") || (!isPro && plan.name === "Free")}>
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <h2 className="text-3xl font-bold text-center mb-8">Plan Comparison</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Feature</TableHead>
            <TableHead>Free</TableHead>
            <TableHead>Pro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>PDF uploads</TableCell>
            <TableCell>5 per month</TableCell>
            <TableCell>Unlimited</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Chat functionality</TableCell>
            <TableCell>Basic</TableCell>
            <TableCell>Advanced with context awareness</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Processing speed</TableCell>
            <TableCell>Standard</TableCell>
            <TableCell>Priority</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>API access</TableCell>
            <TableCell>
              <X className="w-5 h-5 text-red-500" />
            </TableCell>
            <TableCell>
              <Check className="w-5 h-5 text-green-500" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* FAQ Section */}
      <h2 className="text-3xl font-bold text-center mt-20 mb-8">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger>Can I switch between plans?</AccordionTrigger>
          <AccordionContent>
            Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing
            cycle.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is there a limit to the size of PDFs I can upload?</AccordionTrigger>
          <AccordionContent>
            Free users can upload PDFs up to 10MB in size. Pro users can upload PDFs up to 50MB in size.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
          <AccordionContent>
            {`We offer a 14-day money-back guarantee for Pro subscriptions. If you're not satisfied, contact our support
            team within 14 days of your purchase for a full refund.`}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards, PayPal, and some regional payment methods. For annual subscriptions, we
            also offer invoicing for enterprise customers.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Final CTA */}
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8">{`Choose the plan that's right for you and start chatting with your PDFs today!`}</p>
        <Button size="lg" asChild>
          <Link href="/signup">Sign Up Now</Link>
        </Button>
      </div>
    </div>
  )
}

export default PricingPage

