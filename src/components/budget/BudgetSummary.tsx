import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";

// Mock data with higher values
const budgetData = {
  totalBudget: 75000000000, // 750 crore in rupees
  spent: 32500000000, // 325 crore in rupees
  remaining: 42500000000, // 425 crore in rupees
  categories: [
    { name: "Infrastructure", value: 25000000000 },
    { name: "Education", value: 15000000000 },
    { name: "Healthcare", value: 12000000000 },
    { name: "Parks & Recreation", value: 8000000000 },
    { name: "Public Safety", value: 10000000000 },
    { name: "Administration", value: 5000000000 },
  ],
  monthlySpending: [
    { month: "Jan", amount: 4500000000 },
    { month: "Feb", amount: 5200000000 },
    { month: "Mar", amount: 5800000000 },
    { month: "Apr", amount: 6200000000 },
    { month: "May", amount: 7100000000 },
    { month: "Jun", amount: 3700000000 },
  ],
};

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

// Format number to crore rupees
const formatToCrore = (num: number) => {
  return `₹${(num / 10000000).toFixed(2)} Cr`;
};

// Format large numbers with commas
const formatNumber = (num: number) => {
  return `₹${num.toLocaleString("en-IN")}`;
};

const BudgetSummary = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-civic-blue">
              ₹{(budgetData.totalBudget / 10000000).toFixed(2)} Cr
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fiscal Year 2025-2026
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              ₹{(budgetData.spent / 10000000).toFixed(2)} Cr
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((budgetData.spent / budgetData.totalBudget) * 100).toFixed(1)}% of total budget
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              ₹{(budgetData.remaining / 10000000).toFixed(2)} Cr
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((budgetData.remaining / budgetData.totalBudget) * 100).toFixed(1)}% of total budget
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="category">Category Breakdown</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Spending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData.categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {budgetData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {budgetData.categories.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs">
                      {entry.name}: {formatToCrore(entry.value)}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="category" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData.categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)}Cr`} />
                    <Tooltip formatter={(value) => formatNumber(Number(value))} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={budgetData.monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                    <Tooltip formatter={(value) => formatNumber(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Spending" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" size="sm">
                  Download Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
