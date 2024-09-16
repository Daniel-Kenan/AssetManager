import Link from "next/link";

import PlaceholderContent from "@/components/charts-01-chunk-0";
import PlaceholderConten from "@/components/charts-01-chunk-2";
import PlaceholderConte from "@/components/charts-01-chunk-7";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {CalendarDemo } from "@/components/component/dashboard/calendar";
import {Component } from "@/components/component/dashboard/longbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";





export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
         <h1 className="text-xl font-bold">Welcome back <span className="text-2xl font-bold">🌟</span>, it&apos;s time to get productive</h1>
         <div className="flex justify-between mt-4 w-full">
      <Component/>
      <PlaceholderConten />
       <CalendarDemo/>
</div>


     
    </ContentLayout>
  );
}
