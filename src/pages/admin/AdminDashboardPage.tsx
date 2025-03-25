import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import { CalendarDays, Activity, CheckCircle, Star, RefreshCw, Download, FileText, Database } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

// Type definitions for our data structures
interface EngagementData {
  date: string;
  volunteers: number;
  events: number;
}

interface CompletionData {
  project: string;
  completion: number;
  target: number;
}

interface FeedbackData {
  category: string;
  score: number;
  count: number;
}

interface VolunteerActivity {
  name: string;
  hours: number;
  tasks: number;
  events: number;
}

// Backend API service - will be replaced with actual API calls in the future
// This creates clear integration points for the backend
class DashboardService {
  static async getEngagementData(): Promise<EngagementData[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([
      { date: "Jan", volunteers: 65, events: 4 },
      { date: "Feb", volunteers: 59, events: 3 },
      { date: "Mar", volunteers: 80, events: 5 },
      { date: "Apr", volunteers: 81, events: 6 },
      { date: "May", volunteers: 76, events: 4 },
      { date: "Jun", volunteers: 92, events: 7 },
    ]);
  }

  static async getCompletionData(): Promise<CompletionData[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([
      { project: "Community Cleanup", completion: 85, target: 100 },
      { project: "Food Drive", completion: 62, target: 75 },
      { project: "Tutoring Program", completion: 43, target: 50 },
      { project: "Senior Support", completion: 29, target: 40 },
      { project: "Youth Mentorship", completion: 38, target: 45 },
    ]);
  }

  static async getFeedbackData(): Promise<FeedbackData[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([
      { category: "Organization", score: 4.2, count: 78 },
      { category: "Communication", score: 3.9, count: 85 },
      { category: "Support", score: 4.5, count: 72 },
      { category: "Impact", score: 4.7, count: 68 },
      { category: "Overall", score: 4.3, count: 90 },
    ]);
  }

  static async getTopVolunteers(): Promise<VolunteerActivity[]> {
    // TODO: Replace with actual API call
    return Promise.resolve([
      { name: "Sarah Johnson", hours: 48, tasks: 15, events: 6 },
      { name: "Michael Rodriguez", hours: 42, tasks: 12, events: 5 },
      { name: "Emma Williams", hours: 36, tasks: 10, events: 4 },
      { name: "David Chen", hours: 30, tasks: 9, events: 3 },
      { name: "Olivia Martinez", hours: 28, tasks: 8, events: 4 },
    ]);
  }

  // Export endpoints - will be replaced with actual API calls
  static async exportToCSV(dataType: string): Promise<Blob> {
    // In a real implementation, this would call the backend API
    // For now, we'll generate the CSV on the client side
    return Promise.resolve(new Blob([""], { type: "text/csv" }));
  }

