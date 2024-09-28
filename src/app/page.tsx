'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRightIcon, CheckIcon, StarIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import  Pricing  from "@/components/Homepage/Pricing"
import { ModeToggle } from "@/components/mode-toggle"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserButton, useUser } from "@clerk/nextjs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReactNode } from 'react';
const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
)

const MessageSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
)

const ClipboardListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
)

const LineChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
)

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
)

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
)

const AvatarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
)

export default function HomePage() {
  const { isSignedIn, user } = useUser()
  const [activeTab, setActiveTab] = useState("monthly")

  useEffect(() => {
    const url = "https://ai.nextgensell.com"
    const links = [
      { rel: "stylesheet", href: `${url}/static/style.css` },
      { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" },
    ]
    links.forEach((linkData) => {
      const link = document.createElement("link")
      link.rel = linkData.rel
      link.href = linkData.href
      document.head.appendChild(link)
    })

    let toggleButton: HTMLButtonElement | undefined;

    if (window.location.pathname === "/") {
      toggleButton = document.createElement("button");
      toggleButton.id = "toggleChatbot";
      toggleButton.innerHTML = '<i class="fas fa-comment-dots"></i>';
  
      setTimeout(() => {
        document.body.appendChild(toggleButton!);
      }, 1650);

      setInterval(()=>{ 
        if(window.location.pathname != "/")
          toggleButton!.style.display = "none";
      }, 500)
      toggleButton.style.setProperty('border', '0.5px solid white', 'important');
      toggleButton.style.setProperty('background-color', 'black', 'important');
    
      const chatbot = document.createElement("div")
      chatbot.id = "chatbot"
      chatbot.innerHTML = `<iframe src="${url}/chatbot?param=0&param2=1&accessToken=$udwnurery43gfbhfbuy4" style="width: 100%; height: 100%; border: none;"></iframe>`
      document.body.appendChild(chatbot)

      toggleButton.addEventListener("click", function () {
        chatbot.classList.toggle("chatbot-visible")
        console.log(chatbot.classList)
      })
    }
  }, [])

  interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    emoji: string;
  }
  const FeatureCard = ({ icon, title, description, emoji }: FeatureCardProps) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            {icon}
          </div>
          <CardTitle className="flex items-center">
            <span className="mr-2">{emoji}</span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )

  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/80">
      <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
        <div className="container h-14 flex items-center">
          <Link href="/" className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300">
            <Image src="/a-removebg-preview.png" width={50} height={50} alt="Uniteer logo" />
            <span className="font-bold text-xl ml-2">Uniteer</span>
            <span className="sr-only">Uniteer</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserButton afterSignOutUrl="/" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/users">Organisation</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8 bg-backgroun" asChild>
                <Link href="/sign-in">
                  <AvatarIcon />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
            )}
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 lg:py-24">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]"
            >
              Supercharge Your Team&apos;s Productivity 🚀
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-[750px] text-center text-lg font-medium text-muted-foreground sm:text-xl"
            >
              Uniteer: The all-in-one solution for <strong className="text-primary">seamless collaboration</strong> 🤝, <strong className="text-primary">efficient task management</strong> ✅, and <strong className="text-primary">data-driven decision making</strong> 📊. Elevate your team&apos;s performance today!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6"
            >
              <Button variant="default" size="lg" asChild>
                <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
                  {isSignedIn ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="https://www.nextgensell.com/" target="_blank" rel="noopener noreferrer">
                  Learn More
                </Link>
              </Button>
            </motion.div>
          </section>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full flex justify-center relative mb-16"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-foreground rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/playback.gif"
                  width={1080}
                  height={608}
                  alt="Uniteer dashboard demo"
                  priority
                  style={{ borderWidth: '0.1px', borderColor: 'grey', borderStyle: 'solid' }}
                  className="rounded-xl shadow-lg transition duration-300 group-hover:scale-[1.02] group-hover:shadow-xl dark:hidden"
                />
                <Image
                  src="/playbackdark.gif"
                  width={1080}
                  height={608}
                  alt="Uniteer dashboard demo"
                  priority
                  className="rounded-xl shadow-lg transition duration-300 group-hover:scale-[1.02] group-hover:shadow-xl hidden dark:block"
                />
              </div>
            </div>
          </motion.div>

          <section className="py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Powerful Features to Drive Success 💪</h2>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  icon={<RocketIcon />}
                  title="Team Storage"
                  description="Securely store and share files within your team. Easy access and version control for all your project documents."
                  emoji="📁"
                />
                <FeatureCard
                  icon={<MessageSquareIcon />}
                  title="Real-time Chat"
                  description="Instant communication with team members. Stay connected and collaborate effectively with our built-in chat feature."
                  emoji="💬"
                />
                <FeatureCard
                  icon={<ClipboardListIcon />}
                  title="Task Assignments"
                  description="Efficiently assign and track tasks. Keep your team organized and ensure nothing falls through the cracks."
                  emoji="✅"
                />
                <FeatureCard
                  icon={<LineChartIcon />}
                  title="Sales Funnel Tracking"
                  description="Visualize and optimize your sales process. Track leads, opportunities, and closed deals with our intuitive funnel system."
                  emoji="📈"
                />
                <FeatureCard
                  icon={<SettingsIcon />}
                  title="Customizable Workflows"
                  description="Tailor the tool to fit your team's unique processes. Create custom workflows that align with your business needs."
                  emoji="⚙️"
                />
                <FeatureCard
                  icon={<BarChartIcon />}
                  title="Analytics Dashboard"
                  description="Gain insights into your team's performance. Track key metrics and make data-driven decisions to improve productivity."
                  emoji="📊"
                />
              </div>
            </div>
          </section>

          <Pricing/>

          <section className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 md:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Transform Your Team&apos;s Productivity? 🚀</h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Join thousands of teams already using Uniteer to streamline their workflows, enhance collaboration, and drive results.
                  </p>
                  <ul className="mt-8 space-y-4">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                      <span>14-day free trial, no credit card required 🆓</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                      <span>Easy setup, get started in minutes ⚡</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                      <span>Dedicated support team to ensure your success 🤝</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Button size="lg" asChild>
                      <Link href="/sign-up">
                        Start Your Free Trial
                        <ArrowRightIcon className="ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/images.jpeg"
                    width={500}
                    height={500}
                    alt="Team collaboration"
                    className="rounded-lg shadow-lg"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
                    <p className="font-bold text-lg">96% of teams 🎉</p>
                    <p>report increased productivity</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-6 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              href="https://www.nextgensell.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              NextGenSell
            </a>
            . Terms of use availabe at {' '}
            <a
              href="https://github.com/nextgensell/uniteer-project-management"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              nextgensell.com
            </a>
            . 🚀
          </p>
        </div>
      </footer>
    </div>
  )
}