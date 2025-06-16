
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, MessageSquare, Send, CheckCircle, AlertCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Contacts",
      value: "2,847",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Templates Created",
      value: "24",
      icon: MessageSquare,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Messages Sent",
      value: "15,432",
      icon: Send,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ];

  const recentCampaigns = [
    { name: "Product Launch Announcement", status: "completed", sent: 1250, success: 1180 },
    { name: "Holiday Promotion", status: "in-progress", sent: 800, success: 750 },
    { name: "Customer Survey", status: "scheduled", sent: 0, success: 0 },
    { name: "Order Confirmation", status: "completed", sent: 3200, success: 3150 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "scheduled":
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Campaigns</CardTitle>
            <CardDescription className="text-slate-400">
              Overview of your latest message campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-750 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(campaign.status)}
                    <div>
                      <p className="text-white font-medium">{campaign.name}</p>
                      <p className="text-slate-400 text-sm capitalize">{campaign.status.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{campaign.sent}</p>
                    <p className="text-slate-400 text-sm">sent</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Overview</CardTitle>
            <CardDescription className="text-slate-400">
              Campaign success metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Delivery Rate</span>
                <span className="text-white">94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Read Rate</span>
                <span className="text-white">87.8%</span>
              </div>
              <Progress value={87.8} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Response Rate</span>
                <span className="text-white">12.4%</span>
              </div>
              <Progress value={12.4} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Click-through Rate</span>
                <span className="text-white">8.9%</span>
              </div>
              <Progress value={8.9} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
