import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart3, Brain, Bell } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl">AOS</h1>
              <p className="text-xs text-muted-foreground">Academic Operating System</p>
            </div>
          </div>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Transform Your Educational Institution
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Complete digital management system with AI-powered automation for schools, colleges, and training institutions
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
            Start Free Trial
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Real-time Analytics"
            description="Track performance, attendance, and engagement with beautiful dashboards"
          />
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="AI Reports"
            description="Auto-generate performance summaries and compliance documentation"
          />
          <FeatureCard
            icon={<Bell className="h-8 w-8" />}
            title="Smart Alerts"
            description="Automatic notifications for low attendance and important deadlines"
          />
          <FeatureCard
            icon={<GraduationCap className="h-8 w-8" />}
            title="Multi-role System"
            description="Separate dashboards for admins, teachers, and students"
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center shadow-md">
          <h2 className="text-2xl font-bold mb-4">Ready to modernize your institution?</h2>
          <p className="text-muted-foreground mb-6">
            Join hundreds of educational institutions already using AOS
          </p>
          <Button size="lg" onClick={() => navigate("/auth")}>
            Create Account
          </Button>
        </div>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 AOS - Academic Operating System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
    <div className="mb-4 text-primary">{icon}</div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Index;
