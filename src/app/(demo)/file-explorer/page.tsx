import Link from "next/link";

import FileExplorer from "@/components/component/file-explorer";
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
    <ContentLayout title="File Explorer">
      
      <FileExplorer/>
    </ContentLayout>
  );
}
