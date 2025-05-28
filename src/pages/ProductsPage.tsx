import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddProduct = () => {
    if (newProductName.trim()) {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: newProductName.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
      setNewProductName('');
    }
  };

  const handleEditProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditingProduct(productId);
      setEditName(product.name);
    }
  };

  const handleSaveEdit = (productId: string) => {
    if (editName.trim()) {
      setProducts(products.map(product =>
        product.id === productId
          ? { ...product, name: editName.trim(), updatedAt: new Date().toISOString() }
          : product
      ));
      setEditingProduct(null);
      setEditName('');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  return (
    <AppLayout>
      {/* Wrapper centralisé avec padding responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500 max-w-xl">
            Manage your product catalog
          </p>
        </div>

        {/* Card principale avec ombre */}
        <div className="bg-white shadow rounded-lg overflow-hidden max-w-7xl mx-auto">
          <div className="p-4 sm:p-6">

            {/* Formulaire ajout produit */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <Input
                placeholder="Enter product name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                fullWidth
                className="sm:flex-1"
              />
             <Button
                onClick={handleAddProduct}
                disabled={!newProductName.trim()}
                icon={<Plus className="h-4 w-4" />}
                className="whitespace-nowrap"
              >
                Add Product
              </Button>
            </div>

            {/* Table desktop */}
            <div className="hidden sm:block overflow-x-auto">
              {products.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No products added yet. Start by adding your first product!
                </div>
              ) : (
                <table className="min-w-[600px] divide-y divide-gray-200 w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          {editingProduct === product.id ? (
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">{product.name}</div>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(product.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {editingProduct === product.id ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Check className="h-4 w-4" />}
                                onClick={() => handleSaveEdit(product.id)}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<X className="h-4 w-4" />}
                                onClick={() => setEditingProduct(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Pencil className="h-4 w-4" />}
                                onClick={() => handleEditProduct(product.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Trash2 className="h-4 w-4" />}
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden">
              {products.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No products added yet. Start by adding your first product!
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                      {editingProduct === product.id ? (
                        <div>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="mb-4 w-full"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Check className="h-4 w-4" />}
                              onClick={() => handleSaveEdit(product.id)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<X className="h-4 w-4" />}
                              onClick={() => setEditingProduct(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-lg font-semibold text-gray-900 mb-2">{product.name}</div>
                          <div className="text-sm text-gray-500 mb-2">
                            Created: {new Date(product.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500 mb-4">
                            Updated: {new Date(product.updatedAt).toLocaleDateString()}
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Pencil className="h-4 w-4" />}
                              onClick={() => handleEditProduct(product.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Trash2 className="h-4 w-4" />}
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default ProductsPage;
