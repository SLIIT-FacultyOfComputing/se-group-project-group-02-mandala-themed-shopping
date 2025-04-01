"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  customizable: boolean;
  images: string[];
};

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>({ images: [] });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setProducts);
  }, [token]);

  const handleSubmit = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/products/${editingId}`
      : "/api/admin/products";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const updated = await res.json();
      setProducts(prev => {
        if (editingId) {
          return prev.map(p => (p.id === editingId ? updated : p));
        } else {
          return [...prev, updated];
        }
      });
      setForm({ images: [] });
      setEditingId(null);
    } else {
      alert("Error saving product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      alert("Failed to delete");
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm(product);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white min-h-screen text-black">
      <Card className="shadow-md border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-700">
            {editingId ? "Edit Product" : "Add Product"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-gray-700">Name</Label>
            <Input
              className="mt-1 border-gray-300 bg-white text-gray-800"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-gray-700">Description</Label>
            <Input
              className="mt-1 border-gray-300 bg-white text-gray-800"
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">Price</Label>
              <Input
                type="number"
                className="mt-1 border-gray-300 bg-white text-gray-800"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: +e.target.value })}
              />
            </div>
            <div>
              <Label className="text-gray-700">Stock</Label>
              <Input
                type="number"
                className="mt-1 border-gray-300 bg-white text-gray-800"
                value={form.stockQuantity || ""}
                onChange={(e) => setForm({ ...form, stockQuantity: +e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-700">Category</Label>
            <Input
              className="mt-1 border-gray-300 bg-white text-gray-800"
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-gray-700">Image URLs</Label>
            <div className="space-y-2 mt-1">
              {(form.images || []).map((url, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    className="border-gray-300 bg-white text-gray-800"
                    value={url}
                    onChange={(e) => {
                      const updated = [...(form.images || [])];
                      updated[i] = e.target.value;
                      setForm({ ...form, images: updated });
                    }}
                  />
                  <Button
                    variant="destructive"
                    className="hover:bg-red-700"
                    onClick={() => {
                      const updated = (form.images || []).filter((_, index) => index !== i);
                      setForm({ ...form, images: updated });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="mt-2 hover:border-purple-600 hover:text-purple-600"
                onClick={() => {
                  const updated = [...(form.images || []), ""];
                  setForm({ ...form, images: updated });
                }}
              >
                Add Image
              </Button>
            </div>
          </div>

          {form.images?.length && form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {form.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Image ${i + 1}`}
                  className="w-full h-32 object-cover border rounded-lg shadow-sm"
                />
              ))}
            </div>
          )}

          <Button onClick={handleSubmit} className="bg-purple-600 text-white hover:bg-purple-700">
            {editingId ? "Update" : "Add"} Product
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-700">Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-gray-600 italic">No products found.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border rounded-lg p-4 hover:shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.price} LKR</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="hover:border-purple-600" onClick={() => startEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" className="hover:bg-red-700" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
