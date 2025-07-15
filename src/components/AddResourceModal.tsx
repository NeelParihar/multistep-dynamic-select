import React, { useState, useEffect } from "react";
import type { ResourceItem } from "../types";
import { DocumentIcon } from "./icons";

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (resource: Omit<ResourceItem, "id">) => void;
  currentPath: Array<{ id: string; name: string; type: string }>;
}

export function AddResourceModal({
  isOpen,
  onClose,
  onAdd,
  currentPath,
}: AddResourceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "resource" as ResourceItem["type"],
    icon: DocumentIcon,
    description: "",
    hasDetails: false,
    hasChildren: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        type: "resource",
        icon: DocumentIcon,
        description: "",
        hasDetails: false,
        hasChildren: false,
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newResource: Omit<ResourceItem, "id"> = {
      name: formData.name.trim(),
      type: formData.type,
      icon: formData.icon,
      description: formData.description.trim() || undefined,
      hasDetails: formData.hasDetails,
      children: formData.hasChildren ? [] : undefined,
    };

    onAdd(newResource);
    onClose();
  };

  const handleInputChange = (
    field: string,
    value:
      | string
      | boolean
      | React.ComponentType<{ className?: string; size?: number }>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Resource</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="resource-name">Resource Name *</label>
            <input
              id="resource-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter resource name"
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="resource-description">Description</label>
            <textarea
              id="resource-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.hasDetails}
                onChange={(e) =>
                  handleInputChange("hasDetails", e.target.checked)
                }
              />
              <span>Has Details (shows info icon)</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.hasChildren}
                onChange={(e) =>
                  handleInputChange("hasChildren", e.target.checked)
                }
              />
              <span>Can have sub-items (expandable)</span>
            </label>
          </div>

          {currentPath.length > 0 && (
            <div className="form-group">
              <label>Location</label>
              <div className="location-display">
                {currentPath.map((item, index) => (
                  <span key={item.id}>
                    {index > 0 && <span className="path-separator">&gt; </span>}
                    <span className="path-item">{item.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
