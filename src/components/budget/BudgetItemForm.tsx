
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Check, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Item {
  name: string;
  price: number;
}

interface ProcessedData {
  amount: number | null;
  date: string | null;
  merchant: string | null;
  items?: Item[];
  rawText: string;
}

interface BudgetItemFormProps {
  initialData: ProcessedData;
}

export const BudgetItemForm = ({ initialData }: BudgetItemFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData.merchant || "",
    amount: initialData.amount?.toString() || "",
    category: "",
    date: initialData.date || "",
    notes: "",
    items: initialData.items || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const updatedItems = [...formData.items];
    if (field === 'name') {
      updatedItems[index].name = value;
    } else if (field === 'price') {
      updatedItems[index].price = parseFloat(value) || 0;
    }
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: "", price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally send data to your backend
    console.log("Budget item data:", formData);
    
    toast({
      title: "Budget Item Saved",
      description: "The budget item has been added to your records.",
      variant: "default",
    });
    
    // Reset form
    setFormData({
      title: "",
      amount: "",
      category: "",
      date: "",
      notes: "",
      items: []
    });
  };

  const calculateTotal = (): number => {
    return formData.items.reduce((sum, item) => sum + item.price, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title/Merchant</Label>
          <Input 
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title or merchant name"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Total Amount ($)</Label>
            <Input 
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              type="number"
              step="0.01"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              type="date"
              required
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={handleCategoryChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="services">Public Services</SelectItem>
              <SelectItem value="events">Community Events</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Items Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <Label>Line Items</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addItem}
              className="flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Item
            </Button>
          </div>
          
          {formData.items.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Item Description</TableHead>
                    <TableHead className="w-[30%]">Price ($)</TableHead>
                    <TableHead className="w-[10%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          placeholder="Item description"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          placeholder="0.00"
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Total Row */}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">${calculateTotal().toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed rounded-md text-civic-gray">
              No items added yet
            </div>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Input 
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any relevant notes"
          />
        </div>
        
        <Button type="submit" className="mt-4 bg-civic-blue hover:bg-civic-blue-dark">
          <Check size={16} className="mr-2" />
          Save Budget Item
        </Button>
      </div>
    </form>
  );
};
