
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Send, Calendar, Users, MessageSquare, Play, Pause, BarChart3, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  totalContacts: number;
  sentCount: number;
  successCount: number;
  failedCount: number;
  scheduledDate?: string;
  createdAt: string;
}

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'campaign-1',
      name: 'Product Launch Announcement',
      templateId: 'template-1',
      templateName: 'Launch Template',
      status: 'completed',
      totalContacts: 1250,
      sentCount: 1250,
      successCount: 1180,
      failedCount: 70,
      createdAt: '2024-01-10'
    },
    {
      id: 'campaign-2',
      name: 'Holiday Promotion',
      templateId: 'template-2',
      templateName: 'Promo Template',
      status: 'running',
      totalContacts: 800,
      sentCount: 450,
      successCount: 420,
      failedCount: 30,
      createdAt: '2024-01-12'
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    templateId: '',
    scheduledDate: ''
  });

  const { toast } = useToast();

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500';
      case 'running':
        return 'bg-blue-500/20 text-blue-300 border-blue-500';
      case 'scheduled':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      case 'paused':
        return 'bg-orange-500/20 text-orange-300 border-orange-500';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      default:
        return <Send className="w-4 h-4" />;
    }
  };

  const createCampaign = () => {
    if (!newCampaign.name || !newCampaign.templateId) {
      toast({
        title: "Missing required fields",
        description: "Please provide campaign name and select a template",
        variant: "destructive",
      });
      return;
    }

    const campaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: newCampaign.name,
      templateId: newCampaign.templateId,
      templateName: 'Sample Template', // In real app, fetch from templates
      status: newCampaign.scheduledDate ? 'scheduled' : 'draft',
      totalContacts: 0,
      sentCount: 0,
      successCount: 0,
      failedCount: 0,
      scheduledDate: newCampaign.scheduledDate,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCampaigns(prev => [...prev, campaign]);
    setNewCampaign({ name: '', templateId: '', scheduledDate: '' });

    toast({
      title: "Campaign created",
      description: "Your campaign has been created successfully",
    });
  };

  const toggleCampaign = (id: string) => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === id) {
        const newStatus = campaign.status === 'running' ? 'paused' : 'running';
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Create Campaign */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5" />
            Create New Campaign
          </CardTitle>
          <CardDescription className="text-slate-400">
            Set up a new message campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="campaign-name" className="text-slate-300">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., Summer Sale Campaign"
              />
            </div>
            <div>
              <Label htmlFor="template-select" className="text-slate-300">Message Template</Label>
              <Select
                value={newCampaign.templateId}
                onValueChange={(value) => setNewCampaign(prev => ({ ...prev, templateId: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template-1">Welcome Message</SelectItem>
                  <SelectItem value="template-2">Promotion Template</SelectItem>
                  <SelectItem value="template-3">Order Confirmation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scheduled-date" className="text-slate-300">Schedule (Optional)</Label>
              <Input
                id="scheduled-date"
                type="datetime-local"
                value={newCampaign.scheduledDate}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <Button onClick={createCampaign} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </CardContent>
      </Card>

      {/* Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Campaigns", value: campaigns.length, icon: Send, color: "text-blue-400" },
          { title: "Active Campaigns", value: campaigns.filter(c => c.status === 'running').length, icon: Play, color: "text-green-400" },
          { title: "Total Messages", value: campaigns.reduce((sum, c) => sum + c.sentCount, 0).toLocaleString(), icon: MessageSquare, color: "text-purple-400" },
          { title: "Success Rate", value: "94.2%", icon: BarChart3, color: "text-emerald-400" },
        ].map((stat, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-700">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Campaign List</CardTitle>
          <CardDescription className="text-slate-400">
            Monitor and manage your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Send className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No campaigns created yet</p>
              <p className="text-slate-500 text-sm">Create your first campaign above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-6 bg-slate-750 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        {getStatusIcon(campaign.status)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{campaign.name}</h3>
                        <p className="text-slate-400 text-sm">Template: {campaign.templateName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                      {(campaign.status === 'running' || campaign.status === 'paused') && (
                        <Button
                          onClick={() => toggleCampaign(campaign.id)}
                          size="sm"
                          variant="outline"
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                          {campaign.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      )}
                    </div>
                  </div>

                  {campaign.status !== 'draft' && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">{campaign.sentCount}/{campaign.totalContacts}</span>
                      </div>
                      <Progress 
                        value={campaign.totalContacts > 0 ? (campaign.sentCount / campaign.totalContacts) * 100 : 0} 
                        className="h-2"
                      />
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-green-400 font-bold text-lg">{campaign.successCount}</p>
                          <p className="text-slate-400 text-xs">Delivered</p>
                        </div>
                        <div className="text-center">
                          <p className="text-red-400 font-bold text-lg">{campaign.failedCount}</p>
                          <p className="text-slate-400 text-xs">Failed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-400 font-bold text-lg">
                            {campaign.totalContacts - campaign.sentCount}
                          </p>
                          <p className="text-slate-400 text-xs">Pending</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignManager;
