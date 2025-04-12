
import React, { useState, useEffect } from 'react';
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
import { ChartPie, Users, MapPin, Filter, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

// Create demographic color map for consistency
const demographicColors = {
  age: {
    "18-24": "#3498db",
    "25-34": "#2ecc71",
    "35-44": "#f1c40f",
    "45-60": "#e67e22",
    "60+": "#e74c3c"
  },
  income: {
    "Low Income": "#9b59b6",
    "Middle Income": "#1abc9c",
    "High Income": "#34495e"
  },
  occupation: {
    "Students": "#d35400",
    "Service Sector": "#27ae60",
    "IT/Tech": "#3498db",
    "Business": "#f39c12",
    "Retired": "#7f8c8d",
    "Agriculture": "#16a085",
    "Healthcare": "#8e44ad",
    "Government": "#2c3e50"
  },
  neighborhoods: {
    "Urban": "#2980b9",
    "Suburban": "#27ae60", 
    "Rural": "#f39c12"
  }
};

// Sample data
const sampleImpactData: ImpactData = {
  id: "impact-001",
  title: "Green Space Development Plan",
  category: "Environment",
  demographics: {
    age: [
      { name: "18-24", value: 15, color: demographicColors.age["18-24"] },
      { name: "25-34", value: 30, color: demographicColors.age["25-34"] },
      { name: "35-44", value: 25, color: demographicColors.age["35-44"] },
      { name: "45-60", value: 20, color: demographicColors.age["45-60"] },
      { name: "60+", value: 10, color: demographicColors.age["60+"] }
    ],
    income: [
      { name: "Low Income", value: 25, color: demographicColors.income["Low Income"] },
      { name: "Middle Income", value: 45, color: demographicColors.income["Middle Income"] },
      { name: "High Income", value: 30, color: demographicColors.income["High Income"] }
    ],
    occupation: [
      { name: "Students", value: 15, color: demographicColors.occupation["Students"] },
      { name: "Service Sector", value: 30, color: demographicColors.occupation["Service Sector"] },
      { name: "IT/Tech", value: 25, color: demographicColors.occupation["IT/Tech"] },
      { name: "Business", value: 20, color: demographicColors.occupation["Business"] },
      { name: "Retired", value: 10, color: demographicColors.occupation["Retired"] }
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

// Define neighborhoods by type for the impact generator
const neighborhoodsByType = {
  urban: ["Indiranagar", "Koramangala", "Jayanagar", "Malleshwaram", "Basavanagudi", "MG Road"],
  suburban: ["Whitefield", "Electronic City", "Marathahalli", "HSR Layout", "Hebbal", "JP Nagar"],
  rural: ["Doddaballapur", "Hoskote", "Yelahanka", "Attibele", "Sarjapur", "Devanahalli"]
};

interface ImpactVisualizationProps {
  legislationTitle?: string;
}

const ImpactVisualization: React.FC<ImpactVisualizationProps> = ({ legislationTitle = "Green Space Development Plan" }) => {
  const [demographicFilter, setDemographicFilter] = useState<'age' | 'income' | 'occupation'>('age');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("all");
  const [impactData, setImpactData] = useState<ImpactData>(sampleImpactData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [category, setCategory] = useState("Environment");
  
  // Mistral API Key
  const MISTRAL_API_KEY = "eqYmr8jPuzR9S2Pjq3frG1u0wyVmxXoY";
  
  // Generate new impact data based on legislation title
  const generateImpactData = async () => {
    if (!legislationTitle) return;
    
    setIsGenerating(true);
    toast.info(`Analyzing impact for: ${legislationTitle}`);
    
    try {
      // Get the category from the title
      const categoryResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            {
              role: "system",
              content: "You are an expert in categorizing legislation. Given a legislation title, categorize it into one of the following categories: Environment, Healthcare, Education, Infrastructure, Transportation, Safety, Economy, Housing, Technology. Return ONLY the category name, nothing else."
            },
            {
              role: "user",
              content: `Categorize this legislation: "${legislationTitle}"`
            }
          ],
          temperature: 0.1,
          max_tokens: 20
        })
      });
      
      let newCategory = "Technology"; // Default
      
      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        const categoryText = categoryData.choices[0].message.content.trim();
        if (categoryText) {
          // Extract just the category name if there's additional text
          const categoryMatch = categoryText.match(/\b(Environment|Healthcare|Education|Infrastructure|Transportation|Safety|Economy|Housing|Technology)\b/i);
          if (categoryMatch) {
            newCategory = categoryMatch[0];
          }
        }
      }
      
      setCategory(newCategory);
      
      // Generate demographic impact distributions
      const demographicsResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            {
              role: "system",
              content: "You are an expert data analyst. Generate realistic demographic impact percentages for a piece of legislation. Output should be in valid JSON format with three sets: age groups, income levels, and occupations, each with percentage values. The sum of percentages in each set should equal 100. Do not include ANY explanation or text outside of the JSON."
            },
            {
              role: "user",
              content: `Generate demographic impact data for legislation titled "${legislationTitle}" in the category of "${newCategory}". Return ONLY a JSON object with three properties: "age" (with keys "18-24", "25-34", "35-44", "45-60", "60+"), "income" (with keys "Low Income", "Middle Income", "High Income"), and "occupation" (with keys "Students", "Service Sector", "IT/Tech", "Business", "Retired"). Each key should have a numeric value that represents a percentage impact, and these percentages should sum to 100 within each category.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (demographicsResponse.ok) {
        const demographicsData = await demographicsResponse.json();
        const demographicsText = demographicsData.choices[0].message.content;
        
        try {
          // Try to parse the JSON from the response
          let demographicsJson;
          
          try {
            // First try direct parsing
            demographicsJson = JSON.parse(demographicsText.replace(/```json|```/g, '').trim());
          } catch (e) {
            // If that fails, try to extract JSON from text
            const jsonMatch = demographicsText.match(/(\{[\s\S]*\})/);
            if (jsonMatch) {
              demographicsJson = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("Could not parse JSON");
            }
          }
          
          if (demographicsJson) {
            // Create new demographic data with the parsed values
            const newDemographics = {
              age: Object.entries(demographicsJson.age || {}).map(([name, value]) => ({
                name,
                value: Number(value),
                color: demographicColors.age[name] || `#${Math.floor(Math.random()*16777215).toString(16)}`
              })),
              income: Object.entries(demographicsJson.income || {}).map(([name, value]) => ({
                name,
                value: Number(value),
                color: demographicColors.income[name] || `#${Math.floor(Math.random()*16777215).toString(16)}`
              })),
              occupation: Object.entries(demographicsJson.occupation || {}).map(([name, value]) => ({
                name,
                value: Number(value),
                color: demographicColors.occupation[name] || `#${Math.floor(Math.random()*16777215).toString(16)}`
              }))
            };
            
            // Generate neighborhood impact data
            const neighborhoodsResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${MISTRAL_API_KEY}`
              },
              body: JSON.stringify({
                model: "mistral-large-latest",
                messages: [
                  {
                    role: "system",
                    content: "You are an expert in urban planning and demographic analysis. For the given legislation, generate impact scores for different neighborhoods in Bengaluru, India. Output ONLY clean, valid JSON with no additional text or explanation."
                  },
                  {
                    role: "user",
                    content: `Generate impact data for legislation titled "${legislationTitle}" in the category "${newCategory}" for these Bengaluru neighborhoods: Indiranagar, Koramangala, HSR Layout, Whitefield. Return ONLY a JSON object where each key is a neighborhood name, and each value is an object containing: "impactLevel" (integer from 1-10), "population" (integer between 80000-200000), and "demographics" object with keys "Young Adults", "Families", and "Seniors" (percentage values that sum to 100).`
                  }
                ],
                temperature: 0.7,
                max_tokens: 600
              })
            });
            
            if (neighborhoodsResponse.ok) {
              const neighborhoodsData = await neighborhoodsResponse.json();
              const neighborhoodsText = neighborhoodsData.choices[0].message.content;
              
              try {
                let neighborhoodsJson;
                
                try {
                  // First try direct parsing
                  neighborhoodsJson = JSON.parse(neighborhoodsText.replace(/```json|```/g, '').trim());
                } catch (e) {
                  // If that fails, try to extract JSON from text
                  const jsonMatch = neighborhoodsText.match(/(\{[\s\S]*\})/);
                  if (jsonMatch) {
                    neighborhoodsJson = JSON.parse(jsonMatch[0]);
                  } else {
                    throw new Error("Could not parse JSON");
                  }
                }
                
                if (neighborhoodsJson) {
                  // Create new neighborhoods array
                  const newNeighborhoods = Object.entries(neighborhoodsJson).map(([name, data]: [string, any]) => ({
                    name,
                    impactLevel: Number(data.impactLevel) || Math.floor(Math.random() * 10) + 1,
                    population: Number(data.population) || Math.floor(Math.random() * 100000) + 80000,
                    demographics: data.demographics || {
                      "Young Adults": Math.floor(Math.random() * 40) + 20,
                      "Families": Math.floor(Math.random() * 40) + 30,
                      "Seniors": Math.floor(Math.random() * 30) + 10
                    }
                  }));
                  
                  // Normalize demographic percentages to ensure they sum to 100%
                  newNeighborhoods.forEach(n => {
                    let sum = 0;
                    for (const key in n.demographics) {
                      sum += Number(n.demographics[key]);
                    }
                    
                    for (const key in n.demographics) {
                      n.demographics[key] = Math.round((Number(n.demographics[key]) / sum) * 100);
                    }
                  });
                  
                  // Update the impact data
                  setImpactData({
                    id: `impact-${Date.now()}`,
                    title: legislationTitle,
                    category: newCategory,
                    demographics: newDemographics,
                    neighborhoods: newNeighborhoods
                  });
                  
                  toast.success("Impact data generated successfully!");
                } else {
                  throw new Error("Invalid neighborhoods JSON structure");
                }
              } catch (error) {
                console.error("Error parsing neighborhoods data:", error);
                // Use fallback neighborhood data
                generateFallbackNeighborhoods(legislationTitle, newCategory, newDemographics);
              }
            } else {
              // Use fallback neighborhood data
              generateFallbackNeighborhoods(legislationTitle, newCategory, newDemographics);
            }
          } else {
            throw new Error("Invalid demographics JSON structure");
          }
        } catch (error) {
          console.error("Error parsing demographics data:", error);
          // Use fallback data
          generateFallbackData(legislationTitle, newCategory);
        }
      } else {
        // Use fallback data
        generateFallbackData(legislationTitle, newCategory);
      }
    } catch (error) {
      console.error("Error generating impact data:", error);
      toast.error("Failed to generate impact data. Using estimated data instead.");
      // Use sample data with the new title
      setImpactData({
        ...sampleImpactData,
        title: legislationTitle,
        category: category
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate fallback demographic data
  const generateFallbackData = (title: string, category: string) => {
    // Create random distributions that sum to 100
    const generateDistribution = (count: number) => {
      const values = Array(count).fill(0).map(() => Math.random());
      const sum = values.reduce((a, b) => a + b, 0);
      return values.map(v => Math.round((v / sum) * 100));
    };
    
    const ageValues = generateDistribution(5);
    const incomeValues = generateDistribution(3);
    const occupationValues = generateDistribution(5);
    
    const newDemographics = {
      age: [
        { name: "18-24", value: ageValues[0], color: demographicColors.age["18-24"] },
        { name: "25-34", value: ageValues[1], color: demographicColors.age["25-34"] },
        { name: "35-44", value: ageValues[2], color: demographicColors.age["35-44"] },
        { name: "45-60", value: ageValues[3], color: demographicColors.age["45-60"] },
        { name: "60+", value: ageValues[4], color: demographicColors.age["60+"] }
      ],
      income: [
        { name: "Low Income", value: incomeValues[0], color: demographicColors.income["Low Income"] },
        { name: "Middle Income", value: incomeValues[1], color: demographicColors.income["Middle Income"] },
        { name: "High Income", value: incomeValues[2], color: demographicColors.income["High Income"] }
      ],
      occupation: [
        { name: "Students", value: occupationValues[0], color: demographicColors.occupation["Students"] },
        { name: "Service Sector", value: occupationValues[1], color: demographicColors.occupation["Service Sector"] },
        { name: "IT/Tech", value: occupationValues[2], color: demographicColors.occupation["IT/Tech"] },
        { name: "Business", value: occupationValues[3], color: demographicColors.occupation["Business"] },
        { name: "Retired", value: occupationValues[4], color: demographicColors.occupation["Retired"] }
      ]
    };
    
    // Generate fallback neighborhoods
    generateFallbackNeighborhoods(title, category, newDemographics);
  };
  
  // Generate fallback neighborhood data
  const generateFallbackNeighborhoods = (title: string, category: string, demographics: any) => {
    const neighborhoods = [
      {
        name: "Indiranagar",
        impactLevel: Math.floor(Math.random() * 5) + 5, // 5-10
        population: Math.floor(Math.random() * 50000) + 100000, // 100k-150k
        demographics: {
          "Young Adults": Math.floor(Math.random() * 20) + 30, // 30-50%
          "Families": Math.floor(Math.random() * 20) + 30, // 30-50%
          "Seniors": Math.floor(Math.random() * 20) + 10 // 10-30%
        }
      },
      {
        name: "Koramangala",
        impactLevel: Math.floor(Math.random() * 5) + 5,
        population: Math.floor(Math.random() * 50000) + 120000,
        demographics: {
          "Young Adults": Math.floor(Math.random() * 25) + 40, // 40-65%
          "Families": Math.floor(Math.random() * 20) + 25, // 25-45%
          "Seniors": Math.floor(Math.random() * 15) + 5 // 5-20%
        }
      },
      {
        name: "HSR Layout",
        impactLevel: Math.floor(Math.random() * 4) + 4, // 4-8
        population: Math.floor(Math.random() * 40000) + 90000,
        demographics: {
          "Young Adults": Math.floor(Math.random() * 20) + 35, // 35-55%
          "Families": Math.floor(Math.random() * 25) + 35, // 35-60%
          "Seniors": Math.floor(Math.random() * 15) + 5 // 5-20%
        }
      },
      {
        name: "Whitefield",
        impactLevel: Math.floor(Math.random() * 5) + 5, // 5-10
        population: Math.floor(Math.random() * 70000) + 150000,
        demographics: {
          "Young Adults": Math.floor(Math.random() * 15) + 25, // 25-40%
          "Families": Math.floor(Math.random() * 15) + 45, // 45-60%
          "Seniors": Math.floor(Math.random() * 15) + 10 // 10-25%
        }
      }
    ];
    
    // Fix: Explicitly convert to numbers before arithmetic operations
    neighborhoods.forEach(n => {
      // Ensure all values are treated as numbers
      let sum = 0;
      for (const key in n.demographics) {
        sum += Number(n.demographics[key]);
      }
      
      for (const key in n.demographics) {
        n.demographics[key] = Math.round((Number(n.demographics[key]) / sum) * 100);
      }
    });
    
    setImpactData({
      id: `impact-${Date.now()}`,
      title: title,
      category: category,
      demographics: demographics,
      neighborhoods: neighborhoods
    });
    
    toast.success("Impact data generated using estimates");
  };
  
  // Effect to update impact data when legislation title changes
  useEffect(() => {
    if (legislationTitle && legislationTitle !== impactData.title) {
      generateImpactData();
    }
  }, [legislationTitle]);
  
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
          <div className="flex items-center gap-2">
            <Badge variant="outline">{impactData.category}</Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateImpactData}
              disabled={isGenerating}
              className="flex items-center text-xs"
            >
              {isGenerating ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              {isGenerating ? "Analyzing..." : "Analyze Impact"}
            </Button>
          </div>
        </div>
        <CardDescription>
          {impactData.title}
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
                    data={impactData.demographics[demographicFilter]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {impactData.demographics[demographicFilter].map((entry, index) => (
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
                This visualization shows how different demographic groups may be affected by {impactData.title}. 
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
                    {impactData.neighborhoods.map((neighborhood) => (
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
                {impactData.neighborhoods.map((neighborhood) => (
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
                {impactData.neighborhoods
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
                              from {impactData.title}. The {Object.entries(neighborhood.demographics)
                                .sort((a, b) => Number(b[1]) - Number(a[1]))[0][0]} demographic 
                              (making up {Object.entries(neighborhood.demographics).sort((a, b) => Number(b[1]) - Number(a[1]))[0][1]}% of the population) 
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
