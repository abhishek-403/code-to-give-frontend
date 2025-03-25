import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/lib/constants/server-constants";
import useLanguage from "@/lib/hooks/useLang";
import { useAppSelector } from "@/store";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import {
  Activity,
  CalendarDays,
  CheckCircle,
  Database,
  Download,
  FileText,
  RefreshCw,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Radar } from "react-chartjs-2";
import { Link } from "react-router-dom";

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
      { project: "Annual Inclusive Sports Day", completion: 85, target: 100 },
      { project: "Blind Cricket Tournament", completion: 62, target: 75 },
      { project: "Disability Awareness Marathon", completion: 43, target: 50 },
      { project: "Art & Talent Fest", completion: 29, target: 40 },
      { project: "Free Eye Camp & Health Drive", completion: 38, target: 45 },
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
      { name: "Aarav Sharma", hours: 40, tasks: 14, events: 5 },
      { name: "Priya Singh", hours: 38, tasks: 11, events: 6 },
      { name: "Vikram Iyer", hours: 35, tasks: 10, events: 4 },
      { name: "Ananya Reddy", hours: 32, tasks: 9, events: 3 },
      { name: "Rohan Desai", hours: 29, tasks: 8, events: 2 },
      { name: "Aditya Kapoor", hours: 45, tasks: 13, events: 7 },
      { name: "Meera Patel", hours: 37, tasks: 12, events: 5 },
      { name: "Arjun Nair", hours: 33, tasks: 10, events: 4 },
      { name: "Ishaan Chatterjee", hours: 31, tasks: 9, events: 3 },
      { name: "Kavya Joshi", hours: 27, tasks: 7, events: 2 },
    ]);
  }

  // Export endpoints - will be replaced with actual API calls
  static async exportToCSV(_: string): Promise<Blob> {
    // In a real implementation, this would call the backend API
    // For now, we'll generate the CSV on the client side
    return Promise.resolve(new Blob([""], { type: "text/csv" }));
  }

  static async exportToExcel(_: string): Promise<Blob> {
    // In a real implementation, this would call the backend API
    // For now, we'll generate the Excel file on the client side
    return Promise.resolve(
      new Blob([""], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );
  }
}

// Utility function to convert data to CSV format
const convertToCSV = (data: any[], fields: string[]): string => {
  // Create header row
  let csv = fields.join(",") + "\n";

  // Add each row of data
  data.forEach((item) => {
    const row = fields
      .map((field) => {
        const value = item[field];
        // Handle values that might contain commas by wrapping in quotes
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : String(value);
      })
      .join(",");
    csv += row + "\n";
  });

  return csv;
};

