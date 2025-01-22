import React, { useRef, useState, useEffect } from "react";
import { FaCampground, FaHiking, FaFish, FaMountain } from "react-icons/fa";
import { z } from "zod";

const placeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.array(
    z.enum(["patikointi", "yöpyminen", "kalastus", "viinanjuonti"])
  ),
  position: z.tuple([z.number(), z.number()]),
});

interface AddPlaceFormProps {
  position: [number, number];
  onSubmit: (placeData: PlaceFormData) => void;
  onClose: () => void;
}

export interface PlaceFormData {
  name: string;
  description: string;
  category: string[]; // Array of strings for multiple categories
  position: [number, number];
}

const AddPlaceForm = ({ position, onSubmit, onClose }: AddPlaceFormProps) => {
  const [formData, setFormData] = useState<PlaceFormData>({
    name: "",
    description: "",
    category: [],
    position: position,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitInProgress = useRef(false);

  const categories = [
    { id: "patikointi", icon: FaHiking, label: "Patikointi" },
    { id: "yöpyminen", icon: FaCampground, label: "Yöpyminen" },
    { id: "kalastus", icon: FaFish, label: "Kalastus" },
    { id: "viinanjuonti", icon: FaMountain, label: "Viinan juonti" },
  ];

  const validateForm = () => {
    try {
      placeSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit(formData);
    onClose();
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prevData) => {
      const updatedCategories = prevData.category.includes(category)
        ? prevData.category.filter((cat) => cat !== category)
        : [...prevData.category, category];

      return { ...prevData, category: updatedCategories };
    });
  };

  useEffect(() => {
    setErrors({});
    setIsSubmitting(false);
    submitInProgress.current = false;
  }, []);

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {errors.submit && (
        <div className="text-red-500 text-sm p-2 bg-red-100 rounded">
          {errors.submit}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Nimi
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full p-2 bg-gray-700 rounded border ${
            errors.name ? "border-red-500" : "border-gray-600"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Kuvaus
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={`w-full p-2 bg-gray-700 rounded border ${
            errors.description ? "border-red-500" : "border-gray-600"
          }`}
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Kategoria
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleCategoryToggle(id)}
              className={`flex items-center gap-2 p-2 rounded ${
                formData.category.includes(id) ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 rounded"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Place"}
        </button>
      </div>
    </form>
  );
};

export default AddPlaceForm;
