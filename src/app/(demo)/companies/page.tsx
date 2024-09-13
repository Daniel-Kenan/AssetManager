import Link from "next/link";

import CompanyManagement from "@/components/company-management-with-picture";
import { ContentLayout } from "@/components/admin-panel/content-layout";
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
        

  <CompanyManagement />
   

     
    </ContentLayout>
  );
}
