
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartPie, Users, MapPin, Filter } from 'lucide-react';

// Types for impact data
interface DemographicData {
  name: string;
  value: number;
  color: string;
}

interface NeighborhoodData {
  name: string;
  impactLevel: number; // 1-10 scale
  population: number;
  demographics: {
    [key: string]: number; // Percentage distribution
  };
}

interface ImpactData {
  id: string;
  title: string;
  category: string;
  demographics: {
    age: DemographicData[];
    income: DemographicData[];
    occupation: DemographicData[];
  };
  neighborhoods: NeighborhoodData[];
}

// Sample data for visualization
const sampleImpactData: ImpactData = {
  id: "impact-001",
  title: "Green Space Development Plan",
  category: "Environment",
  demographics: {
    age: [
      { name: "18-24", value: 15, color: "#3498db" },
      { name: "25-34", value: 30, color: "#2ecc71" },
      { name: "35-44", value: 25, color: "#f1c40f" },
      { name: "45-60", value: 20, color: "#e67e22" },
      { name: "60+", value: 10, color: "#e74c3c" }
    ],
    income: [
      { name: "Low Income", value: 25, color: "#9b59b6" },
      { name: "Middle Income", value: 45, color: "#1abc9c" },
      { name: "High Income", value: 30, color: "#34495e" }
    ],
    occupation: [
      { name: "Students", value: 15, color: "#d35400" },
      { name: "Service Sector", value: 30, color: "#27ae60" },
      { name: "IT/Tech", value: 25, color: "#3498db" },
      { name: "Business", value: 20, color: "#f39c12" },
      { name: "Retired", value: 10, color: "#7f8c8d" }
    ]
  },
  neighborhoods: [
    {
      name: "Indiranagar",
      impactLevel: 8,
      population: 125000,
      demographics: {
        "Young Adults": 35,
        "Families": 40,
        "Seniors": 25
      }
    },
    {
      name: "Koramangala",
      impactLevel: 7,
      population: 150000,
      demographics: {
        "Young Adults": 45,
        "Families": 35,
        "Seniors": 20
      }
    },
    {
      name: "HSR Layout",
      impactLevel: 6,
      population: 100000,
      demographics: {
        "Young Adults": 40,
        "Families": 45,
        "Seniors": 15
      }
    },
    {
      name: "Whitefield",
      impactLevel: 9,
      population: 180000,
      demographics: {
        "Young Adults": 30,
        "Families": 50,
        "Seniors": 20
      }
    }
  ]
};

const ImpactVisualization: React.FC = () => {
  const [demographicFilter, setDemographicFilter] = useState<'age' | 'income' | 'occupation'>('age');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("all");
  
  // Simple custom tooltip for the charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Get impact level color based on score
  const getImpactColor = (level: number) => {
    if (level >= 8) return "bg-red-500";
    if (level >= 6) return "bg-orange-500";
    if (level >= 4) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-civic-blue flex items-center">
            <ChartPie className="mr-2 h-5 w-5" /> 
            Impact Visualization
          </CardTitle>
          <Badge variant="outline">{sampleImpactData.category}</Badge>
        </div>
        <CardDescription>
          {sampleImpactData.title}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demographics" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Demographics
            </TabsTrigger>
            <TabsTrigger value="neighborhoods" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Neighborhoods
            </TabsTrigger>
          </TabsList>
          
          {/* Demographics Tab */}
          <TabsContent value="demographics" className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Demographic Impact</h3>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <Select 
                  value={demographicFilter} 
                  onValueChange={(value) => setDemographicFilter(value as 'age' | 'income' | 'occupation')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="age">Age Group</SelectItem>
                    <SelectItem value="income">Income Level</SelectItem>
                    <SelectItem value="occupation">Occupation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sampleImpactData.demographics[demographicFilter]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sampleImpactData.demographics[demographicFilter].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-civic-blue mb-2">What This Means</h4>
              <p className="text-sm">
                This visualization shows how different demographic groups may be affected by the proposed legislation. 
                The larger the segment, the more significant the impact on that group.
              </p>
            </div>
          </TabsContent>
          
          {/* Neighborhoods Tab */}
          <TabsContent value="neighborhoods" className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Neighborhood Impact</h3>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <Select 
                  value={selectedNeighborhood} 
                  onValueChange={setSelectedNeighborhood}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select neighborhood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Neighborhoods</SelectItem>
                    {sampleImpactData.neighborhoods.map((neighborhood) => (
                      <SelectItem key={neighborhood.name} value={neighborhood.name}>
                        {neighborhood.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedNeighborhood === "all" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleImpactData.neighborhoods.map((neighborhood) => (
                  <Card key={neighborhood.name} className="overflow-hidden">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{neighborhood.name}</CardTitle>
                        <div className={`${getImpactColor(neighborhood.impactLevel)} text-white text-xs px-2 py-1 rounded-full`}>
                          Impact: {neighborhood.impactLevel}/10
                        </div>
                      </div>
                      <CardDescription className="text-xs">
                        Population: {neighborhood.population.toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <h4 className="text-sm font-medium mb-2">Demographics</h4>
                      <div className="space-y-2">
                        {Object.entries(neighborhood.demographics).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span>{key}:</span>
                            <div className="flex items-center">
                              <div className="w-32 h-2 bg-gray-200 rounded overflow-hidden mr-2">
                                <div 
                                  className="h-full bg-civic-blue" 
                                  style={{ width: `${value}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div>
                {sampleImpactData.neighborhoods
                  .filter(n => n.name === selectedNeighborhood)
                  .map((neighborhood) => (
                    <div key={neighborhood.name} className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle>{neighborhood.name}</CardTitle>
                            <div className={`${getImpactColor(neighborhood.impactLevel)} text-white px-2 py-1 rounded-full text-sm`}>
                              Impact Level: {neighborhood.impactLevel}/10
                            </div>
                          </div>
                          <CardDescription>
                            Population: {neighborhood.population.toLocaleString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <h4 className="font-medium mb-2">Demographic Breakdown</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={Object.entries(neighborhood.demographics).map(([name, value], index) => ({
                                    name,
                                    value,
                                    color: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'][index % 5]
                                  }))}
                                  cx="50%"
                                  cy="50%"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {Object.entries(neighborhood.demographics).map(([name, value], index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'][index % 5]} 
                                    />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="mt-4 bg-amber-50 p-4 rounded-md">
                            <h4 className="font-medium text-amber-800 mb-2">Impact Analysis</h4>
                            <p className="text-sm">
                              {neighborhood.name} will experience a {neighborhood.impactLevel >= 7 ? 'significant' : 'moderate'} impact 
                              from this legislation. The {Object.entries(neighborhood.demographics)
                                .sort((a, b) => b[1] - a[1])[0][0]} demographic 
                              (making up {Object.entries(neighborhood.demographics).sort((a, b) => b[1] - a[1])[0][1]}% of the population) 
                              will be most affected.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImpactVisualization;
