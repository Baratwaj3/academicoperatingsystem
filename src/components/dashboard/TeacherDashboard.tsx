import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ClipboardCheck } from "lucide-react";
import StatsCard from "./StatsCard";

interface TeacherDashboardProps {
  profile: any;
}

const TeacherDashboard = ({ profile }: TeacherDashboardProps) => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgAttendance: 0,
  });
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchCourses();
  }, [profile]);

  const fetchStats = async () => {
    const { data: coursesData } = await supabase
      .from("courses")
      .select("id")
      .eq("teacher_id", profile.id);

    const courseIds = coursesData?.map(c => c.id) || [];

    let totalStudents = 0;
    if (courseIds.length > 0) {
      const { count } = await supabase
        .from("enrollments")
        .select("id", { count: "exact" })
        .in("course_id", courseIds);
      totalStudents = count || 0;
    }

    setStats({
      totalCourses: coursesData?.length || 0,
      totalStudents,
      avgAttendance: 85, // Placeholder
    });
  };

  const fetchCourses = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("teacher_id", profile.id);

    setCourses(data || []);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {profile?.full_name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="My Courses"
          value={stats.totalCourses}
          icon={BookOpen}
        />
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
        />
        <StatsCard
          title="Avg Attendance"
          value={`${stats.avgAttendance}%`}
          icon={ClipboardCheck}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>Courses you're teaching this semester</CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No courses assigned yet
            </p>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">{course.code}</p>
                    </div>
                    <button className="text-sm text-primary hover:underline">
                      View Details
                    </button>
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

export default TeacherDashboard;
