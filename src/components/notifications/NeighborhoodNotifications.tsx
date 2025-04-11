
import React, { useState, useEffect } from 'react';
import { Bell, Info, MapPin, AlertTriangle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Types for notifications
type NotificationType = "alert" | "legislation" | "event" | "info";

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  type: NotificationType;
  neighborhood: string;
  read: boolean;
}

// Sample notification data with Indian context
const sampleNotifications: Notification[] = [
  {
    id: "n1",
    title: "Road Closure Alert",
    description: "Temporary road closure on MG Road due to metro construction from April 15-20.",
    date: "April 12, 2023",
    type: "alert",
    neighborhood: "Indiranagar",
    read: false
  },
  {
    id: "n2",
    title: "New Legislation Proposed",
    description: "Proposal for increasing green spaces in residential areas submitted to committee.",
    date: "April 10, 2023",
    type: "legislation",
    neighborhood: "Koramangala",
    read: true
  },
  {
    id: "n3",
    title: "Community Meeting",
    description: "Discussion on local water conservation initiatives at Community Hall.",
    date: "April 8, 2023",
    type: "event",
    neighborhood: "HSR Layout",
    read: false
  },
  {
    id: "n4",
    title: "Budget Allocation Update",
    description: "₹2.5 crore allocated for local infrastructure improvements.",
    date: "April 5, 2023",
    type: "info",
    neighborhood: "Whitefield",
    read: true
  }
];

// New notifications that will appear during the session
const newNotifications: Notification[] = [
  {
    id: "n5",
    title: "New Poll Available",
    description: "Vote on the proposal for new community garden in Jayanagar Park.",
    date: "April 11, 2023",
    type: "event",
    neighborhood: "Jayanagar",
    read: false
  },
  {
    id: "n6",
    title: "Emergency Water Advisory",
    description: "Water supply interruption in Richmond Town from 10 AM to 2 PM tomorrow.",
    date: "April 11, 2023",
    type: "alert",
    neighborhood: "Richmond Town",
    read: false
  }
];

const NeighborhoodNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [filter, setFilter] = useState<string>("all");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>("all");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Simulate receiving real-time notifications
    if (notificationsEnabled) {
      const notificationInterval = setInterval(() => {
        // Get a random new notification that hasn't been added yet
        const availableNewNotifications = newNotifications.filter(
          newNotif => !notifications.some(n => n.id === newNotif.id)
        );
        
        if (availableNewNotifications.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableNewNotifications.length);
          const newNotification = availableNewNotifications[randomIndex];
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast notification
          toast(
            <div>
              <p className="font-semibold">{newNotification.title}</p>
              <p className="text-sm">{newNotification.description}</p>
            </div>,
            {
              icon: newNotification.type === 'alert' ? '🚨' : 
                    newNotification.type === 'legislation' ? '📜' :
                    newNotification.type === 'event' ? '📅' : 'ℹ️'
            }
          );
        }
      }, 30000); // Add a new notification every 30 seconds
      
      return () => clearInterval(notificationInterval);
    }
  }, [notificationsEnabled, notifications]);

  // Filter notifications based on type and neighborhood
  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filter === "all" || notification.type === filter;
    const neighborhoodMatch = neighborhoodFilter === "all" || notification.neighborhood === neighborhoodFilter;
    return typeMatch && neighborhoodMatch;
  });

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    toast.success("Notification marked as read");
  };

  // Get icon based on notification type
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "alert": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "legislation": return <Info className="h-5 w-5 text-blue-500" />;
      case "event": return <Bell className="h-5 w-5 text-amber-500" />;
      case "info": return <Info className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.info(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-civic-blue flex items-center">
          <Bell className="mr-2 h-6 w-6" /> Neighborhood Notifications
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Enable notifications</span>
          <Switch checked={notificationsEnabled} onCheckedChange={toggleNotifications} />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge 
          variant={filter === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilter("all")}
        >
          All
        </Badge>
        <Badge 
          variant={filter === "alert" ? "default" : "outline"}
          className="cursor-pointer bg-red-100 text-red-800 hover:bg-red-200"
          onClick={() => setFilter("alert")}
        >
          Alerts
        </Badge>
        <Badge 
          variant={filter === "legislation" ? "default" : "outline"}
          className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
          onClick={() => setFilter("legislation")}
        >
          Legislation
        </Badge>
        <Badge 
          variant={filter === "event" ? "default" : "outline"}
          className="cursor-pointer bg-amber-100 text-amber-800 hover:bg-amber-200"
          onClick={() => setFilter("event")}
        >
          Events
        </Badge>
        <Badge 
          variant={filter === "info" ? "default" : "outline"}
          className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200"
          onClick={() => setFilter("info")}
        >
          Updates
        </Badge>
      </div>

      {/* Neighborhood filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-1" /> Filter by Neighborhood
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={neighborhoodFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setNeighborhoodFilter("all")}
          >
            All Areas
          </Badge>
          <Badge 
            variant={neighborhoodFilter === "Indiranagar" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setNeighborhoodFilter("Indiranagar")}
          >
            Indiranagar
          </Badge>
          <Badge 
            variant={neighborhoodFilter === "Koramangala" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setNeighborhoodFilter("Koramangala")}
          >
            Koramangala
          </Badge>
          <Badge 
            variant={neighborhoodFilter === "HSR Layout" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setNeighborhoodFilter("HSR Layout")}
          >
            HSR Layout
          </Badge>
          <Badge 
            variant={neighborhoodFilter === "Whitefield" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setNeighborhoodFilter("Whitefield")}
          >
            Whitefield
          </Badge>
          <Badge 
            variant={neighborhoodFilter === "Jayanagar" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setNeighborhoodFilter("Jayanagar")}
          >
            Jayanagar
          </Badge>
          <Badge 
            variant={neighborhoodFilter === "Richmond Town" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setNeighborhoodFilter("Richmond Town")}
          >
            Richmond Town
          </Badge>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Notifications list */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`transition-all ${notification.read ? 'opacity-80' : 'border-l-4 border-l-civic-blue'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {getIcon(notification.type)}
                    <CardTitle className="ml-2 text-lg">{notification.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {notification.neighborhood}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{notification.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{notification.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="link" size="sm" className="text-civic-blue p-0">
                  View Details
                </Button>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No notifications match your filters</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => {
              setFilter("all");
              setNeighborhoodFilter("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default NeighborhoodNotifications;
