"use client"
import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRightIcon, GitHubLogoIcon, CheckIcon,AvatarIcon } from "@radix-ui/react-icons"
import Pricing from "@/components/pricing";
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
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

    let toggleButton:HTMLButtonElement | undefined;

    if (window.location.pathname === "/") {
      toggleButton = document.createElement("button");
      toggleButton.id = "toggleChatbot";
      toggleButton.innerHTML = '<i class="fas fa-comment-dots"></i>';
  
      // Append the button to the document body after a delay
      setTimeout(() => {
        document.body.appendChild(toggleButton!);
      }, 1650);

      setInterval(()=>{ 
        if(window.location.pathname != "/")
   toggleButton!.style.display = "none";
      },500)
    toggleButton.style.setProperty('border', '0.5px solid white', 'important');
    toggleButton.style.setProperty ('background-color','black','important');
    
      const chatbot = document.createElement("div")
      chatbot.id = "chatbot"
      chatbot.innerHTML = `<iframe src="${url}/chatbot?param=0&param2=1&accessToken=$udwnurery43gfbhfbuy4" style="width: 100%; height: 100%; border: none;"></iframe>`
      document.body.appendChild(chatbot)

      toggleButton.addEventListener("click", function () {
        chatbot.classList.toggle("chatbot-visible")
        console.log(chatbot.classList)
      })
      // toggleButton.style.setProperty ('margin-top','3px','important');
      
    }
  }, [])

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
            <Button variant="outline" size="icon" className="rounded-full w-8 h-8 bg-background" asChild>
              <Link href="/sign-in"  >
                <AvatarIcon className="h-4 w-4" />
                <span className="sr-only">Login</span>
              </Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 lg:py-24">
            <h1 className="text-center text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Project Management Tool
            </h1>
            <p className="max-w-[750px] text-center text-lg font-medium text-muted-foreground sm:text-xl">
              🚀 A powerful tool for team collaboration with <strong className="text-primary">🗂️ team storage</strong>, <strong className="text-primary">💬 real-time chat</strong>, <strong className="text-primary">✅ task assignments</strong>, and <strong className="text-primary">📊 sales funnel tracking</strong>—everything to <span className="font-semibold text-foreground">boost productivity!</span>
            </p>

            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
              <Button variant="default" size="lg" asChild>
                <Link href="/sign-in">
                  Try for free
                  <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="https://www.nextgensell.com/" target="_blank" rel="noopener noreferrer">
                  About NextGenSell
                </Link>
              </Button>
            </div>
          </section>

          <div className="w-full flex justify-center relative mb-16">
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
                  src="/playbackdark.png"
                  width={1080}
                  height={608}
                  alt="Uniteer dashboard demo"
                  priority
                  className="rounded-xl shadow-lg transition duration-300 group-hover:scale-[1.02] group-hover:shadow-xl hidden dark:block"
                />
              </div>
            </div>
          </div>

          {/* <Pricing/> */}
        </div>
      </main>

      <footer className="py-6 md:py-0 border-t border-border/40">
        
      </footer>
    </div>
  )
}