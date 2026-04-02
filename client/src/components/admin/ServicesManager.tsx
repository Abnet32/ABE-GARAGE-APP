/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState, useEffect } from "react";
import type { Service } from "../../types";
import { Edit, Trash2 } from "lucide-react";
import {
  getServices,
  addServiceAPI,
  updateServiceAPI,
  deleteServiceAPI,
} from "../../api/service";

interface ServicesManagerProps {
  // Remove local handlers, we handle API inside now
}

const ServicesManager: React.FC<ServicesManagerProps> = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    try {
      if (editingId !== null) {
        const updated = await updateServiceAPI(
          editingId,
          formData as unknown as Omit<Service, "id">,
        );
        setServices((prev) =>
          prev.map((s) => (s.id === editingId ? updated : s)),
        );
        setEditingId(null);
      } else {
        const added = await addServiceAPI(
          formData as unknown as Omit<Service, "id">,
        );
        setServices((prev) => [...prev, added]);
      }
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to save service");
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({ name: service.name, description: service.description });
    setEditingId(service.id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      await deleteServiceAPI(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete service");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="space-y-12">
      {loading && <p>Loading services...</p>}

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-l-4 hover:border-l-brand-red transition-all"
          >
            <div className="flex-1">
              <h4 className="text-xl font-bold text-brand-blue font-heading">
                {service.name}
              </h4>
              <p className="text-sm text-gray-500 mt-2">
                {service.description}
              </p>
            </div>
            <div className="flex gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(service)}
                className="text-brand-red hover:bg-red-50 p-3 rounded transition-colors"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-brand-blue hover:bg-blue-50 p-3 rounded transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-lg shadow-md border-t-4 border-brand-red">
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            placeholder="Service name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded"
            required
          />
          <textarea
            rows={4}
            placeholder="Service description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-4 border border-gray-200 rounded"
            required
          ></textarea>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-brand-red text-white px-10 py-4 rounded"
            >
              {editingId !== null ? "Update Service" : "Add Service"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-200 text-gray-700 px-8 py-4 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesManager;
