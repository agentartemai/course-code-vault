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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [codes, setCodes] = useState<CourseCode[]>([]);
  const [newCodePrefix, setNewCodePrefix] = useState("COURSE");
  const [showCodes, setShowCodes] = useState(false);
  const [courseData, setCourseData] = useState({
    name: "Master Course",
    description: "Transform your knowledge with our comprehensive course",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Foundations",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        downloadLinks: [
          "https://drive.google.com/file/d/sample1/view",
          "https://drive.google.com/file/d/sample2/view"
        ]
      },
      {
        id: 2,
        title: "Chapter 2: Advanced Concepts",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        downloadLinks: [
          "https://drive.google.com/file/d/sample3/view",
          "https://drive.google.com/file/d/sample4/view"
        ]
      },
      {
        id: 3,
        title: "Chapter 3: Practical Applications",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        downloadLinks: [
          "https://drive.google.com/file/d/sample5/view",
          "https://drive.google.com/file/d/sample6/view"
        ]
      },
      {
        id: 4,
        title: "Chapter 4: Mastery",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        downloadLinks: [
          "https://drive.google.com/file/d/sample7/view",
          "https://drive.google.com/file/d/sample8/view"
        ]
      }
    ]
  });
  const [editingChapter, setEditingChapter] = useState<number | null>(null);

  useEffect(() => {
    loadCodes();
    loadCourseData();
  }, []);

  const loadCourseData = () => {
    const storedData = localStorage.getItem("courseData");
    if (storedData) {
      setCourseData(JSON.parse(storedData));
    }
  };

  const saveCourseData = (data: typeof courseData) => {
    setCourseData(data);
    localStorage.setItem("courseData", JSON.stringify(data));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "AgAi2443245") {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Invalid Password",
        description: "Please check your password and try again.",
        variant: "destructive",
      });
    }
  };

  const updateChapter = (chapterId: number, field: string, value: string, index?: number) => {
    const updatedData = { ...courseData };
    const chapter = updatedData.chapters.find(c => c.id === chapterId);
    if (chapter) {
      if (field === "downloadLinks" && index !== undefined) {
        chapter.downloadLinks[index] = value;
      } else {
        (chapter as any)[field] = value;
      }
      saveCourseData(updatedData);
    }
  };

  const updateCourseInfo = (field: string, value: string) => {
    const updatedData = { ...courseData, [field]: value };
    saveCourseData(updatedData);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card">
        <Card className="w-full max-w-md bg-gradient-to-b from-card to-muted/50">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter admin password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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

        {/* Course Content Management */}
        <Card className="mb-8 bg-gradient-to-b from-card to-muted/50">
          <CardHeader>
            <CardTitle>Course Content Management</CardTitle>
            <CardDescription>Update course information and chapter content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Course Name</label>
                <Input
                  value={courseData.name}
                  onChange={(e) => updateCourseInfo("name", e.target.value)}
                  placeholder="Course name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Course Description</label>
                <Input
                  value={courseData.description}
                  onChange={(e) => updateCourseInfo("description", e.target.value)}
                  placeholder="Course description"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Chapters</h3>
              {courseData.chapters.map((chapter) => (
                <Card key={chapter.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{chapter.title}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingChapter(editingChapter === chapter.id ? null : chapter.id)}
                      >
                        {editingChapter === chapter.id ? "Save" : "Edit"}
                      </Button>
                    </div>
                    
                    {editingChapter === chapter.id && (
                      <div className="space-y-3 pt-3 border-t">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Chapter Title</label>
                          <Input
                            value={chapter.title}
                            onChange={(e) => updateChapter(chapter.id, "title", e.target.value)}
                            placeholder="Chapter title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">YouTube Video URL</label>
                          <Input
                            value={chapter.videoUrl}
                            onChange={(e) => updateChapter(chapter.id, "videoUrl", e.target.value)}
                            placeholder="https://www.youtube.com/embed/..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Download Link 1</label>
                          <Input
                            value={chapter.downloadLinks[0]}
                            onChange={(e) => updateChapter(chapter.id, "downloadLinks", e.target.value, 0)}
                            placeholder="Google Drive link 1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Download Link 2</label>
                          <Input
                            value={chapter.downloadLinks[1]}
                            onChange={(e) => updateChapter(chapter.id, "downloadLinks", e.target.value, 1)}
                            placeholder="Google Drive link 2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
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