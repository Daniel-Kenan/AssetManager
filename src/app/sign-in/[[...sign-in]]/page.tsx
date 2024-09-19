
import { SignIn } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div>
       <div className="flex items-center justify-center min-h-screen">

      <SignIn />
       </div>
    </div>
  );
};

export default SignUpPage;
