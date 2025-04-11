
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Send, User } from "lucide-react";

// Sample representative data
const representativesData = [
  {
    id: "rep-001",
    name: "Jane Rodriguez",
    role: "City Council",
    district: "Downtown",
    avatar: "/placeholder.svg"
  },
  {
    id: "rep-002",
    name: "Michael Chen",
    role: "City Council",
    district: "Riverside",
    avatar: "/placeholder.svg"
  },
  {
    id: "rep-003",
    name: "Sarah Johnson",
    role: "Parks Department",
    district: "All Districts",
    avatar: "/placeholder.svg"
  },
  {
    id: "rep-004",
    name: "David Williams",
    role: "Transportation Authority",
    district: "All Districts",
    avatar: "/placeholder.svg"
  },
];

const FeedbackForm = () => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRep, setSelectedRep] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim() || !category || !selectedRep) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate submission
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been sent to the representative.",
      });
      
      // Reset form
      setSubject("");
      setCategory("");
      setMessage("");
      setSelectedRep("");
      setIsPublic(true);
      setIsSubmitting(false);
    }, 1500);
  };
  
  const selectedRepData = representativesData.find(rep => rep.id === selectedRep);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              Share your concerns, questions or suggestions with city representatives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your feedback"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="services">Public Services</SelectItem>
                    <SelectItem value="safety">Safety & Security</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="representative">Select Representative</Label>
                <Select value={selectedRep} onValueChange={setSelectedRep}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a representative" />
                  </SelectTrigger>
                  <SelectContent>
                    {representativesData.map(rep => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name} - {rep.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your feedback in detail..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="public-feedback" 
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="public-feedback">Make my feedback public</Label>
              </div>
              
              <Button 
                type="submit" 
                className="bg-civic-blue hover:bg-civic-blue-dark mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Selected Representative</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRepData ? (
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <img src={selectedRepData.avatar} alt={selectedRepData.name} />
                </Avatar>
                <h3 className="text-xl font-medium">{selectedRepData.name}</h3>
                <p className="text-civic-gray-dark">{selectedRepData.role}</p>
                <p className="text-sm text-civic-gray mt-1">District: {selectedRepData.district}</p>
                
                <div className="mt-6 w-full">
                  <p className="text-sm font-medium mb-2">Contact Information</p>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <p>Email: {selectedRepData.name.toLowerCase().split(' ').join('.')}@citycouncil.gov</p>
                    <p className="mt-1">Phone: (555) 123-4567</p>
                  </div>
                </div>
                
                <Button variant="outline" className="mt-4 w-full">
                  View Profile
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <User size={48} className="text-civic-gray mb-4" />
                <p className="text-civic-gray-dark">Select a representative to view their details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackForm;