// Utility function to download a file
const downloadFile = (
  content: string | Blob,
  fileName: string,
  mimeType: string
): void => {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
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
          csvContent = convertToCSV(engagementData, [
            "date",
            "volunteers",
            "events",
          ]);
          fileName = "volunteer-engagement-data.csv";
          break;
        case "completion":
          csvContent = convertToCSV(completionData, [
            "project",
            "completion",
            "target",
          ]);
          fileName = "project-completion-data.csv";
          break;
        case "feedback":
          csvContent = convertToCSV(feedbackData, [
            "category",
            "score",
            "count",
          ]);
          fileName = "feedback-data.csv";
          break;
        case "overview":
          csvContent = convertToCSV(topVolunteers, [
            "name",
            "hours",
            "tasks",
            "events",
          ]);
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
      const engagementCSV = convertToCSV(engagementData, [
        "date",
        "volunteers",
        "events",
      ]);
      downloadFile(engagementCSV, "volunteer-engagement-data.csv", "text/csv");

      // Completion data
      const completionCSV = convertToCSV(completionData, [
        "project",
        "completion",
        "target",
      ]);
      downloadFile(completionCSV, "project-completion-data.csv", "text/csv");

      // Feedback data
      const feedbackCSV = convertToCSV(feedbackData, [
        "category",
        "score",
        "count",
      ]);
      downloadFile(feedbackCSV, "feedback-data.csv", "text/csv");

      // Top volunteers data
      const volunteersCSV = convertToCSV(topVolunteers, [
        "name",
        "hours",
        "tasks",
        "events",
      ]);
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
      downloadFile(
        blob,
        `${activeTab}-data.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      console.error("Failed to export Excel data:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return "text-green-600 dark:text-green-400";
    if (score >= 4.0) return "text-blue-600 dark:text-blue-400";
    if (score >= 3.0) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Chart configurations with improved accessibility color contrast
  const volunteerEngagementChartData = {
    labels: engagementData.map((item) => item.date),
    datasets: [
      {
        label: "Volunteer Participation",
        data: engagementData.map((item) => item.volunteers),
        borderColor: "rgba(56, 189, 248, 1)", // Higher contrast blue
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Events",
        data: engagementData.map((item) => item.events * 15), // Scaled for visualization
        borderColor: "rgba(168, 85, 247, 1)", // Higher contrast purple
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const engagementOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Volunteer Engagement Over Time",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Volunteers",
          font: {
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(160, 160, 160, 0.15)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
          font: {
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // Completion chart configuration with improved styling
  const completionChartData = {
    labels: completionData.map((item) => item.project),
    datasets: [
      {
        label: "Completed Tasks",
        data: completionData.map((item) => item.completion),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Target",
        data: completionData.map((item) => item.target),
        backgroundColor: "rgba(255, 206, 86, 0.7)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  const completionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Task Completion by Project",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: ${value} tasks`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Tasks",
          font: {
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(160, 160, 160, 0.15)",
        },
      },
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // Feedback chart configuration with improved styling
  const feedbackChartData = {
    labels: feedbackData.map((item) => item.category),
    datasets: [
      {
        label: "Average Score",
        data: feedbackData.map((item) => item.score),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const feedbackOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          padding: 10,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Average Feedback Scores",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const count =
              feedbackData.find((item) => item.category === label)?.count || 0;
            return [`Score: ${value.toFixed(1)}/5`, `Responses: ${count}`];
          },
        },
      },
    },
  };

  // Volunteer radar chart configuration with improved styling
  const volunteerRadarData = {
    labels: ["Hours", "Tasks", "Events", "Feedback", "Recruitment"],
    datasets: [
      {
        label: "Current Month",
        data: [85, 70, 90, 81, 56],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        pointLabelFontSize: 14,
      },
      {
        label: "Previous Month",
        data: [65, 59, 80, 81, 45],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        pointLabelFontSize: 14,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: "rgba(160, 160, 160, 0.2)",
        },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          font: {
            size: 12,
            weight: "bold",
          },
        },
        ticks: {
          stepSize: 20,
          backdropColor: "transparent",
          z: 100,
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
        padding: 10,
        displayColors: true,
      },
    },
    elements: {
      line: {
        tension: 0.1,
      },
    },
  };

  const { t } = useLanguage();

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-3xl font-bold">{t("Admin_Dashboard")}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/changeroles">
            <Button
              className="flex items-center"
              variant="outline"
              aria-label={t("manage_roles")}
            >
              <span className="sr-only md:not-sr-only">
                {t("manage_roles")}
              </span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={exportLoading}
                aria-label={exportLoading ? "Exporting data" : "Export data"}
              >
                <Download className="mr-2 h-4 w-4" />
                <span>{exportLoading ? t("exporting") : t("export_data")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={exportDataToCSV}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{t("export_current_view_as_csv")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={exportAllDataToCSV}
                className="cursor-pointer"
              >
                <Database className="mr-2 h-4 w-4" />
                <span>{t("export_all_data_as_csv")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={exportToExcel}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{t("export_as_excel")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="flex items-center"
            variant="outline"
            onClick={loadData}
            disabled={loading}
            aria-label={loading ? "Loading data" : "Refresh data"}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            <span>{loading ? t("loading") : t("refresh_data")}</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats Summary with improved accessibility */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="transition-all hover:shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mb-3">
              <CalendarDays
                className="h-8 w-8 text-blue-600 dark:text-blue-300"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-3xl font-bold">{t("10")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("Active_Events")}
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-3">
              <Activity
                className="h-8 w-8 text-green-600 dark:text-green-300"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-3xl font-bold">{t("92_")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("Volunteer_Engagement")}
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3 mb-3">
              <CheckCircle
                className="h-8 w-8 text-yellow-600 dark:text-yellow-300"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-3xl font-bold">{t("78_")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("Task_Completion")}
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mb-3">
              <Star
                className="h-8 w-8 text-purple-600 dark:text-purple-300"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-3xl font-bold">{t("4.3")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("Average_Feedback")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Management Card */}
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">{t("event_management")}</CardTitle>
          <CardDescription>{t("create_and_Manage_Events_")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link to="/admin/events/create">
            <Button className="flex items-center gap-2">
              <span className="hidden sm:inline">+</span>
              {t("create_event")}
            </Button>
          </Link>
          <Link to="/admin/events/manage">
            <Button variant="outline" className="flex items-center gap-2">
              <span className="hidden sm:inline">🔍</span>
              {t("manage_Events")}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Data Visualization Tabs with enhanced accessibility */}
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{t("Data_Visualization")}</CardTitle>
            <CardDescription>
              {t("metrics_on_engagement_task_completion_rates_and_feedback_")}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportDataToCSV}
            disabled={exportLoading}
            className="self-start sm:self-auto"
            aria-label="Export current view"
          >
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>{t("export_view")}</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="engagement"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="mb-6 w-full justify-start overflow-x-auto">
              <TabsTrigger value="engagement">{t("engagement")}</TabsTrigger>
              <TabsTrigger value="completion">{t("completion")}</TabsTrigger>
              <TabsTrigger value="feedback">{t("feedback")}</TabsTrigger>
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            </TabsList>

            <TabsContent value="engagement" className="mt-0">
              <div className="h-80">
                <Line
                  options={engagementOptions}
                  data={volunteerEngagementChartData}
                />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Note:</span> Events data is
                  scaled (×15) for better visualization alongside volunteer
                  numbers.
                </p>
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
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            boxWidth: 12,
                            usePointStyle: true,
                            padding: 20,
                          },
                        },
                        title: {
                          display: true,
                          text: "Feedback Distribution",
                          font: {
                            size: 16,
                            weight: "bold",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="overflow-auto h-64 rounded-lg border dark:border-gray-700">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted/95 backdrop-blur-sm">
                          {t("category")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted/95 backdrop-blur-sm">
                          {t("score")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted/95 backdrop-blur-sm">
                          {t("responses")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {feedbackData.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            {item.category}
                          </td>
                          <td
                            className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${getScoreColor(
                              item.score
                            )}`}
                          >
                            {item.score.toFixed(1)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {item.count}
                          </td>
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
                  <Radar
                    data={volunteerRadarData}
                    options={{
                      scales: {
                        r: {
                          angleLines: {
                            display: true,
                          },
                          suggestedMin: 0,
                          suggestedMax: 100,
                          ticks: {
                            backdropColor: "transparent",
                            z: 100,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            boxWidth: 12,
                            usePointStyle: true,
                            padding: 20,
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="flex flex-col h-64">
                  <h3 className="font-medium mb-3">
                    {t("top_volunteers_this_month")}
                  </h3>
                  <div className="overflow-auto h-full rounded-lg border dark:border-gray-700">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 z-20">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted/95 backdrop-blur-sm">
                            {t("name")}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted/95 backdrop-blur-sm">
                            {t("hours")}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted/95 backdrop-blur-sm">
                            {t("tasks")}
                          </th>
                          <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-muted/95 backdrop-blur-sm">
                            {t("events")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {topVolunteers.slice(0, 5).map((volunteer, index) => (
                          <tr
                            key={index}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              {volunteer.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {volunteer.hours}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {volunteer.tasks}
                            </td>
                            <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm">
                              {volunteer.events}
                            </td>
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

      {/* Accessible skip to top link - visible only when scrolled down */}
      <div
        className="fixed bottom-4 right-4 opacity-0 transition-opacity duration-300 hover:opacity-100 focus-within:opacity-100"
        style={{ opacity: "var(--scroll-opacity, 0)" }}
        aria-hidden="true"
      >
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          ↑
        </Button>
      </div>

      {/* Scroll listener effect is moved outside JSX */}
    </div>
  );
};

export default AdminDashboardPage;
