"use client";

import { Button } from "@/components/ui/button"; // Adjust the path based on your structure

const SkipButton = () => {
  const handleSkip = () => {
    location.href = "/dashboard";
  };

  return (
    <Button 
      onClick={handleSkip} 
      className="mt-4"
    >
      Skip to Dashboard
    </Button>
  );
};

export default SkipButton;
