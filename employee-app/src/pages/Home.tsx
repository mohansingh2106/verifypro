import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Layout/Navbar";
import EmployeeCard from "@/components/Employee/EmployeeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Users,
  Shield,
  TrendingUp,
  FileText,
  Plus,
} from "lucide-react";
import API from "@/lib/api";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Current logged in user
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const uid = localStorage.getItem("verifypro_uid");
    if (!uid) {
      navigate("/login");
      return;
    }

    // Fetch self user profile
    const fetchSelf = async () => {
      try {
        const res = await API.get(`/employees/${encodeURIComponent(uid)}`);
        if (res.data?.employee) {
          setCurrentUser(res.data.employee);
        } else {
          setCurrentUser(res.data); // in case backend returns plain object
        }
      } catch (err) {
        console.error("Failed to load self profile:", err);
      }
    };

    fetchSelf();
  }, [navigate]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await API.get("/employees");
        const rows = res.data || [];

        const normalized = rows.map((r: any) => ({
          id: r.id?.toString(),
          uid: r.employee_uid,
          name: r.fullName || "No name",
          email: r.email,
          avatar: "",
          designation: "Software Engineer", // placeholder
          company: "Dun & Bradstreet", // placeholder
          location: r.address || "",
          skills: ["JavaScript", "React", "SQL"], // placeholder
          verified: false,
          experience: "1 year",
          status: "available",
          dateOfBirth: r.dateOfBirth,
        }));

        setEmployees(normalized);
      } catch (err) {
        console.error("Failed to load employees:", err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      employee.name.toLowerCase().includes(q) ||
      (employee.company || "").toLowerCase().includes(q) ||
      (employee.skills || []).some((s: string) =>
        s.toLowerCase().includes(q)
      );

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "verified" && employee.verified) ||
      (selectedFilter === "available" && employee.status === "available");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* 🔹 Pass real user to Navbar */}
      <Navbar user={currentUser} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {currentUser
                  ? `Welcome back, ${currentUser.fullName}! 👋`
                  : "Loading..."}
              </h1>
              <p className="text-muted-foreground mt-2">
                Discover and connect with verified professionals
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Add Work History
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{employees.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Employees
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Shield className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {employees.filter((e) => e.verified).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        employees.filter((e) => e.status === "available")
                          .length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">—</p>
                    <p className="text-sm text-muted-foreground">Resumes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8 bg-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Discover Professionals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, company, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-muted/30"
                />
              </div>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                All Employees
              </Button>
              <Button
                variant={selectedFilter === "verified" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("verified")}
              >
                <Shield className="h-4 w-4 mr-1" />
                Verified Only
              </Button>
              <Button
                variant={
                  selectedFilter === "available" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedFilter("available")}
              >
                Available
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Professional Directory
              <Badge variant="secondary" className="ml-3">
                {filteredEmployees.length} found
              </Badge>
            </h2>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onViewProfile={(id) => {
                    localStorage.setItem("verifypro_uid", employee.uid);
                    window.location.href = `/employee-profile/${employee.uid}`;
                  }}
                  onContact={(id) => console.log("Contact:", id)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-card/50 border-border/50">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No employees found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
