import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Download, CheckCircle, FileText, Archive, Play } from "lucide-react";

const chapters = [
  {
    id: 1,
    title: "Foundation Principles",
    description: "Master the core concepts that will transform your understanding",
    duration: "45 min",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    files: [
      { name: "Chapter 1 - Workbook.pdf", size: "2.4 MB", type: "pdf" },
      { name: "Chapter 1 - Templates.zip", size: "1.2 MB", type: "zip" }
    ]
  },
  {
    id: 2,
    title: "Advanced Techniques",
    description: "Deep dive into professional strategies and methodologies",
    duration: "60 min",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    files: [
      { name: "Chapter 2 - Advanced Guide.pdf", size: "3.1 MB", type: "pdf" },
      { name: "Chapter 2 - Case Studies.pdf", size: "4.2 MB", type: "pdf" }
    ]
  },
  {
    id: 3,
    title: "Implementation Mastery",
    description: "Put your knowledge into practice with real-world applications",
    duration: "75 min",
    difficulty: "Advanced",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    files: [
      { name: "Chapter 3 - Implementation Kit.zip", size: "5.8 MB", type: "zip" },
      { name: "Chapter 3 - Checklist.pdf", size: "0.8 MB", type: "pdf" }
    ]
  },
  {
    id: 4,
    title: "Expert Optimization",
    description: "Reach peak performance with expert-level optimization techniques",
    duration: "90 min",
    difficulty: "Expert",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    files: [
      { name: "Chapter 4 - Expert Strategies.pdf", size: "6.2 MB", type: "pdf" },
      { name: "Chapter 4 - Bonus Resources.zip", size: "8.4 MB", type: "zip" }
    ]
  }
];

const ChapterPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [videoWatched, setVideoWatched] = useState(false);

  const chapterIdNum = parseInt(chapterId || "1");
  const chapter = chapters.find(c => c.id === chapterIdNum);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    // Load completed chapters
    const completed = JSON.parse(localStorage.getItem("completedChapters") || "[]");
    setCompletedChapters(completed);

    // Check if chapter is unlocked
    const isUnlocked = chapterIdNum === 1 || completed.includes(chapterIdNum - 1);
    if (!isUnlocked) {
      navigate("/course");
      return;
    }
  }, [navigate, chapterIdNum]);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Chapter not found</h1>
          <Button onClick={() => navigate("/course")} className="mt-4">
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (!completedChapters.includes(chapterIdNum)) {
      const updated = [...completedChapters, chapterIdNum];
      setCompletedChapters(updated);
      localStorage.setItem("completedChapters", JSON.stringify(updated));
      
      toast({
        title: "Chapter Completed!",
        description: "Great job! You've completed this chapter.",
      });
    }
  };

  const handleDownload = (fileName: string) => {
    // Simulate file download
    toast({
      title: "Download Started",
      description: `Downloading ${fileName}...`,
    });
    
    // In a real app, you would trigger an actual download here
    // For demo purposes, we'll just show a toast
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${fileName} has been downloaded.`,
      });
    }, 2000);
  };

  const isCompleted = completedChapters.includes(chapterIdNum);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-orange-500";
      case "Expert": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getFileIcon = (type: string) => {
    return type === "pdf" ? FileText : Archive;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-secondary p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-white">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/course")}
              className="text-white border-white/30 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Chapter {chapter.id}</h1>
                <Badge className={`${getDifficultyColor(chapter.difficulty)} text-white`}>
                  {chapter.difficulty}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-success text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <h2 className="text-xl text-white/90">{chapter.title}</h2>
              <p className="text-white/70">{chapter.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Video Section */}
        <Card className="mb-8 bg-gradient-to-b from-card to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Chapter Video ({chapter.duration})
            </CardTitle>
            <CardDescription>
              Watch the complete lesson to unlock downloads and mark as complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={chapter.videoUrl}
                title={`Chapter ${chapter.id} Video`}
                className="w-full h-full"
                allowFullScreen
                onLoad={() => setVideoWatched(true)}
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={handleMarkComplete}
                disabled={isCompleted}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Chapter Completed
                  </>
                ) : (
                  "Mark as Complete"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Downloads Section */}
        <Card className="bg-gradient-to-b from-card to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Chapter Downloads
            </CardTitle>
            <CardDescription>
              Download supplementary materials and resources for this chapter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.files.map((file, index) => {
                const IconComponent = getFileIcon(file.type);
                return (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg bg-background/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleDownload(file.name)}
                      className="bg-gradient-to-r from-primary to-secondary"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline"
            onClick={() => chapterIdNum > 1 && navigate(`/course/chapter/${chapterIdNum - 1}`)}
            disabled={chapterIdNum === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Chapter
          </Button>
          
          <Button 
            onClick={() => {
              if (chapterIdNum < chapters.length) {
                const nextChapterUnlocked = completedChapters.includes(chapterIdNum);
                if (nextChapterUnlocked) {
                  navigate(`/course/chapter/${chapterIdNum + 1}`);
                } else {
                  toast({
                    title: "Complete Current Chapter",
                    description: "Please complete this chapter to unlock the next one.",
                    variant: "destructive",
                  });
                }
              }
            }}
            disabled={chapterIdNum === chapters.length}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            Next Chapter
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;