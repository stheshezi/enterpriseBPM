import { PageContainer, PageHeader } from "@/components/layout";
import { RequestTypeForm, type RequestTypeOption } from "@/components/requests";
import { PERMISSIONS } from "@/config/permissions";
import { requireAnyPermission } from "@/lib/access-control";
import { prisma } from "@/lib/prisma";

const fallbackRequestTypes: RequestTypeOption[] = [
  {
    code: "travel",
    name: "Travel Request",
    description: "Flights, accommodation, transport, and trip approvals.",
  },
  {
    code: "leave",
    name: "Leave Request",
    description: "Annual, sick, family responsibility, and other leave approvals.",
  },
  {
    code: "purchase",
    name: "Purchase Request",
    description: "Goods, services, supplier purchases, and buying approvals.",
  },
  {
    code: "asset",
    name: "Asset Request",
    description: "Equipment, devices, software, and workspace assets.",
  },
  {
    code: "training",
    name: "Training Request",
    description: "Courses, conferences, certifications, and learning approvals.",
  },
  {
    code: "access",
    name: "Access Request",
    description: "Systems, locations, applications, and permission access.",
  },
  {
    code: "custom",
    name: "Custom Future Request Type",
    description: "A configurable request category for future business processes.",
  },
];

export default async function NewRequestPage() {
  const user = await requireAnyPermission(PERMISSIONS.REQUESTS_CREATE);
  const tenantRequestTypes = await prisma.requestType.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { name: "asc" },
    select: { id: true, code: true, name: true },
  });

  const requestTypes: RequestTypeOption[] = tenantRequestTypes.length
    ? tenantRequestTypes.map((requestType) => ({
        id: requestType.id,
        code: requestType.code.toLowerCase(),
        name: requestType.name,
        description:
          fallbackRequestTypes.find((fallback) => fallback.code === requestType.code.toLowerCase())?.description ??
          "Tenant-configured workflow request.",
      }))
    : fallbackRequestTypes;

  return (
    <PageContainer>
      <PageHeader
        title="New Request"
        description="Choose the request type first, then complete the fields for that workflow."
      />
      <RequestTypeForm requestTypes={requestTypes} />
    </PageContainer>
  );
}
