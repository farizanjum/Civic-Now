
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Filter, MoreHorizontal, FileText, Download, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Sample budget history data
const historyData = [
  {
    id: "item-001",
    title: "Park Bench Installation",
    amount: 1200.00,
    category: "Infrastructure",
    date: "2025-04-02",
    receipt: true,
  },
  {
    id: "item-002",
    title: "Community Clean-up Supplies",
    amount: 350.75,
    category: "Maintenance",
    date: "2025-03-28",
    receipt: true,
  },
  {
    id: "item-003",
    title: "Neighborhood Watch Signs",
    amount: 520.00,
    category: "Services",
    date: "2025-03-15",
    receipt: true,
  },
  {
    id: "item-004",
    title: "Tree Planting Project",
    amount: 1800.00,
    category: "Infrastructure",
    date: "2025-03-10",
    receipt: true,
  },
  {
    id: "item-005",
    title: "Community Festival",
    amount: 3200.00,
    category: "Events",
    date: "2025-02-28",
    receipt: false,
  },
  {
    id: "item-006",
    title: "Street Lamp Maintenance",
    amount: 780.50,
    category: "Maintenance",
    date: "2025-02-15",
    receipt: true,
  },
  {
    id: "item-007",
    title: "Youth Center Supplies",
    amount: 950.25,
    category: "Education",
    date: "2025-02-05",
    receipt: true,
  },
  {
    id: "item-008",
    title: "Public Wifi Installation",
    amount: 2500.00,
    category: "Infrastructure",
    date: "2025-01-25",
    receipt: false,
  },
];

const categoryColors: Record<string, string> = {
  "Infrastructure": "bg-violet-100 text-violet-800",
  "Maintenance": "bg-red-100 text-red-800",
  "Services": "bg-blue-100 text-blue-800",
  "Events": "bg-orange-100 text-orange-800",
  "Education": "bg-green-100 text-green-800",
  "Other": "bg-gray-100 text-gray-800",
};

const BudgetHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredItems = historyData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteItem = (id: string) => {
    toast({
      title: "Item Deleted",
      description: "The budget item has been removed from your records.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Budget History</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Items</DropdownMenuItem>
                <DropdownMenuItem>Infrastructure</DropdownMenuItem>
                <DropdownMenuItem>Maintenance</DropdownMenuItem>
                <DropdownMenuItem>Services</DropdownMenuItem>
                <DropdownMenuItem>Events</DropdownMenuItem>
                <DropdownMenuItem>Education</DropdownMenuItem>
                <DropdownMenuItem>Other</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-civic-blue hover:bg-civic-blue-dark">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-civic-gray-dark">No budget items found matching your search.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-center font-medium">Receipt</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? '' : 'bg-gray-50'} hover:bg-gray-100`}>
                    <td className="px-4 py-3">{item.title}</td>
                    <td className="px-4 py-3">
                      <Badge className={`${categoryColors[item.category] || "bg-gray-100 text-gray-800"}`}>
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 flex items-center">
                      <Calendar size={14} className="mr-2 text-civic-gray" />
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">${item.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      {item.receipt ? (
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          <FileText size={16} className="mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-civic-gray">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit size={14} className="mr-2" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600" 
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetHistory;
