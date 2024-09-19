import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,SignIn
} from '@clerk/nextjs'
import { SignUp } from '@clerk/nextjs';
export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
 
    <><SignedOut>

      <div className="flex items-center justify-center min-h-screen">
        <SignIn routing="hash" />
      </div>
    </SignedOut><SignedIn>


        <AdminPanelLayout>{children}</AdminPanelLayout>;
      </SignedIn></>


  )
}
