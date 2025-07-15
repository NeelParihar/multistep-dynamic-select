# Multi-Step Dynamic Select Component

A modern, responsive React TypeScript component that provides an intelligent hierarchical search and selection interface for categorized resources. This component features a dynamic dropdown with multi-step navigation, breadcrumb trails, search functionality, and the ability to add new resources dynamically.

## Features

- **🔍 Smart Search**: Real-time filtering across all categories and nested items
- **📂 Hierarchical Navigation**: Multi-step navigation through nested resource structures
- **🍞 Breadcrumb Navigation**: Visual breadcrumb trail showing current location in the hierarchy
- **➕ Add New Resources**: Dynamic resource creation at any level in the hierarchy
- **🎨 SVG Icons**: Scalable vector icons for better visual consistency
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ TypeScript**: Fully typed for better development experience
- **🎨 Modern UI**: Clean, accessible design with smooth animations
- **🔄 Path Display**: Input field shows current navigation path in format `{!Account.LastModifiedBy.}`

## Demo

The component displays a searchable dropdown with hierarchical navigation:

- **Record Variables**
  - **Account**
    - Entire Resource
    - Relationship Fields
      - Account ID
      - Contact ID
      - Created By ID
      - Individual ID
      - Last Modified By ID
      - Manager ID
  - **Contact**
    - Entire Resource
    - Contact Fields
      - Name
      - Email
      - Phone
  - **API**
    - API Configuration
    - API Endpoints

Each item includes an SVG icon, name, and optional details indicator. Users can navigate through the hierarchy and add new resources at any level.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd multistep-dynamic-select
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Usage

The component is ready to use out of the box. The main `App.tsx` file contains:

- Hierarchical data structure with nested items
- Multi-step navigation with breadcrumb trails
- Search functionality with real-time filtering across all levels
- Add new resource functionality with modal form
- Click-outside-to-close behavior
- Selection state management

### Data Structure

```typescript
interface ResourceItem {
  id: string;
  name: string;
  type: "resource";
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description?: string;
  hasDetails?: boolean;
  children?: ResourceItem[]; // For nested items
}

interface Category {
  id: string;
  name: string;
  type: "resource";
  items: ResourceItem[];
}

interface BreadcrumbItem {
  id: string;
  name: string;
  type: string;
}
```

### Component Props

```typescript
interface DynamicSelectProps {
  categories: Category[];
  placeholder?: string;
  onItemSelect?: (item: ResourceItem, path: BreadcrumbItem[]) => void;
  onAddResource?: (path: BreadcrumbItem[]) => void;
  className?: string;
}
```

## Key Components

### DynamicSelect

The main component that handles:

- Multi-step navigation through hierarchical data
- Breadcrumb trail display and navigation
- Search functionality across all levels
- Item selection with path information
- Add new resource button integration

### AddResourceModal

A reusable modal component for adding new resources:

- Form validation
- Name and description fields
- Options for adding details and sub-items
- Integration with resource service

### Resource Service

A modular service for managing resource data:

- Immutable data operations
- Path-based resource management
- Add, update, and delete operations

## Customization

### Styling

The component uses CSS classes for styling. Key classes include:

- `.search-input` - Main search input styling
- `.dropdown-content` - Dropdown container
- `.breadcrumb-container` - Breadcrumb navigation styling
- `.items-container` - Items list container
- `.item` - Individual item styling
- `.selected` - Selected item highlighting
- `.new-resource-container` - Add resource button styling

### Adding New Categories/Items

To add new categories or items, modify the `initialCategories` array in `src/data/initialData.ts`:

```typescript
export const initialCategories: Category[] = [
  {
    id: "new-category",
    name: "New Category",
    type: "resource",
    items: [
      {
        id: "new-item",
        name: "New Item",
        type: "resource",
        icon: DocumentIcon,
        hasDetails: true,
        children: [
          {
            id: "sub-item",
            name: "Sub Item",
            type: "resource",
            icon: FileTextIcon,
          },
        ],
      },
    ],
  },
  // ... existing categories
];
```

### SVG Icons

The project includes a comprehensive SVG icon library in `src/components/icons.tsx`. To add new icons:

```typescript
export const NewIcon = ({ className = "", size = 16 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* SVG path data */}
  </svg>
);
```

## Project Structure

```
src/
├── components/
│   ├── DynamicSelect.tsx     # Main select component
│   ├── AddResourceModal.tsx  # Modal for adding resources
│   └── icons.tsx            # SVG icon library
├── data/
│   └── initialData.ts       # Initial data structure
├── services/
│   └── resourceService.ts   # Resource management service
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main application component
├── App.css                  # Component styles
├── main.tsx                 # Application entry point
└── index.css                # Global styles
```

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **CSS3** - Styling with modern features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with React and TypeScript
- Styled with modern CSS
- Developed using Vite for fast development experience
- SVG icons for scalable visual elements