  static async exportToExcel(dataType: string): Promise<Blob> {
    // In a real implementation, this would call the backend API
    // For now, we'll generate the Excel file on the client side
    return Promise.resolve(new Blob([""], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  }
}

// Utility function to convert data to CSV format
const convertToCSV = (data: any[], fields: string[]): string => {
  // Create header row
  let csv = fields.join(",") + "\n";
  
  // Add each row of data
  data.forEach(item => {
    const row = fields.map(field => {
      const value = item[field];
      // Handle values that might contain commas by wrapping in quotes
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : String(value);
    }).join(",");
    csv += row + "\n";
  });
  
  return csv;
};

// Utility function to download a file
const downloadFile = (content: string | Blob, fileName: string, mimeType: string): void => {
  const blob = content instanceof Blob 
    ? content 
    : new Blob([content], { type: mimeType });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const AdminDashboardPage = () => {
  // State for data
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [completionData, setCompletionData] = useState<CompletionData[]>([]);
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [topVolunteers, setTopVolunteers] = useState<VolunteerActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("engagement");

  useEffect(() => {
    loadData();
  }, []);

  // Load all dashboard data
  const loadData = async () => {
    setLoading(true);
    try {
      const [engagement, completion, feedback, volunteers] = await Promise.all([
        DashboardService.getEngagementData(),
        DashboardService.getCompletionData(),
        DashboardService.getFeedbackData(),
        DashboardService.getTopVolunteers(),
      ]);
      
      setEngagementData(engagement);
      setCompletionData(completion);
      setFeedbackData(feedback);
      setTopVolunteers(volunteers);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setLoading(false);
    }
  };

  // Export data functions
  const exportDataToCSV = async () => {
    setExportLoading(true);
    try {
      let csvContent = "";
      let fileName = "";

      // Export appropriate data based on active tab
      switch (activeTab) {
        case "engagement":
          csvContent = convertToCSV(engagementData, ["date", "volunteers", "events"]);
          fileName = "volunteer-engagement-data.csv";
          break;
        case "completion":
          csvContent = convertToCSV(completionData, ["project", "completion", "target"]);
          fileName = "project-completion-data.csv";
          break;
        case "feedback":
          csvContent = convertToCSV(feedbackData, ["category", "score", "count"]);
          fileName = "feedback-data.csv";
          break;
        case "overview":
          csvContent = convertToCSV(topVolunteers, ["name", "hours", "tasks", "events"]);
          fileName = "top-volunteers-data.csv";
          break;
        default:
          csvContent = "No data available";
          fileName = "dashboard-data.csv";
      }

      downloadFile(csvContent, fileName, "text/csv");
    } catch (error) {
      console.error("Failed to export data:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const exportAllDataToCSV = async () => {
    setExportLoading(true);
    try {
      // Create a zip file with all data sets
      // For now, we'll just download each dataset separately
      
      // Engagement data
      const engagementCSV = convertToCSV(engagementData, ["date", "volunteers", "events"]);
      downloadFile(engagementCSV, "volunteer-engagement-data.csv", "text/csv");
      
      // Completion data
      const completionCSV = convertToCSV(completionData, ["project", "completion", "target"]);
      downloadFile(completionCSV, "project-completion-data.csv", "text/csv");
      
      // Feedback data
      const feedbackCSV = convertToCSV(feedbackData, ["category", "score", "count"]);
      downloadFile(feedbackCSV, "feedback-data.csv", "text/csv");
      
      // Top volunteers data
      const volunteersCSV = convertToCSV(topVolunteers, ["name", "hours", "tasks", "events"]);
      downloadFile(volunteersCSV, "top-volunteers-data.csv", "text/csv");
      
    } catch (error) {
      console.error("Failed to export all data:", error);
    } finally {
      setExportLoading(false);
    }
  };

  // When backend is implemented, these would call the appropriate API endpoints
  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      // In real implementation, this would call the backend API to generate Excel file
      // For demonstration, we're just showing the integration point
      const blob = await DashboardService.exportToExcel(activeTab);
      downloadFile(blob, `${activeTab}-data.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    } catch (error) {
      console.error("Failed to export Excel data:", error);
    } finally {
      setExportLoading(false);
    }
  };

  // Prepare chart configurations
  const volunteerEngagementChartData = {
    labels: engagementData.map(item => item.date),
    datasets: [
      {
        label: "Volunteer Participation",
        data: engagementData.map(item => item.volunteers),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Events",
        data: engagementData.map(item => item.events * 15), // Scaled for visualization
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const engagementOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Volunteer Engagement Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Volunteers",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  const completionChartData = {
    labels: completionData.map(item => item.project),
    datasets: [
      {
        label: "Completed Tasks",
        data: completionData.map(item => item.completion),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Target",
        data: completionData.map(item => item.target),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const completionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Task Completion by Project",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Tasks",
        },
      },
    },
  };

  const feedbackChartData = {
    labels: feedbackData.map(item => item.category),
    datasets: [
      {
        label: "Average Score",
        data: feedbackData.map(item => item.score),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const feedbackOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Average Feedback Scores",
      },
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Volunteer activity radar chart
  const volunteerRadarData = {
    labels: ["Hours", "Tasks", "Events", "Feedback", "Recruitment"],
    datasets: [
      {
        label: "Current Month",
        data: [85, 70, 90, 81, 56],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Previous Month",
        data: [65, 59, 80, 81, 45],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <div className="flex space-x-2">
          {/* Export Data Dropdown */}

            {/* <Link to="/changeroles" className="hover:underline">
              <Button  className="flex items-center" 
            variant="outline" size="sm">
                Change Roles
              </Button>
          </Link> */}

          <Link to="/admin/changeroles">
            <Button 
            className="flex items-center" 
            variant="outline" 
            >
              Manage Roles
          </Button>
          </Link>
          
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={exportLoading}>
                <Download className="mr-2 h-4 w-4" />
                {exportLoading ? "Exporting..." : "Export Data"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportDataToCSV}>
                <FileText className="mr-2 h-4 w-4" />
                Export Current View as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAllDataToCSV}>
                <Database className="mr-2 h-4 w-4" />
                Export All Data as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                <FileText className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Refresh Button */}
          <Button 
            className="flex items-center" 
            variant="outline" 
            onClick={loadData} 
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {loading ? "Loading..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="rounded-full bg-blue-100 p-3 mb-2">
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold">18</h3>
            <p className="text-sm text-muted-foreground">Active Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="rounded-full bg-green-100 p-3 mb-2">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold">92%</h3>
            <p className="text-sm text-muted-foreground">Volunteer Engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="rounded-full bg-yellow-100 p-3 mb-2">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold">78%</h3>
            <p className="text-sm text-muted-foreground">Task Completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="rounded-full bg-purple-100 p-3 mb-2">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold">4.3</h3>
            <p className="text-sm text-muted-foreground">Average Feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Event Management Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Event Management</CardTitle>
          <CardDescription>Create and manage events.</CardDescription>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Link to="/admin/events/create">
            <Button>Create Event</Button>
          </Link>
          <Link to="/admin/events/manage">
            <Button variant="outline">Manage Events</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Data Visualization Tabs */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Data Visualization</CardTitle>
            <CardDescription>
              Metrics on engagement, task completion rates, and feedback.
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportDataToCSV} 
            disabled={exportLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Export View
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="engagement" 
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="completion">Completion</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="engagement" className="mt-0">
              <div className="h-80">
                <Line options={engagementOptions} data={volunteerEngagementChartData} />
              </div>
            </TabsContent>
            
            <TabsContent value="completion" className="mt-0">
              <div className="h-80">
                <Bar options={completionOptions} data={completionChartData} />
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <Doughnut 
                    data={feedbackChartData} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "right",
                        },
                        title: {
                          display: true,
                          text: "Feedback Distribution",
                        },
                      },
                    }} 
                  />
                </div>
                <div className="overflow-auto max-h-64 bg-card rounded-lg border">
                  {/* Table with proper dark mode styling */}
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-20">
                    <tr className="bg-card shadow-sm">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted">Responses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {feedbackData.map((item, index) => (
                        <tr key={index} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{item.score.toFixed(1)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <Radar data={volunteerRadarData} options={radarOptions} />
                </div>
                <div className="flex flex-col h-64">
                  <h3 className="font-medium mb-2">Top Volunteers This Month</h3>
                  <div className="overflow-auto max-h-64 bg-card rounded-lg border">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0">
                      <tr className="bg-card shadow-sm">
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted">Hours</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted">Tasks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {topVolunteers.map((volunteer, index) => (
                          <tr key={index} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{volunteer.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{volunteer.hours}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{volunteer.tasks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;