import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, Bell } from "lucide-react";
import StatsCard from "./StatsCard";

interface AdminDashboardProps {
  profile: any;
}

const AdminDashboard = ({ profile }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    avgAttendance: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [studentsRes, teachersRes, coursesRes, attendanceRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact" }).eq("role", "student"),
      supabase.from("profiles").select("id", { count: "exact" }).eq("role", "teacher"),
      supabase.from("courses").select("id", { count: "exact" }),
      supabase.from("attendance").select("status", { count: "exact" }),
    ]);

    const presentCount = await supabase
      .from("attendance")
      .select("id", { count: "exact" })
      .eq("status", "present");

    const avgAttendance = attendanceRes.count && attendanceRes.count > 0
      ? ((presentCount.count || 0) / attendanceRes.count) * 100
      : 0;

    setStats({
      totalStudents: studentsRes.count || 0,
      totalTeachers: teachersRes.count || 0,
      totalCourses: coursesRes.count || 0,
      avgAttendance: Math.round(avgAttendance),
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {profile?.full_name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          trend="+12%"
        />
        <StatsCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={Users}
          trend="+5%"
        />
        <StatsCard
          title="Active Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          trend="+8%"
        />
        <StatsCard
          title="Avg Attendance"
          value={`${stats.avgAttendance}%`}
          icon={TrendingUp}
          trend="+3%"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your institution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors">
              Add New User
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors">
              Create Course
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors">
              Generate Report
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors">
              Send Announcement
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Low Attendance Alert</p>
              <p className="text-xs text-muted-foreground">5 students below 75%</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">New Course Created</p>
              <p className="text-xs text-muted-foreground">Data Structures - CS201</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Report Generated</p>
              <p className="text-xs text-muted-foreground">Monthly performance summary</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
