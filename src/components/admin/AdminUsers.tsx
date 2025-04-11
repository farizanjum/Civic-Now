
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Search, Filter, UserPlus, UserCheck, UserX, Mail, Shield, User, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const mockUsers = [
  {
    id: "U1",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    role: "Admin",
    status: "Active",
    joinedDate: "2024-12-15",
    lastActive: "2025-04-08",
    avatar: "/placeholder.svg"
  },
  {
    id: "U2",
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    role: "Moderator",
    status: "Active",
    joinedDate: "2025-01-10",
    lastActive: "2025-04-10",
    avatar: "/placeholder.svg"
  },
  {
    id: "U3",
    name: "Sophia Chen",
    email: "sophia.c@example.com",
    role: "Representative",
    status: "Active",
    joinedDate: "2025-02-05",
    lastActive: "2025-04-09",
    avatar: "/placeholder.svg"
  },
  {
    id: "U4",
    name: "Michael Brown",
    email: "m.brown@example.com",
    role: "User",
    status: "Inactive",
    joinedDate: "2025-01-20",
    lastActive: "2025-03-15",
    avatar: "/placeholder.svg"
  },
  {
    id: "U5",
    name: "Jennifer Lopez",
    email: "j.lopez@example.com",
    role: "User",
    status: "Pending",
    joinedDate: "2025-03-28",
    lastActive: "2025-03-28",
    avatar: "/placeholder.svg"
  },
  {
    id: "U6",
    name: "David Kim",
    email: "d.kim@example.com",
    role: "User",
    status: "Active",
    joinedDate: "2025-02-18",
    lastActive: "2025-04-07",
    avatar: "/placeholder.svg"
  },
  {
    id: "U7",
    name: "Sarah Williams",
    email: "s.williams@example.com",
    role: "User",
    status: "Suspended",
    joinedDate: "2025-01-05",
    lastActive: "2025-03-01",
    avatar: "/placeholder.svg"
  }
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all_roles");
  const [statusFilter, setStatusFilter] = useState("all_status");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const filteredUsers = mockUsers.filter((user) => {
    return (
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "all_roles" || user.role === roleFilter) &&
      (statusFilter === "all_status" || user.status === statusFilter)
    );
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Moderator":
        return "bg-blue-100 text-blue-800";
      case "Representative":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="h-3.5 w-3.5" />;
      case "Moderator":
        return <UserCheck className="h-3.5 w-3.5" />;
      case "Representative":
        return <User className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };
  
  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user.",
        variant: "destructive",
      });
      return;
    }
    
    let message = "";
    switch (action) {
      case "activate":
        message = `${selectedUsers.length} users have been activated.`;
        break;
      case "deactivate":
        message = `${selectedUsers.length} users have been deactivated.`;
        break;
      case "delete":
        message = `${selectedUsers.length} users have been deleted.`;
        break;
    }
    
    toast({
      title: "Action Completed",
      description: message,
    });
    
    setSelectedUsers([]);
  };
  
  const handleInviteUsers = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviteDialogOpen(false);
    
    toast({
      title: "Invitations Sent",
      description: "User invitations have been sent successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users, roles, and permissions</CardDescription>
              </div>
              
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="whitespace-nowrap">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Users
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite New Users</DialogTitle>
                    <DialogDescription>
                      Send invitations to join the platform. Add multiple email addresses separated by commas.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleInviteUsers} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="emails" className="text-sm font-medium">
                        Email Addresses
                      </label>
                      <Textarea
                        id="emails"
                        placeholder="e.g., user1@example.com, user2@example.com"
                        className="min-h-24"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="role" className="text-sm font-medium">
                        Assign Role
                      </label>
                      <Select defaultValue="user">
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="representative">Representative</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sendEmail" />
                      <label
                        htmlFor="sendEmail"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Send welcome email
                      </label>
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitations
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="w-[180px]">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_roles">All Roles</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                        <SelectItem value="Representative">Representative</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-[180px]">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_status">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2 items-center">
                  <div className="text-sm text-muted-foreground">
                    {selectedUsers.length} selected
                  </div>
                  <div className="flex-1 flex gap-2">
                    {selectedUsers.length > 0 && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBulkAction("activate")}
                        >
                          <UserCheck className="h-3.5 w-3.5 mr-1" />
                          Activate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBulkAction("deactivate")}
                        >
                          <UserX className="h-3.5 w-3.5 mr-1" />
                          Deactivate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleBulkAction("delete")}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-muted-foreground text-sm">
                    <div className="col-span-1">
                      <Checkbox 
                        checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(filteredUsers.map(user => user.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </div>
                    <div className="col-span-3">User</div>
                    <div className="col-span-2 hidden md:block">Role</div>
                    <div className="col-span-2 hidden md:block">Status</div>
                    <div className="col-span-2 hidden md:block">Joined</div>
                    <div className="col-span-2 hidden md:block">Last Active</div>
                  </div>
                  
                  {filteredUsers.length === 0 ? (
                    <div className="p-6 text-center">
                      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No users found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/50 items-center">
                        <div className="col-span-1">
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)} 
                            onCheckedChange={() => toggleSelectUser(user.id)}
                          />
                        </div>
                        <div className="col-span-3 md:col-span-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 hidden md:block">
                          <Badge className={`flex items-center gap-1 w-fit ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            {user.role}
                          </Badge>
                        </div>
                        <div className="col-span-2 hidden md:block">
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </div>
                        <div className="col-span-2 text-muted-foreground text-sm hidden md:block">
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </div>
                        <div className="col-span-2 text-muted-foreground text-sm hidden md:block">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {filteredUsers.length > 0 && (
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredUsers.length} of {mockUsers.length} users
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Manage user roles and their associated permissions</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-3 bg-muted/50 p-4 border-b">
                    <div className="font-medium">Role</div>
                    <div className="font-medium">Description</div>
                    <div className="font-medium">Users</div>
                  </div>
                  
                  <div className="grid grid-cols-3 p-4 border-b hover:bg-muted/20">
                    <div>
                      <Badge className="bg-purple-100 text-purple-800 mb-1">Admin</Badge>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Full access to all platform features and settings. Can manage users, content, and system configuration.
                    </div>
                    <div>
                      <div className="flex items-center -space-x-2">
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarFallback>EW</AvatarFallback>
                        </Avatar>
                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-xs border-2 border-background">
                          +0
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 p-4 border-b hover:bg-muted/20">
                    <div>
                      <Badge className="bg-blue-100 text-blue-800 mb-1">Moderator</Badge>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Can review and moderate user content, manage initiatives and community voting, and respond to feedback.
                    </div>
                    <div>
                      <div className="flex items-center -space-x-2">
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarFallback>MJ</AvatarFallback>
                        </Avatar>
                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-xs border-2 border-background">
                          +0
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 p-4 border-b hover:bg-muted/20">
                    <div>
                      <Badge className="bg-teal-100 text-teal-800 mb-1">Representative</Badge>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Official community representatives who can respond to feedback, create legislation, and manage specific community initiatives.
                    </div>
                    <div>
                      <div className="flex items-center -space-x-2">
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-xs border-2 border-background">
                          +0
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 p-4 hover:bg-muted/20">
                    <div>
                      <Badge className="bg-gray-100 text-gray-800 mb-1">User</Badge>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Standard user accounts that can view content, vote on proposals, submit feedback, and participate in community initiatives.
                    </div>
                    <div>
                      <div className="flex items-center -space-x-2">
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarFallback>MB</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarFallback>JL</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarFallback>DK</AvatarFallback>
                        </Avatar>
                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-xs border-2 border-background">
                          +1
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button>
                  Create New Role
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;
