import { useState, useEffect } from "react";
import "./App.css";
import { DynamicSelect } from "./components/DynamicSelect";
import type { Category, ResourceItem } from "./types";
import { AddResourceModal } from "./components/AddResourceModal";
import {
  createResourceService,
  type ResourceService,
} from "./services/resourceService";
import { initialCategories } from "./data/initialData";

interface BreadcrumbItem {
  id: string;
  name: string;
  type: string;
}

function App() {
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [selectedPath, setSelectedPath] = useState<BreadcrumbItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [resourceService, setResourceService] =
    useState<ResourceService | null>(null);

  // Initialize resource service and categories
  useEffect(() => {
    const service = createResourceService(initialCategories);
    setResourceService(service);
    setCategories(service.getCategories());
  }, []);

  const handleItemSelect = (item: ResourceItem, path: BreadcrumbItem[]) => {
    setSelectedItem(item);
    setSelectedPath(path);
  };

  const handleAddResource = (path: BreadcrumbItem[]) => {
    setCurrentPath(path);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddNewResource = (resource: Omit<ResourceItem, "id">) => {
    if (resourceService) {
      const updatedCategories = resourceService.addResource(
        currentPath,
        resource
      );
      setCategories(updatedCategories);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Multi-Step Dynamic Selector</h1>

        <DynamicSelect
          categories={categories}
          onItemSelect={handleItemSelect}
          onAddResource={handleAddResource}
          placeholder="Enter value or search resources..."
        />

        {selectedItem && (
          <div className="selected-info">
            <h3>Selected Item:</h3>
            <p>
              <strong>Name:</strong> {selectedItem.name}
            </p>
            <p>
              <strong>Type:</strong> {selectedItem.type}
            </p>
            <p>
              <strong>ID:</strong> {selectedItem.id}
            </p>
            {selectedPath.length > 0 && (
              <p>
                <strong>Path:</strong>{" "}
                {selectedPath.map((p) => p.name).join(" > ")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAdd={handleAddNewResource}
        currentPath={currentPath}
      />
    </div>
  );
}

export default App;
