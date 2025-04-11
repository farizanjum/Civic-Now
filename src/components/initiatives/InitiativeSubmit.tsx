
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Upload, MapPin, FileSpreadsheet } from "lucide-react";

// Form schema for initiative submission
const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters.").max(100, "Title must be less than 100 characters."),
  category: z.string().min(1, "Please select a category."),
  location: z.string().min(1, "Location is required."),
  description: z.string().min(50, "Description must be at least 50 characters.").max(2000, "Description must be less than 2000 characters."),
  impactStatement: z.string().min(20, "Impact statement is required.").max(500, "Impact statement must be less than 500 characters."),
  timelineEstimate: z.string().min(1, "Timeline estimate is required."),
});

const InitiativeSubmit = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      location: "",
      description: "",
      impactStatement: "",
      timelineEstimate: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Initiative submitted:", values);
      toast({
        title: "Initiative submitted successfully!",
        description: "Your initiative has been submitted for review.",
      });
      form.reset();
      setImagePreview(null);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a New Initiative</CardTitle>
        <CardDescription>
          Share your ideas to improve the community. All initiatives will be reviewed by moderators before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initiative Title</FormLabel>
                  <FormControl>
                    <Input placeholder="A clear, descriptive title for your initiative" {...field} />
                  </FormControl>
                  <FormDescription>
                    Keep it concise and meaningful.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Environment">Environment</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Culture">Culture</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Specific area or address" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Where will this initiative take place?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a detailed description of your initiative, including goals, methods, and resources needed." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific and provide enough details for others to understand your idea.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="impactStatement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Impact</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How will this initiative benefit the community? Who will it impact?" 
                      className="min-h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timelineEstimate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline Estimate</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an estimated timeline" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Under 1 month">Under 1 month</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="Over 1 year">Over 1 year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How long do you expect this initiative to take?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Initiative Image (Optional)</FormLabel>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative mt-2 mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Initiative preview" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => setImagePreview(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted rounded-md p-6 mt-2 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">Drag and drop an image here, or click to browse</p>
                    <p className="text-xs text-muted-foreground mb-3">PNG, JPG or WEBP (max 2MB)</p>
                    <Input 
                      type="file" 
                      id="initiative-image" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("initiative-image")?.click()}>
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <FormLabel>Supporting Documents (Optional)</FormLabel>
              <div className="border-2 border-dashed border-muted rounded-md p-6 mt-2 text-center">
                <FileSpreadsheet className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Attach supporting documents</p>
                <p className="text-xs text-muted-foreground mb-3">PDF, DOCX, XLSX (max 5MB)</p>
                <Button type="button" variant="outline">Upload Documents</Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => form.reset()}>Cancel</Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isSubmitting} 
          className="bg-civic-blue hover:bg-civic-blue-dark"
        >
          {isSubmitting ? "Submitting..." : "Submit Initiative"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InitiativeSubmit;
