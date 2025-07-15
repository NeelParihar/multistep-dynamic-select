import {
  DocumentIcon,
  UserIcon,
  LinkIcon,
  GlobeIcon,
  SettingsIcon,
  IdIcon,
  MailIcon,
  PhoneIcon,
  TagIcon,
  FileTextIcon,
} from "../components/icons";
import type { Category } from "../types";

export const initialCategories: Category[] = [
  {
    id: "all-resources",
    name: "All Resources",
    type: "resource",
    items: [],
  },
  {
    id: "record-variables",
    name: "Record Variables",
    type: "resource",
    items: [
      {
        id: "account",
        name: "Account",
        type: "resource",
        icon: DocumentIcon,
        hasDetails: true,
        children: [
          {
            id: "account-entire",
            name: "Entire Resource",
            type: "resource",
            icon: FileTextIcon,
            hasDetails: true,
          },
          {
            id: "account-relationship",
            name: "Relationship Fields",
            type: "resource",
            icon: LinkIcon,
            children: [
              {
                id: "account-id",
                name: "Account ID",
                type: "resource",
                icon: IdIcon,
              },
              {
                id: "contact-id",
                name: "Contact ID",
                type: "resource",
                icon: UserIcon,
              },
              {
                id: "created-by-id",
                name: "Created By ID",
                type: "resource",
                icon: UserIcon,
                hasDetails: true,
              },
              {
                id: "individual-id",
                name: "Individual ID",
                type: "resource",
                icon: UserIcon,
              },
              {
                id: "last-modified-by-id",
                name: "Last Modified By ID",
                type: "resource",
                icon: UserIcon,
              },
              {
                id: "manager-id",
                name: "Manager ID",
                type: "resource",
                icon: UserIcon,
              },
            ],
          },
        ],
      },
      {
        id: "contact",
        name: "Contact",
        type: "resource",
        icon: DocumentIcon,
        hasDetails: true,
        children: [
          {
            id: "contact-entire",
            name: "Entire Resource",
            type: "resource",
            icon: FileTextIcon,
            hasDetails: true,
          },
          {
            id: "contact-fields",
            name: "Contact Fields",
            type: "resource",
            icon: TagIcon,
            children: [
              {
                id: "contact-name",
                name: "Name",
                type: "resource",
                icon: TagIcon,
              },
              {
                id: "contact-email",
                name: "Email",
                type: "resource",
                icon: MailIcon,
              },
              {
                id: "contact-phone",
                name: "Phone",
                type: "resource",
                icon: PhoneIcon,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "global-variables",
    name: "Global Variables",
    type: "resource",
    items: [
      {
        id: "api",
        name: "API",
        type: "resource",
        icon: GlobeIcon,
        hasDetails: true,
        children: [
          {
            id: "api-config",
            name: "API Configuration",
            type: "resource",
            icon: SettingsIcon,
          },
          {
            id: "api-endpoints",
            name: "API Endpoints",
            type: "resource",
            icon: LinkIcon,
          },
        ],
      },
    ],
  },
];
