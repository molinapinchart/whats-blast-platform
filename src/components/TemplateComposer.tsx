
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Save, Eye, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  category: string;
  header?: {
    type: 'text' | 'media';
    content: string;
  };
  body: string;
  footer?: string;
  buttons?: Array<{
    type: 'quick_reply' | 'url' | 'phone_number';
    text: string;
    value: string;
  }>;
  variables: string[];
}

const TemplateComposer = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({
    name: '',
    category: 'marketing',
    body: '',
    variables: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{(\w+)\}\}/g);
    return matches ? matches.map(match => match.slice(2, -2)) : [];
  };

  const updateVariables = () => {
    const bodyVars = extractVariables(currentTemplate.body || '');
    const headerVars = currentTemplate.header?.type === 'text' 
      ? extractVariables(currentTemplate.header.content || '') 
      : [];
    const footerVars = extractVariables(currentTemplate.footer || '');
    
    const allVars = [...new Set([...bodyVars, ...headerVars, ...footerVars])];
    setCurrentTemplate(prev => ({ ...prev, variables: allVars }));
  };

  const saveTemplate = () => {
    if (!currentTemplate.name || !currentTemplate.body) {
      toast({
        title: "Missing required fields",
        description: "Please provide template name and body",
        variant: "destructive",
      });
      return;
    }

    const template: Template = {
      id: editingId || `template-${Date.now()}`,
      name: currentTemplate.name,
      category: currentTemplate.category || 'marketing',
      body: currentTemplate.body,
      header: currentTemplate.header,
      footer: currentTemplate.footer,
      buttons: currentTemplate.buttons,
      variables: currentTemplate.variables || []
    };

    if (editingId) {
      setTemplates(prev => prev.map(t => t.id === editingId ? template : t));
      setEditingId(null);
    } else {
      setTemplates(prev => [...prev, template]);
    }

    setCurrentTemplate({
      name: '',
      category: 'marketing',
      body: '',
      variables: []
    });

    toast({
      title: editingId ? "Template updated" : "Template saved",
      description: "Your template has been saved successfully",
    });
  };

  const editTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setEditingId(template.id);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Template deleted",
      description: "Template has been removed successfully",
    });
  };

  const renderPreview = () => {
    if (!currentTemplate.body) return null;

    const sampleVariables: Record<string, string> = {
      name: 'John Doe',
      company: 'Acme Corp',
      product: 'Premium Package',
      amount: '$99.99',
      date: '2024-01-15'
    };

    const replaceVariables = (text: string) => {
      return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
        return sampleVariables[variable] || `{{${variable}}}`;
      });
    };

    return (
      <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white max-w-sm">
        {currentTemplate.header && (
          <div className="mb-3 p-2 bg-green-400/30 rounded">
            <p className="font-medium text-sm">
              {currentTemplate.header.type === 'text' 
                ? replaceVariables(currentTemplate.header.content)
                : 'Media Header'
              }
            </p>
          </div>
        )}
        
        <div className="mb-3">
          <p className="text-sm leading-relaxed">
            {replaceVariables(currentTemplate.body)}
          </p>
        </div>

        {currentTemplate.footer && (
          <div className="mb-3 text-xs text-green-100">
            {replaceVariables(currentTemplate.footer)}
          </div>
        )}

        {currentTemplate.buttons && currentTemplate.buttons.length > 0 && (
          <div className="space-y-2">
            {currentTemplate.buttons.map((button, index) => (
              <div
                key={index}
                className="bg-white/20 text-center py-2 rounded text-sm font-medium"
              >
                {button.text}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Editor */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {editingId ? 'Edit Template' : 'Create Template'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Design your WhatsApp message template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name" className="text-slate-300">Template Name</Label>
                <Input
                  id="template-name"
                  value={currentTemplate.name || ''}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., Welcome Message"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-slate-300">Category</Label>
                <Select
                  value={currentTemplate.category}
                  onValueChange={(value) => setCurrentTemplate(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="utility">Utility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Header */}
            <div>
              <Label htmlFor="header-content" className="text-slate-300">Header (Optional)</Label>
              <Input
                id="header-content"
                value={currentTemplate.header?.content || ''}
                onChange={(e) => {
                  setCurrentTemplate(prev => ({
                    ...prev,
                    header: { type: 'text', content: e.target.value }
                  }));
                }}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Header text with {{variables}}"
              />
            </div>

            {/* Body */}
            <div>
              <Label htmlFor="body" className="text-slate-300">Message Body *</Label>
              <Textarea
                id="body"
                value={currentTemplate.body || ''}
                onChange={(e) => {
                  setCurrentTemplate(prev => ({ ...prev, body: e.target.value }));
                  setTimeout(updateVariables, 100);
                }}
                className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                placeholder="Your message content with {{variables}}"
              />
            </div>

            {/* Footer */}
            <div>
              <Label htmlFor="footer" className="text-slate-300">Footer (Optional)</Label>
              <Input
                id="footer"
                value={currentTemplate.footer || ''}
                onChange={(e) => {
                  setCurrentTemplate(prev => ({ ...prev, footer: e.target.value }));
                  setTimeout(updateVariables, 100);
                }}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Footer text"
              />
            </div>

            {/* Variables */}
            {currentTemplate.variables && currentTemplate.variables.length > 0 && (
              <div>
                <Label className="text-slate-300">Detected Variables</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentTemplate.variables.map((variable, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={saveTemplate} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                {editingId ? 'Update' : 'Save'} Template
              </Button>
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
            <CardDescription className="text-slate-400">
              How your message will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showPreview && renderPreview()}
            {!showPreview && (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Click the preview button to see your template</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Template List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Saved Templates</CardTitle>
          <CardDescription className="text-slate-400">
            Manage your message templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No templates created yet</p>
              <p className="text-slate-500 text-sm">Create your first template above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 bg-slate-750 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{template.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          {template.variables.length > 0 && (
                            <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300">
                              {template.variables.length} variables
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => editTemplate(template)}
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteTemplate(template.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateComposer;
