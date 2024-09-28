'use client'

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRightIcon, CheckIcon, StarIcon, InfoIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PricingPlan {
  title: string
  description: string
  monthlyPrice: number | "Custom"
  yearlyPrice: number | "Custom"
  features: string[]
  cta: string
  popular: boolean
  emoji: string
  maxUsers: number
  additionalUserPrice?: number
}

interface PricingCardProps {
  plan: PricingPlan
  activeTab: "monthly" | "yearly"
  userCount: number
  onUserCountChange?: (value: number) => void
}

const pricingPlans: PricingPlan[] = [
  {
    title: "Basic",
    description: "Perfect for small teams and startups",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: [
      "Up to 10 team members",
      "10GB team storage",
      "Basic task management",
      "Real-time chat",
      "Email support"
    ],
    cta: "Start 14-day free trial",
    popular: false,
    emoji: "🚀",
    maxUsers: 10,
    additionalUserPrice: 50
  },
  {
    title: "Pro",
    description: "Ideal for growing teams with advanced needs",
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: [
      "Unlimited team members",
      "100GB team storage",
      "Advanced task management",
      "Sales funnel tracking",
      "Priority email & chat support",
      "API access",
      "Advanced analytics"
    ],
    cta: "Start 14-day free trial",
    popular: true,
    emoji: "⭐",
    maxUsers: 100
  },
  {
    title: "Enterprise",
    description: "Tailored solutions for large organizations",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    features: [
      "All Pro features",
      "Unlimited storage",
      "Dedicated account manager",
      "24/7 phone & email support",
      "Custom integrations",
      "On-premise deployment option",
      "Advanced security features"
    ],
    cta: "Contact Sales",
    popular: false,
    emoji: "🏢",
    maxUsers: Infinity
  }
]

const PricingCard: React.FC<PricingCardProps> = ({ plan, activeTab, userCount, onUserCountChange }) => {
  const basePrice = activeTab === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
  const isBasicPlan = plan.title === "Basic"
  const isProPlan = plan.title === "Pro"
  const additionalUsers = Math.max(0, userCount - 1)

  let totalPrice: number | "Custom" = "Custom"
  let pricePerUser: string = "Custom"

  if (typeof basePrice === 'number') {
    const additionalUsersCost = isBasicPlan && plan.additionalUserPrice 
      ? additionalUsers * plan.additionalUserPrice 
      : 0
    totalPrice = basePrice + additionalUsersCost

    const monthlyTotalPrice = activeTab === "yearly" ? totalPrice / 12 : totalPrice
    pricePerUser = (monthlyTotalPrice / userCount).toFixed(2)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`relative h-full flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
        {plan.popular && (
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            Most Popular
          </Badge>
        )}
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <span className="mr-2">{plan.emoji}</span>
            {plan.title}
          </CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="mb-6">
            <span className="text-4xl font-bold">
              {typeof totalPrice === 'number' ? `R${totalPrice}` : totalPrice}
            </span>
            <span className="text-muted-foreground">
              {typeof basePrice === 'number' ? ` /${activeTab.slice(0, -2)}` : ''}
            </span>
            <div className="text-sm text-muted-foreground mt-1">
              {pricePerUser !== "Custom" ? `R${pricePerUser} per user/month` : pricePerUser}
            </div>
          </div>
          {(isBasicPlan || isProPlan) && (
            <div className="mb-6">
              <Label htmlFor={`user-count-${plan.title}`} className="mb-2 block">Number of users</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id={`user-count-${plan.title}`}
                  min={1}
                  max={plan.maxUsers}
                  step={1}
                  value={[userCount]}
                  onValueChange={(value) => onUserCountChange && onUserCountChange(value[0])}
                  className="flex-grow"
                />
                <span className="font-medium">{userCount}</span>
              </div>
              {isBasicPlan && plan.additionalUserPrice && (
                <p className="text-sm text-muted-foreground mt-2">
                  +R{plan.additionalUserPrice} per additional user
                </p>
              )}
            </div>
          )}
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full text-lg py-6" 
            variant={plan.popular ? "default" : "outline"}
          >
            {plan.cta}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

const FeatureComparisonTable: React.FC = () => {
  const allFeatures = Array.from(new Set(pricingPlans.flatMap(plan => plan.features)))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Feature</TableHead>
          {pricingPlans.map((plan) => (
            <TableHead key={plan.title}>{plan.title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {allFeatures.map((feature) => (
          <TableRow key={feature}>
            <TableCell className="font-medium">{feature}</TableCell>
            {pricingPlans.map((plan) => (
              <TableCell key={`${plan.title}-${feature}`}>
                {plan.features.includes(feature) ? (
                  <CheckIcon className="h-5 w-5 text-primary" />
                ) : (
                  <XIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<"monthly" | "yearly">("monthly")
  const [userCounts, setUserCounts] = useState<{ [key: string]: number }>({
    Basic: 1,
    Pro: 1,
    Enterprise: 1
  })

  const handleUserCountChange = (planTitle: string, value: number) => {
    setUserCounts(prev => ({ ...prev, [planTitle]: value }))
  }

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background via-background/80 to-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-4">Choose the Perfect Plan for Your Team 🎯</h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            Unlock your team&apos;s full potential with our flexible pricing options. Start your journey to enhanced productivity today!
          </p>
        </div>

        <div className="flex flex-col items-center justify-center mb-12">
          <div className="inline-flex items-center bg-muted p-1 rounded-full mb-4">
            <Button
              variant={activeTab === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("monthly")}
              className="relative z-10"
            >
              <span className={activeTab === "monthly" ? "text-primary-foreground" : ""}>
                Monthly
              </span>
              {activeTab === "monthly" && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  layoutId="pricing-tab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  style={{ zIndex: -1 }}
                />
              )}
            </Button>
            <Button
              variant={activeTab === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("yearly")}
              className="relative z-10"
            >
              <span className={activeTab === "yearly" ? "text-primary-foreground" : ""}>
                Yearly
              </span>
              {activeTab === "yearly" && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  layoutId="pricing-tab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  style={{ zIndex: -1 }}
                />
              )}
            </Button>
          </div>
          <AnimatePresence mode="wait">
            {activeTab === "yearly" && (
              <motion.div
                key="yearly-savings"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="outline" className="text-lg py-1 px-3">
                  <StarIcon className="mr-1 h-4 w-4" />
                  Save up to 20% with yearly billing 💰
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <PricingCard 
              key={index} 
              plan={plan} 
              activeTab={activeTab} 
              userCount={userCounts[plan.title]}
              onUserCountChange={(value) => handleUserCountChange(plan.title, value)}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            All plans come with a 14-day free trial. No credit card required. 🎉
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="group">
                Compare All Features
                <InfoIcon className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Feature Comparison</DialogTitle>
                <DialogDescription>
                  Compare features across all our pricing plans to find the best fit for your team.
                </DialogDescription>
              </DialogHeader>
              <FeatureComparisonTable />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  )
}