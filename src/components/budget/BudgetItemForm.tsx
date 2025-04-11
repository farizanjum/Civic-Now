
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface ProcessedData {
  amount: number | null;
  date: string | null;
  merchant: string | null;
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
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
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
      notes: ""
    });
  };

  return (
    <form onSubmit={handleSubmit}>
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
        
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount ($)</Label>
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
        
        <Button type="submit" className="mt-2 bg-civic-blue hover:bg-civic-blue-dark">
          <Check size={16} className="mr-2" />
          Save Budget Item
        </Button>
      </div>
    </form>
  );
};
