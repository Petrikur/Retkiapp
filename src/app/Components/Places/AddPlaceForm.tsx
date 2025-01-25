import { PlaceFormData } from "@/app/types";
import React, { useRef, useState, useEffect } from "react";
import {
  FaCampground,
  FaHiking,
  FaFish,
  FaMountain,
  FaPlus,
} from "react-icons/fa";
import { z } from "zod";

// InputField component for reusability
interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
}

const InputField = ({
  label,
  value,
  onChange,
  error,
  type = "text",
}: InputFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-200 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full p-2 bg-gray-700 rounded border ${
        error ? "border-red-500" : "border-gray-600"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const placeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.array(
    z.enum(["patikointi", "yöpyminen", "kalastus", "viinanjuonti"])
  ),
  position: z.tuple([z.number(), z.number()]),
  city: z.string().min(3, "City must be at least 3 characters"),
  zip: z.number().min(10000, "Zip code must be a valid 5 digit number"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  address: z.string().min(3, "Address must have over 3 chars"),
});

interface AddPlaceFormProps {
  position: [number, number];
  onSubmit: (placeData: PlaceFormData) => void;
  onClose: () => void;
}

const AddPlaceForm = ({ position, onSubmit, onClose }: AddPlaceFormProps) => {
  const [formData, setFormData] = useState<PlaceFormData>({
    name: "",
    description: "",
    category: [],
    position: position,
    city: "",
    zip: 0,
    country: "",
    address: "",
    image: "",
    averageRating: 0,
    reviewCount: 0,
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

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      zip: value ? parseInt(value, 10) : 0, // Convert to number on change
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 ">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-200">
          Lisää uusi paikka
        </h2>
      </div>

      {errors.submit && (
        <div className="text-red-500 text-sm p-2 bg-red-100 rounded">
          {errors.submit}
        </div>
      )}

      {/* Reusable Input Fields */}
      <InputField
        label="Nimi"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
      />

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Kuvaus
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={`w-full p-2 bg-gray-700 rounded  ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          rows={5} // Adjust rows to set the height of the textarea
          placeholder="Kirjoita kuvaus..."
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Categories */}
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

      {/* Position Display */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Sijainti (Latitude, Longitude)
        </label>
        <input
          type="text"
          value={`${formData.position[0].toFixed(
            6
          )}, ${formData.position[1].toFixed(6)}`} // Format the position as text
          readOnly
          className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-gray-400 disabled hover:cursor-not-allowed"
        />
      </div>

      {/* Address Fields */}
      <InputField
        label="Kaupunki"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        error={errors.city}
      />
      <InputField
        label="Postinumero"
        value={formData.zip}
        onChange={handleZipChange}
        error={errors.zip}
        type="number"
      />
      <InputField
        label="Osoite"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        error={errors.address}
      />
      <InputField
        label="Maa"
        value={formData.country}
        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        error={errors.country}
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 rounded"
          disabled={isSubmitting}
        >
          Peruuta
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Lisätään..."
          ) : (
            <span className="flex items-center gap-2">
              <FaPlus />
              Lisää paikka
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddPlaceForm;
