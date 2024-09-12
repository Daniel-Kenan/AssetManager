import Link from "next/link";

import {Stickies} from "@/components/component/stickies";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function PersonalNotes() {
  return (
    <ContentLayout title="Personal Sticky Notes">
      
      <Stickies />
    </ContentLayout>
  );
}
