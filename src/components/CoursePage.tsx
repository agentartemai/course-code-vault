import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, LogOut, Award, Lock, CheckCircle } from "lucide-react";

const chapters = [
  {
    id: 1,
    title: "Foundation Principles",
    description: "Master the core concepts that will transform your understanding",
    duration: "45 min",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sample video
    files: [
      { name: "Chapter 1 - Workbook.pdf", size: "2.4 MB" },
      { name: "Chapter 1 - Templates.zip", size: "1.2 MB" }
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
      { name: "Chapter 2 - Advanced Guide.pdf", size: "3.1 MB" },
      { name: "Chapter 2 - Case Studies.pdf", size: "4.2 MB" }
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
      { name: "Chapter 3 - Implementation Kit.zip", size: "5.8 MB" },
      { name: "Chapter 3 - Checklist.pdf", size: "0.8 MB" }
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
      { name: "Chapter 4 - Expert Strategies.pdf", size: "6.2 MB" },
      { name: "Chapter 4 - Bonus Resources.zip", size: "8.4 MB" }
    ]
  }
];

const CoursePage = () => {
  const navigate = useNavigate();
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

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
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentAccessCode");
    navigate("/");
  };

  const handleChapterClick = (chapterId: number) => {
    navigate(`/course/chapter/${chapterId}`);
  };

  const markChapterComplete = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      const updated = [...completedChapters, chapterId];
      setCompletedChapters(updated);
      localStorage.setItem("completedChapters", JSON.stringify(updated));
    }
  };

  const progressPercentage = (completedChapters.length / chapters.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-orange-500";
      case "Expert": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-secondary p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Master Course Dashboard</h1>
                <p className="text-white/80">Your journey to expertise starts here</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-white border-white/30 hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Overview */}
        <Card className="mb-8 bg-gradient-to-b from-card to-muted/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Course Progress
                </CardTitle>
                <CardDescription>
                  {completedChapters.length} of {chapters.length} chapters completed
                </CardDescription>
              </div>
              <Badge className="bg-accent text-accent-foreground">
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="w-full" />
          </CardContent>
        </Card>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapters.map((chapter) => {
            const isCompleted = completedChapters.includes(chapter.id);
            const isUnlocked = chapter.id === 1 || completedChapters.includes(chapter.id - 1);
            
            return (
              <Card 
                key={chapter.id} 
                className={`bg-gradient-to-b from-card to-muted/50 transition-all duration-300 hover:scale-105 ${
                  isUnlocked ? "cursor-pointer hover:shadow-lg" : "opacity-60"
                }`}
                onClick={() => isUnlocked && handleChapterClick(chapter.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? "bg-success" : isUnlocked ? "bg-primary" : "bg-muted"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : isUnlocked ? (
                          <Play className="w-5 h-5 text-white" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Chapter {chapter.id}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {chapter.duration}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      className={`${getDifficultyColor(chapter.difficulty)} text-white`}
                    >
                      {chapter.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg mb-2">{chapter.title}</h3>
                  <p className="text-muted-foreground mb-4">{chapter.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {chapter.files.length} downloadable files
                    </div>
                    {isCompleted && (
                      <Badge variant="outline" className="text-success border-success">
                        Completed
                      </Badge>
                    )}
                    {!isUnlocked && (
                      <Badge variant="outline" className="text-muted-foreground">
                        Locked
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Course Completion */}
        {progressPercentage === 100 && (
          <Card className="mt-8 bg-gradient-to-r from-success to-success/80 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                Congratulations! Course Completed
              </CardTitle>
              <CardDescription className="text-white/80">
                You have successfully completed all chapters of the Master Course
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoursePage;