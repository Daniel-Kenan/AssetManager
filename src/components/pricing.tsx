import { Check, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PricingSection() {
  return (
    <section className="py-20 bg-muted/50 dark:bg-muted/20 rounded-3xl">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Select the perfect plan for your team&apos;s needs. Upgrade anytime as your team grows.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Free"
            description="For individuals and small teams"
            price="$0"
            period="/ month"
            features={[
              "Basic team storage",
              "Real-time chat",
              "Task assignments",
              "Limited integrations",
            ]}
            buttonText="Get Started"
            buttonVariant="outline"
          />
          <PricingCard
            title="Pro"
            description="For growing teams and businesses"
            price="$19.99"
            period="/ month"
            features={[
              "Advanced team storage",
              "Real-time chat with video calls",
              "Advanced task management",
              "Sales funnel tracking",
              "Priority support",
              "Unlimited integrations",
            ]}
            buttonText="Upgrade to Pro"
            buttonVariant="default"
            recommended={true}
          />
        </div>
      </div>
    </section>
  )
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary" | "ghost" | "link";
  recommended?: boolean;
}

function PricingCard({
  title,
  description,
  price,
  period,
  features,
  buttonText,
  buttonVariant,
  recommended = false,
}: PricingCardProps) {
  return (
    <Card className={`border-2 ${recommended ? 'border-primary' : 'border-muted-foreground/20 dark:border-muted-foreground/10'}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {recommended && <Badge variant="secondary">Recommended</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <span className="text-5xl font-bold">{price}</span>
          <span className="text-xl font-normal text-muted-foreground">{period}</span>
        </div>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-5 w-5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" variant={buttonVariant}>
          {buttonText}
          {recommended && <Zap className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}