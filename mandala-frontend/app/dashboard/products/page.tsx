"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Edit, Plus } from "lucide-react"

type Product = {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  category: string
  customizable: boolean
  images: string[]
  sizes?: string[]
}

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]

export default function AdminProductsPage() {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<Partial<Product>>({})
  const [file, setFile] = useState<File | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products")
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load products:", err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const resetForm = () => {
    setForm({})
    setFile(null)
    setIsEditing(false)
    setEditingProductId(null)
    setPreviewUrl(null)
  }

  const handleSaveProduct = async () => {
    if (!token) {
      alert("You're not authorized. Token missing.")
      return
    }

    if (!form.name || !form.price || !form.stockQuantity || !form.category) {
      alert("Please fill in all required fields.")
      return
    }

    // Show loading state
    setLoading(true)

    const formData = new FormData()
    const productData = {
      name: form.name,
      description: form.description || "",
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      category: form.category,
      customizable: false,
      colors: [],
      sizes: form.sizes || [],
    }

    formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }))
    
    // Only append file if we have one
    if (file) {
      formData.append("images", file)
    }

    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing
        ? `http://localhost:8080/api/admin/products/${editingProductId}`
        : `http://localhost:8080/api/admin/products`

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (res.ok) {
        const savedProduct = await res.json()
        console.log('Saved product:', savedProduct)
        alert(isEditing ? "Product updated!" : "Product added!")
        resetForm()
        fetchProducts()
      } else {
        const error = await res.text()
        console.error("Server error:", error)
        alert("Failed to save product: " + error)
      }
    } catch (err) {
      console.error("Request failed:", err)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setForm(product)
    setIsEditing(true)
    setEditingProductId(product.id)
    
    // Set preview image if product has images
    if (product.images && product.images.length > 0) {
      setPreviewUrl(product.images[0])
    }
  }
  
  // Handle file change and generate preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    
    // Create and set preview URL
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="text-center relative py-6">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-contain bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%239333ea" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm0-200c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0-320c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0 80c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z"></path></svg>\')',
            }}
          ></div>
          <div className="flex items-center justify-center gap-2">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">Product Management</h1>
          </div>
          <p className="text-purple-600 mt-1">Manage your mandala marketplace products</p>
        </div>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                {isEditing ? (
                  <Edit className="h-4 w-4 text-purple-600" />
                ) : (
                  <Plus className="h-4 w-4 text-purple-600" />
                )}
              </div>
              <CardTitle className="text-xl text-purple-800">{isEditing ? "Update Product" : "Add Product"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="font-medium text-purple-700">Name</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-purple-200 focus-visible:ring-purple-400 rounded-xl mt-1"
              />
            </div>
            <div>
              <Label className="font-medium text-purple-700">Description</Label>
              <Input
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-purple-200 focus-visible:ring-purple-400 rounded-xl mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium text-purple-700">Price</Label>
                <Input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: +e.target.value })}
                  className="border-purple-200 focus-visible:ring-purple-400 rounded-xl mt-1"
                />
              </div>
              <div>
                <Label className="font-medium text-purple-700">Stock</Label>
                <Input
                  type="number"
                  value={form.stockQuantity || ""}
                  onChange={(e) => setForm({ ...form, stockQuantity: +e.target.value })}
                  className="border-purple-200 focus-visible:ring-purple-400 rounded-xl mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="font-medium text-purple-700">Category</Label>
              <Input
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border-purple-200 focus-visible:ring-purple-400 rounded-xl mt-1"
              />
            </div>

            <div>
              <Label className="font-medium text-purple-700">Sizes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSizes.map((size) => (
                  <label
                    key={size}
                    className={`flex items-center space-x-2 border rounded-xl px-3 py-1.5 cursor-pointer transition-colors ${
                      form.sizes?.includes(size)
                        ? "bg-purple-100 border-purple-300 text-purple-800"
                        : "bg-white border-purple-200 text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox text-purple-600 rounded"
                      checked={form.sizes?.includes(size) || false}
                      onChange={(e) => {
                        const newSizes = form.sizes ? [...form.sizes] : []
                        if (e.target.checked) {
                          newSizes.push(size)
                        } else {
                          const index = newSizes.indexOf(size)
                          if (index > -1) newSizes.splice(index, 1)
                        }
                        setForm({ ...form, sizes: newSizes })
                      }}
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="font-medium text-purple-700">Product Image</Label>
              
              {/* Image preview */}
              {previewUrl && (
                <div className="mb-3 relative">
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-purple-200 mb-2">
                    <img 
                      src={previewUrl} 
                      alt="Product preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setPreviewUrl(null)
                      setFile(null)
                    }}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600 rounded-full w-8 h-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
              )}
              
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border-purple-200 focus-visible:ring-purple-400 rounded-xl mt-1"
              />
              <p className="text-xs text-purple-500 mt-1">
                Upload a high-quality product image (recommended size: 800x800px)
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                onClick={handleSaveProduct}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-xl"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  isEditing ? "Update Product" : "Add Product"
                )}
              </Button>
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl"
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-purple-800">Product List</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8 text-purple-600">
                <p>No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-purple-100 rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.images?.[0] || "/placeholder.svg?height=200&width=400"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-lg text-purple-800">{product.name}</h3>
                      <p className="text-purple-900 font-medium">{product.price.toLocaleString()} LKR</p>
                      <p className="text-sm text-purple-600 line-clamp-2">{product.description}</p>

                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {product.sizes.map((size) => (
                            <span
                              key={size}
                              className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full border border-purple-100"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      )}

                      <Separator className="my-2 bg-purple-100" />

                      <Button
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl gap-2"
                      >
                        <Edit className="h-4 w-4" /> Edit Product
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="h-16 w-full bg-gradient-to-t from-purple-100 to-transparent"></div>
    </div>
  )
}
