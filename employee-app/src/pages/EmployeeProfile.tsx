// src/pages/EmployeeProfile.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Layout/Navbar";
import API from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Employee {
  id: string;
  uid: string;
  name: string;
  email?: string;
  avatar?: string;
  designation?: string;
  company?: string;
  location?: string;
  skills?: string[];
  verified?: boolean;
  experience?: string;
  status?: string;
  dateOfBirth?: string;
}

const EmployeeProfile = () => {
  const { uid } = useParams<{ uid: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const res = await API.get(`http://localhost:5000/api/employees/${uid}`);
        setEmployee(res.data);
      } catch (err) {
        console.error("Failed to load employee:", err);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchEmployee();
  }, [uid]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={{
          name: employee?.name || "Guest",
          uid: employee?.uid || "",
          avatar: employee?.avatar || "",
          verified: employee?.verified ?? false,
        }}
      />

      <div className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div>Loading employee data...</div>
        ) : employee ? (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>{employee.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>UID:</strong> {employee.uid}
              </p>
              <p>
                <strong>Email:</strong> {employee.email || "N/A"}
              </p>
              <p>
                <strong>Company:</strong> {employee.company || "N/A"}
              </p>
              <p>
                <strong>Designation:</strong> {employee.designation || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {employee.verified ? (
                  <Badge>Verified</Badge>
                ) : (
                  <Badge variant="secondary">Unverified</Badge>
                )}
              </p>
              <p>
                <strong>Skills:</strong> {employee.skills?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Experience:</strong> {employee.experience || "N/A"}
              </p>
              <Button onClick={() => window.history.back()} className="mt-4">
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-muted-foreground">
            Employee not found
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
