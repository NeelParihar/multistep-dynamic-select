export interface ResourceItem {
  id: string;
  name: string;
  type: "resource";
  icon: string | React.ComponentType<{ className?: string; size?: number }>;
  description?: string;
  hasDetails?: boolean;
  children?: ResourceItem[]; // For nested items
}

export interface Category {
  id: string;
  name: string;
  type: ResourceItem["type"];
  items: ResourceItem[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  type: string;
}
