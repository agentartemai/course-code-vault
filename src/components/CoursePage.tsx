import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, LogOut, Award, Lock, CheckCircle } from "lucide-react";

interface CourseData {
  name: string;
  description: string;
  chapters: Array<{
    id: number;
    title: string;
    videoUrl: string;
    downloadLinks: string[];
  }>;
}

const CoursePage = () => {
  const navigate = useNavigate();
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [courseData, setCourseData] = useState<CourseData>({
    name: "Master Course",
    description: "Transform your knowledge with our comprehensive course",
    chapters: [
      { id: 1, title: "Chapter 1", videoUrl: "", downloadLinks: ["", ""] },
      { id: 2, title: "Chapter 2", videoUrl: "", downloadLinks: ["", ""] },
      { id: 3, title: "Chapter 3", videoUrl: "", downloadLinks: ["", ""] },
      { id: 4, title: "Chapter 4", videoUrl: "", downloadLinks: ["", ""] }
    ]
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    // Load course data
    const storedData = localStorage.getItem("courseData");
    if (storedData) {
      setCourseData(JSON.parse(storedData));
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

  const progressPercentage = (completedChapters.length / courseData.chapters.length) * 100;

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
                <h1 className="text-2xl font-bold">{courseData.name}</h1>
                <p className="text-white/80">{courseData.description}</p>
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
                  {completedChapters.length} of {courseData.chapters.length} chapters completed
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
          {courseData.chapters.map((chapter) => {
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
                           Video Available
                         </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-primary text-white">
                      Chapter {chapter.id}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg mb-2">{chapter.title}</h3>
                  <p className="text-muted-foreground mb-4">Watch the video and download resources</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      2 downloadable files
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