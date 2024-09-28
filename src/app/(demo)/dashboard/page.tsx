"use client"
import { useEffect } from "react";
import PlaceholderContent from "@/components/charts-01-chunk-2";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {CalendarDemo } from "@/components/component/dashboard/calendar";
import {Component } from "@/components/component/dashboard/longbar";

export default function DashboardPage() {

  useEffect(() => {
    // Run a background fetch call and log the result to the console
    fetch('/api/user')
      .then((response) => response.json())
      .then((data) => {
        console.log("User Data:", data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []); 

  return (
    <ContentLayout title="Dashboard">
      
         <h1 className="text-xl font-bold">Welcome back <span className="text-2xl font-bold">🌟</span>, it&apos;s time to get productive</h1>
         <div className="flex flex-col md:flex-col lg:flex-row justify-between mt-4 w-full">
  <div className="w-full lg:w-auto">
    <Component />
  </div>
  <div className="w-full lg:w-auto">
    <PlaceholderContent />
  </div>
  <div className="w-full lg:w-auto lg:max-w-xs"> {/* Adjusting width for CalendarDemo */}
    <CalendarDemo />
  </div>
</div>



     
    </ContentLayout>
  );
}
