
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, ChevronRight, ChevronDown, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type BudgetCategory = {
  id: string;
  name: string;
  isExpanded: boolean;
  items: BudgetItem[];
};

type BudgetItem = {
  id: string;
  name: string;
  estimated: number;
  actual: number;
  notes?: string;
};

const BudgetItemForm = ({ onSave }: { onSave?: (categories: BudgetCategory[]) => void }) => {
  // Initial categories with some sample data
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      id: "c1",
      name: "Housing",
      isExpanded: true,
      items: [
        { id: "i1", name: "Rent/Mortgage", estimated: 15000, actual: 15000 },
        { id: "i2", name: "Utilities", estimated: 3000, actual: 2800 },
        { id: "i3", name: "Maintenance", estimated: 2000, actual: 1500 },
      ],
    },
    {
      id: "c2",
      name: "Transportation",
      isExpanded: true,
      items: [
        { id: "i4", name: "Fuel", estimated: 4000, actual: 4500 },
        { id: "i5", name: "Public Transport", estimated: 2000, actual: 1800 },
        { id: "i6", name: "Vehicle Maintenance", estimated: 1500, actual: 0 },
      ],
    },
    {
      id: "c3",
      name: "Food",
      isExpanded: true,
      items: [
        { id: "i7", name: "Groceries", estimated: 8000, actual: 8500 },
        { id: "i8", name: "Dining Out", estimated: 5000, actual: 6200 },
      ],
    },
    {
      id: "c4",
      name: "Personal",
      isExpanded: true,
      items: [
        { id: "i9", name: "Healthcare", estimated: 3000, actual: 2500 },
        { id: "i10", name: "Education", estimated: 5000, actual: 5000 },
        { id: "i11", name: "Entertainment", estimated: 4000, actual: 4800 },
      ],
    },
    {
      id: "c5",
      name: "Savings & Investments",
      isExpanded: true,
      items: [
        { id: "i12", name: "Emergency Fund", estimated: 5000, actual: 5000 },
        { id: "i13", name: "Retirement", estimated: 8000, actual: 8000 },
      ],
    },
  ]);

  // Add a new budget category
  const addCategory = () => {
    const newCategory: BudgetCategory = {
      id: `c${Date.now()}`,
      name: "New Category",
      isExpanded: true,
      items: [],
    };
    setCategories([...categories, newCategory]);
  };

  // Delete a category
  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
    toast.success("Category deleted successfully");
  };

  // Add a new item to a category
  const addItem = (categoryId: string) => {
    const newItem: BudgetItem = {
      id: `i${Date.now()}`,
      name: "New Item",
      estimated: 0,
      actual: 0,
    };

    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: [...category.items, newItem],
            }
          : category
      )
    );
  };

  // Delete an item from a category
  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter((item) => item.id !== itemId),
            }
          : category
      )
    );
    toast.success("Item deleted successfully");
  };

  // Update a category name
  const updateCategoryName = (categoryId: string, newName: string) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              name: newName,
            }
          : category
      )
    );
  };

  // Update an item's properties
  const updateItem = (categoryId: string, itemId: string, field: keyof BudgetItem, value: string | number) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      [field]: field === "name" ? value : Number(value),
                    }
                  : item
              ),
            }
          : category
      )
    );
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              isExpanded: !category.isExpanded,
            }
          : category
      )
    );
  };

  // Calculate totals
  const calculateTotals = () => {
    let estimatedTotal = 0;
    let actualTotal = 0;

    categories.forEach((category) => {
      category.items.forEach((item) => {
        estimatedTotal += item.estimated;
        actualTotal += item.actual;
      });
    });

    return {
      estimatedTotal,
      actualTotal,
      difference: estimatedTotal - actualTotal,
    };
  };

  const { estimatedTotal, actualTotal, difference } = calculateTotals();

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(categories);
    }
    toast.success("Budget saved successfully");
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Monthly Budget</h2>
        <div>
          <Button onClick={handleSave} className="mr-2">
            Save Budget
          </Button>
          <Button onClick={addCategory} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Budget Table */}
      <div className="border rounded-md overflow-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Item</th>
              <th className="text-right p-3 font-medium w-[140px]">Estimated</th>
              <th className="text-right p-3 font-medium w-[140px]">Actual</th>
              <th className="text-right p-3 font-medium w-[140px]">Difference</th>
              <th className="p-3 w-[80px]"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                {/* Category Row */}
                <tr className="border-t bg-muted/50">
                  <td className="p-3">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleCategoryExpansion(category.id)}
                        className="p-1 mr-2 rounded-sm hover:bg-muted"
                        aria-label={
                          category.isExpanded ? "Collapse category" : "Expand category"
                        }
                      >
                        {category.isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategoryName(category.id, e.target.value)}
                        className="h-8 font-medium bg-transparent border-0 focus-visible:ring-1"
                      />
                    </div>
                  </td>
                  <td className="p-3 text-right font-medium">
                    {category.items.reduce((sum, item) => sum + item.estimated, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {category.items.reduce((sum, item) => sum + item.actual, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {(
                      category.items.reduce((sum, item) => sum + item.estimated, 0) -
                      category.items.reduce((sum, item) => sum + item.actual, 0)
                    ).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCategory(category.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>

                {/* Category Items */}
                {category.isExpanded &&
                  category.items.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-muted/30">
                      <td className="p-3 pl-9">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            updateItem(category.id, item.id, "name", e.target.value)
                          }
                          className="h-8 bg-transparent border-0 focus-visible:ring-1"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end">
                          <span className="font-bold">₹</span>
                          <Input
                            type="number"
                            value={item.estimated}
                            onChange={(e) =>
                              updateItem(
                                category.id,
                                item.id,
                                "estimated",
                                e.target.value
                              )
                            }
                            className="h-8 w-24 bg-transparent border-0 focus-visible:ring-1 text-right"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end">
                          <span className="font-bold">₹</span>
                          <Input
                            type="number"
                            value={item.actual}
                            onChange={(e) =>
                              updateItem(
                                category.id,
                                item.id,
                                "actual",
                                e.target.value
                              )
                            }
                            className="h-8 w-24 bg-transparent border-0 focus-visible:ring-1 text-right"
                          />
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`${
                            item.estimated - item.actual > 0
                              ? "text-green-600"
                              : item.estimated - item.actual < 0
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          ₹{(item.estimated - item.actual).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteItem(category.id, item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                {/* Add Item Button */}
                {category.isExpanded && (
                  <tr className="border-t">
                    <td colSpan={5} className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addItem(category.id)}
                        className="ml-8 text-muted-foreground"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {/* Budget Summary */}
            <tr className="border-t bg-muted">
              <td className="p-3 font-bold">Total</td>
              <td className="p-3 text-right font-bold">₹{estimatedTotal.toLocaleString('en-IN')}</td>
              <td className="p-3 text-right font-bold">₹{actualTotal.toLocaleString('en-IN')}</td>
              <td className="p-3 text-right font-bold">
                <span
                  className={`${
                    difference > 0
                      ? "text-green-600"
                      : difference < 0
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  ₹{difference.toLocaleString('en-IN')}
                </span>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetItemForm;
