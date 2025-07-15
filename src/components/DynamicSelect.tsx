import React, { useState, useRef, useEffect } from "react";
import { SearchIcon, InfoIcon, ChevronRightIcon } from "./icons";
import type { ResourceItem, Category, BreadcrumbItem } from "../types";

interface DynamicSelectProps {
  categories: Category[];
  placeholder?: string;
  onItemSelect?: (item: ResourceItem, path: BreadcrumbItem[]) => void;
  onAddResource?: (path: BreadcrumbItem[]) => void;
  className?: string;
}

export function DynamicSelect({
  categories,
  placeholder = "Enter value or search resources...",
  onItemSelect,
  onAddResource,
  className = "",
}: DynamicSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([]);
  const [currentItems, setCurrentItems] = useState<ResourceItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize with top-level categories
  useEffect(() => {
    if (currentPath.length === 0) {
      const topLevelItems: ResourceItem[] = [];
      categories.forEach((category) => {
        category.items.forEach((item) => {
          topLevelItems.push(item);
        });
      });
      setCurrentItems(topLevelItems);
    }
  }, [categories, currentPath.length]);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      if (currentPath.length === 0) {
        const topLevelItems: ResourceItem[] = [];
        categories.forEach((category) => {
          category.items.forEach((item) => {
            topLevelItems.push(item);
          });
        });
        setCurrentItems(topLevelItems);
      }
      return;
    }

    // Search through all items recursively
    const searchResults: ResourceItem[] = [];

    const searchInItems = (
      items: ResourceItem[],
      path: BreadcrumbItem[] = []
    ) => {
      items.forEach((item) => {
        if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          searchResults.push({
            ...item,
            name: `${path.map((p) => p.name).join(" > ")} > ${
              item.name
            }`.replace(/^ > /, ""),
          });
        }
        if (item.children) {
          searchInItems(item.children, [
            ...path,
            { id: item.id, name: item.name, type: item.type },
          ]);
        }
      });
    };

    categories.forEach((category) => {
      searchInItems(category.items);
    });

    setCurrentItems(searchResults);
  }, [searchTerm, categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (item: ResourceItem) => {
    if (item.children && item.children.length > 0) {
      // Navigate to sub-items
      setCurrentPath([
        ...currentPath,
        { id: item.id, name: item.name, type: item.type },
      ]);
      setCurrentItems(item.children);
      setSearchTerm("");
    } else {
      // Final selection
      setSelectedItem(item);
      setIsOpen(false);
      setSearchTerm("");
      onItemSelect?.(item, [
        ...currentPath,
        { id: item.id, name: item.name, type: item.type },
      ]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Go to root
      setCurrentPath([]);
      const topLevelItems: ResourceItem[] = [];
      categories.forEach((category) => {
        category.items.forEach((item) => {
          topLevelItems.push(item);
        });
      });
      setCurrentItems(topLevelItems);
    } else {
      // Go to specific level
      const newPath = currentPath.slice(0, index + 1);
      setCurrentPath(newPath);

      // Find items at this level
      let items: ResourceItem[] = [];
      if (newPath.length === 0) {
        categories.forEach((category) => {
          category.items.forEach((item) => {
            items.push(item);
          });
        });
      } else {
        const lastItem = newPath[newPath.length - 1];
        // Find the item in the hierarchy
        const findItem = (searchItems: ResourceItem[]): ResourceItem | null => {
          for (const item of searchItems) {
            if (item.id === lastItem.id) {
              return item;
            }
            if (item.children) {
              const found = findItem(item.children);
              if (found) return found;
            }
          }
          return null;
        };

        categories.forEach((category) => {
          const found = findItem(category.items);
          if (found && found.children) {
            items = found.children;
          }
        });
      }
      setCurrentItems(items);
    }
    setSearchTerm("");
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);

    // If input is empty, clear all state
    if (!value.trim()) {
      setCurrentPath([]);
      setSelectedItem(null);
      setSearchTerm("");
      return;
    }

    // If user is editing a path, clear the current path
    if (value && !value.startsWith("{!")) {
      setCurrentPath([]);
      setSelectedItem(null);
    }
  };

  // Get the display value for the input field
  const getInputDisplayValue = () => {
    if (searchTerm.trim()) {
      return searchTerm;
    }
    if (selectedItem) {
      return selectedItem.name;
    }
    if (currentPath.length > 0) {
      return `{!${currentPath.map((p) => p.name).join(".")}.}`;
    }
    return "";
  };

  return (
    <div className={`dropdown-container ${className}`} ref={dropdownRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder={placeholder}
          value={getInputDisplayValue()}
          onChange={handleInputChange}
          onClick={handleInputClick}
          className="search-input"
          key={`input-${currentPath.length}-${searchTerm.length}`}
        />
        <span className="search-icon">
          <SearchIcon size={16} />
        </span>
      </div>

      {isOpen && (
        <div className="dropdown-content">
          {/* Breadcrumb Navigation */}
          {currentPath.length > 0 && (
            <div className="breadcrumb-container">
              <div className="breadcrumb">
                <span
                  className="breadcrumb-item clickable"
                  onClick={() => handleBreadcrumbClick(-1)}
                >
                  All Resources
                </span>
                {currentPath.map((item, index) => (
                  <span key={item.id}>
                    <span className="breadcrumb-separator">&gt; </span>
                    <span
                      className="breadcrumb-item clickable"
                      onClick={() => handleBreadcrumbClick(index)}
                    >
                      {item.name}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Current Level Items */}
          <div className="items-container">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className={`item ${
                  selectedItem?.id === item.id ? "selected" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                <span className="item-icon">
                  {typeof item.icon === "string" ? (
                    <span>{item.icon}</span>
                  ) : item.icon && typeof item.icon === "function" ? (
                    <span>📄</span>
                  ) : (
                    <span>📄</span>
                  )}
                </span>
                <span className="item-name">{item.name}</span>
                {item.hasDetails && (
                  <span className="info-icon">
                    <InfoIcon size={12} />
                  </span>
                )}
                {item.children && item.children.length > 0 && (
                  <span className="arrow">
                    <ChevronRightIcon size={10} />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* New Resource Button */}
          <div className="new-resource-container">
            <button
              className="new-resource-button"
              onClick={() => onAddResource?.(currentPath)}
            >
              <span className="new-resource-icon">+</span>
              <span className="new-resource-text">
                Add New Resource
                {currentPath.length > 0 && (
                  <span className="new-resource-path">
                    {" "}
                    at {currentPath.map((p) => p.name).join(" > ")}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
