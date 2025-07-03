import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Copy, Trash2, Settings, Eye, EyeOff } from "lucide-react";

interface CourseCode {
  id: string;
  code: string;
  used: boolean;
  createdAt: string;
  usedAt?: string;
}

const AdminPanel = () => {
  const [codes, setCodes] = useState<CourseCode[]>([]);
  const [newCodePrefix, setNewCodePrefix] = useState("COURSE");
  const [showCodes, setShowCodes] = useState(false);

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = () => {
    const storedCodes = JSON.parse(localStorage.getItem("courseCodes") || "[]");
    setCodes(storedCodes);
  };

  const generateCode = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newCode = `${newCodePrefix}-${randomSuffix}`;
    
    const codeData: CourseCode = {
      id: Date.now().toString(),
      code: newCode,
      used: false,
      createdAt: new Date().toISOString(),
    };

    const updatedCodes = [...codes, codeData];
    setCodes(updatedCodes);
    localStorage.setItem("courseCodes", JSON.stringify(updatedCodes));
    
    toast({
      title: "Code Generated",
      description: `New access code: ${newCode}`,
    });
  };

  const deleteCode = (id: string) => {
    const updatedCodes = codes.filter(code => code.id !== id);
    setCodes(updatedCodes);
    localStorage.setItem("courseCodes", JSON.stringify(updatedCodes));
    
    toast({
      title: "Code Deleted",
      description: "Access code has been removed.",
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Access code copied to clipboard.",
    });
  };

  const resetAllCodes = () => {
    if (confirm("Are you sure you want to delete all codes? This cannot be undone.")) {
      setCodes([]);
      localStorage.setItem("courseCodes", JSON.stringify([]));
      toast({
        title: "All Codes Deleted",
        description: "All access codes have been removed.",
      });
    }
  };

  const usedCount = codes.filter(code => code.used).length;
  const activeCount = codes.filter(code => !code.used).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage access codes for your course platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-b from-card to-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{codes.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-card to-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-card to-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Used Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{usedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Code Generation */}
        <Card className="mb-8 bg-gradient-to-b from-card to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Generate New Code
            </CardTitle>
            <CardDescription>
              Create new access codes for your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Code prefix (e.g., COURSE)"
                value={newCodePrefix}
                onChange={(e) => setNewCodePrefix(e.target.value.toUpperCase())}
                className="max-w-xs"
              />
              <Button onClick={generateCode} className="bg-gradient-to-r from-primary to-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Generate Code
              </Button>
              <Button 
                variant="destructive" 
                onClick={resetAllCodes}
                className="ml-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Codes Table */}
        <Card className="bg-gradient-to-b from-card to-muted/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Access Codes Management
                </CardTitle>
                <CardDescription>
                  View and manage all generated access codes
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCodes(!showCodes)}
              >
                {showCodes ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showCodes ? "Hide" : "Show"} Codes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {codes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No access codes generated yet. Create your first code above.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono">
                        {showCodes ? code.code : "•".repeat(code.code.length)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={code.used ? "secondary" : "default"}
                          className={code.used ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}
                        >
                          {code.used ? "Used" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(code.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {code.usedAt ? new Date(code.usedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyCode(code.code)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteCode(code.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;