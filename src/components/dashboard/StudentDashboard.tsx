import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardCheck, TrendingUp, AlertCircle } from "lucide-react";
import StatsCard from "./StatsCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StudentDashboardProps {
  profile: any;
}

const StudentDashboard = ({ profile }: StudentDashboardProps) => {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    attendance: 0,
    avgGrade: 0,
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [lowAttendance, setLowAttendance] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchCourses();
  }, [profile]);

  const fetchStats = async () => {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", profile.id);

    const courseIds = enrollments?.map(e => e.course_id) || [];

    let attendancePercentage = 0;
    if (courseIds.length > 0) {
      const { count: totalRecords } = await supabase
        .from("attendance")
        .select("id", { count: "exact" })
        .eq("student_id", profile.id);

      const { count: presentRecords } = await supabase
        .from("attendance")
        .select("id", { count: "exact" })
        .eq("student_id", profile.id)
        .eq("status", "present");

      if (totalRecords && totalRecords > 0) {
        attendancePercentage = Math.round((presentRecords || 0) / totalRecords * 100);
      }
    }

    setLowAttendance(attendancePercentage < 75);

    setStats({
      enrolledCourses: enrollments?.length || 0,
      attendance: attendancePercentage,
      avgGrade: 85, // Placeholder
    });
  };

  const fetchCourses = async () => {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id, courses(*)")
      .eq("student_id", profile.id);

    setCourses(enrollments?.map(e => e.courses).filter(Boolean) || []);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {profile?.full_name}
        </p>
      </div>

      {lowAttendance && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Attendance Alert</AlertTitle>
          <AlertDescription>
            Your attendance is below 75%. Please maintain regular attendance to avoid academic issues.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Enrolled Courses"
          value={stats.enrolledCourses}
          icon={BookOpen}
        />
        <StatsCard
          title="Attendance"
          value={`${stats.attendance}%`}
          icon={ClipboardCheck}
        />
        <StatsCard
          title="Avg Grade"
          value={`${stats.avgGrade}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Your enrolled courses this semester</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No courses enrolled yet
              </p>
            ) : (
              <div className="space-y-3">
                {courses.map((course: any) => (
                  <div key={course.id} className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Your latest assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No assessments available yet
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
