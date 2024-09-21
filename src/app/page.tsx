import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
        <div className="container h-14 flex items-center">
          <Link
            href="/"
            className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
          >
            <Image
              src="/a-removebg-preview.png"
              width={50}
              height={50}
              alt="demo-mobile"
              // className="w-6 h-6 mr-1" 
            />
            
            <span className="font-bold">Uniteer</span>
            <span className="sr-only">Uniteer</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 bg-background"
              asChild
            >
              <Link href="https://github.com/your-repo-url" target="_blank" rel="noopener noreferrer">
                <GitHubLogoIcon className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>
      
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              Project Management Tool 
            </h1>
            <span className="max-w-[750px] text-center text-lg font-light text-foreground">
              A stunning and functional project tool to collaborate within the company complete with desktop and mobile responsiveness built by NextGenSell.
            </span>
            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
              <Button variant="default" asChild>
                <Link href="/sign-in">
                  Proceed
                  <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  href="https://www.nextgensell.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About NextGenSell
                </Link>
              </Button>
            </div>
          </section>
          
          <div className="w-full flex justify-center relative">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/Screenshot.png"
                  width={1080}
                  height={608}
                  alt="demo"
                  priority
                  className="rounded-xl shadow-sm transition duration-300 group-hover:scale-[1.02] group-hover:shadow-xl dark:hidden"
                />
                <Image
                  src="/Screenshot-dark.png"
                  width={1080}
                  height={608}
                  alt="demo"
                  priority
                  className="rounded-xl shadow-sm transition duration-300 group-hover:scale-[1.02] group-hover:shadow-xl hidden dark:block"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built on top of{" "}
            <Link
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn/ui
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/your-repo-url"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}