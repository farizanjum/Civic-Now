
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, ArrowDownRight, Users, FileText, MessageSquare, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  // Mock data for charts and stats
  const activityData = [
    { name: "Mon", users: 42, actions: 78 },
    { name: "Tue", users: 55, actions: 94 },
    { name: "Wed", users: 58, actions: 102 },
    { name: "Thu", users: 47, actions: 84 },
    { name: "Fri", users: 65, actions: 115 },
    { name: "Sat", users: 38, actions: 67 },
    { name: "Sun", users: 33, actions: 52 },
  ];

  const engagementData = [
    { name: "Legislation", value: 35 },
    { name: "Voting", value: 25 },
    { name: "Initiatives", value: 20 },
    { name: "Feedback", value: 15 },
    { name: "Budget", value: 5 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const stats = [
    {
      title: "Total Users",
      value: "3,568",
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Legislation",
      value: "24",
      change: "+3",
      trend: "up",
      icon: FileText,
    },
    {
      title: "Feedback Responses",
      value: "89%",
      change: "+5%",
      trend: "up",
      icon: MessageSquare,
    },
    {
      title: "Completed Initiatives",
      value: "17",
      change: "+2",
      trend: "up",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <div className={`flex items-center text-xs font-medium ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}>
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className="bg-primary/10 p-2.5 rounded-full">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>
              User activity and actions over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="actions" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
            <CardDescription>
              User engagement across platform features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {engagementData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest user interactions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: "Emily Johnson", action: "submitted new initiative", time: "10 minutes ago", type: "initiative" },
              { user: "Marcus Lee", action: "voted on legislation proposal #127", time: "25 minutes ago", type: "vote" },
              { user: "Sofia Rodriguez", action: "commented on budget tracking", time: "1 hour ago", type: "comment" },
              { user: "Jacob Williams", action: "provided feedback to representative", time: "2 hours ago", type: "feedback" },
              { user: "Olivia Chen", action: "created new community vote", time: "3 hours ago", type: "admin" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                  activity.type === "initiative" ? "bg-green-100 text-green-600" :
                  activity.type === "vote" ? "bg-blue-100 text-blue-600" :
                  activity.type === "comment" ? "bg-yellow-100 text-yellow-600" :
                  activity.type === "feedback" ? "bg-purple-100 text-purple-600" :
                  "bg-red-100 text-red-600"
                }`}>
                  {activity.type === "initiative" && <Lightbulb className="h-5 w-5" />}
                  {activity.type === "vote" && <Vote className="h-5 w-5" />}
                  {activity.type === "comment" && <MessageSquare className="h-5 w-5" />}
                  {activity.type === "feedback" && <MessageCircle className="h-5 w-5" />}
                  {activity.type === "admin" && <Settings className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
