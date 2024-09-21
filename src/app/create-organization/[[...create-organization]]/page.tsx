import { CreateOrganization } from '@clerk/nextjs';
import SkipButton from '@/components/component/headToDash'; // Adjust the path as necessary

const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <CreateOrganization afterCreateOrganizationUrl="/users" skipInvitationScreen={true} />
      <SkipButton />
    </div>
  );
};

export default SignUpPage;
