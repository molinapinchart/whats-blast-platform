
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Users, Search, Filter, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  phoneNumber: string;
  name: string;
  variables: Record<string, string>;
}

const ContactManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const newContacts: Contact[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const contact: Contact = {
            id: `contact-${Date.now()}-${i}`,
            phoneNumber: values[0] || '',
            name: values[1] || '',
            variables: {}
          };
          
          // Map additional columns as variables
          for (let j = 2; j < headers.length; j++) {
            if (headers[j] && values[j]) {
              contact.variables[headers[j]] = values[j];
            }
          }
          
          newContacts.push(contact);
        }
      }
      
      setContacts(prev => [...prev, ...newContacts]);
      toast({
        title: "Contacts imported",
        description: `Successfully imported ${newContacts.length} contacts`,
      });
    };
    
    reader.readAsText(file);
  };

  const exportContacts = () => {
    if (contacts.length === 0) {
      toast({
        title: "No contacts to export",
        description: "Please add some contacts first",
        variant: "destructive",
      });
      return;
    }

    const allVariableKeys = Array.from(
      new Set(contacts.flatMap(c => Object.keys(c.variables)))
    );
    
    const headers = ['Phone Number', 'Name', ...allVariableKeys];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        contact.phoneNumber,
        contact.name,
        ...allVariableKeys.map(key => contact.variables[key] || '')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Contacts
            </CardTitle>
            <CardDescription className="text-slate-400">
              Upload a CSV file with phone numbers and variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <Label htmlFor="csv-upload" className="cursor-pointer text-slate-300 hover:text-white">
                Click to upload CSV file
              </Label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-xs text-slate-500 mt-2">
                Format: phone_number, name, variable1, variable2...
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contact Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Contacts</span>
              <span className="text-white font-bold">{contacts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Valid Numbers</span>
              <span className="text-green-400 font-bold">
                {contacts.filter(c => c.phoneNumber.length > 8).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">With Names</span>
              <span className="text-blue-400 font-bold">
                {contacts.filter(c => c.name).length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={exportContacts}
              variant="outline"
              className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Contacts
            </Button>
            <Button
              onClick={() => setContacts([])}
              variant="destructive"
              className="w-full"
              disabled={contacts.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contact List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Contact List</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No contacts found</p>
              <p className="text-slate-500 text-sm">Upload a CSV file to get started</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 bg-slate-750 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {contact.name ? contact.name.charAt(0).toUpperCase() : '#'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{contact.name || 'Unknown'}</p>
                        <p className="text-slate-400 text-sm">{contact.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">
                      {Object.keys(contact.variables).length} variables
                    </p>
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

export default ContactManager;
