import type { Category, ResourceItem } from "../types";

export interface ResourceService {
  getCategories: () => Category[];
  addResource: (
    path: Array<{ id: string; name: string; type: string }>,
    resource: Omit<ResourceItem, "id">
  ) => Category[];
  updateResource: (
    resourceId: string,
    updates: Partial<ResourceItem>
  ) => Category[];
  deleteResource: (resourceId: string) => Category[];
}

export class LocalResourceService implements ResourceService {
  private categories: Category[];

  constructor(initialCategories: Category[]) {
    this.categories = JSON.parse(JSON.stringify(initialCategories)); // Deep clone
  }

  getCategories(): Category[] {
    return JSON.parse(JSON.stringify(this.categories)); // Return deep clone
  }

  addResource(
    path: Array<{ id: string; name: string; type: string }>,
    resource: Omit<ResourceItem, "id">
  ): Category[] {
    const newCategories = JSON.parse(JSON.stringify(this.categories));
    const newResource: ResourceItem = {
      ...resource,
      id: this.generateId(),
    };

    if (path.length === 0) {
      // Add to root level - find appropriate category
      const category = newCategories.find(
        (cat: Category) => cat.type === resource.type
      );
      if (category) {
        category.items.push(newResource);
      }
    } else {
      // Add to specific path
      this.addResourceToPath(newCategories, path, newResource);
    }

    this.categories = newCategories;
    return newCategories;
  }

  updateResource(
    resourceId: string,
    updates: Partial<ResourceItem>
  ): Category[] {
    const newCategories = JSON.parse(JSON.stringify(this.categories));

    const updateResourceInItems = (items: ResourceItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === resourceId) {
          items[i] = { ...items[i], ...updates };
          return true;
        }
        if (items[i].children) {
          if (updateResourceInItems(items[i].children!)) {
            return true;
          }
        }
      }
      return false;
    };

    for (const category of newCategories) {
      if (updateResourceInItems(category.items)) {
        break;
      }
    }

    this.categories = newCategories;
    return newCategories;
  }

  deleteResource(resourceId: string): Category[] {
    const newCategories = JSON.parse(JSON.stringify(this.categories));

    const deleteResourceFromItems = (items: ResourceItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === resourceId) {
          items.splice(i, 1);
          return true;
        }
        if (items[i].children) {
          if (deleteResourceFromItems(items[i].children!)) {
            return true;
          }
        }
      }
      return false;
    };

    for (const category of newCategories) {
      if (deleteResourceFromItems(category.items)) {
        break;
      }
    }

    this.categories = newCategories;
    return newCategories;
  }

  private addResourceToPath(
    categories: Category[],
    path: Array<{ id: string; name: string; type: string }>,
    resource: ResourceItem
  ): boolean {
    const findAndAddToPath = (
      items: ResourceItem[],
      currentPathIndex: number
    ): boolean => {
      for (const item of items) {
        if (item.id === path[currentPathIndex].id) {
          if (currentPathIndex === path.length - 1) {
            // We're at the target level, add the resource
            if (!item.children) {
              item.children = [];
            }
            item.children.push(resource);
            return true;
          } else {
            // Continue down the path
            if (item.children) {
              return findAndAddToPath(item.children, currentPathIndex + 1);
            }
          }
        }
      }
      return false;
    };

    for (const category of categories) {
      if (findAndAddToPath(category.items, 0)) {
        return true;
      }
    }
    return false;
  }

  private generateId(): string {
    return `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Factory function to create a resource service
export function createResourceService(
  initialCategories: Category[]
): ResourceService {
  return new LocalResourceService(initialCategories);
}
