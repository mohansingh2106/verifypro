
import { useEffect, useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Briefcase,
  Award,
  MapPin,
  Mail,
  Phone,
  Plus,
  Edit,
  Trash2,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [workHistory, setWorkHistory] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem("verifypro_uid");
    if (!uid) {
      toast({
        title: "No user found",
        description: "Please view a profile from the directory first.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await API.get(`/employees/${encodeURIComponent(uid)}`);
        let r = res.data;

        // Handle multiple backend shapes:
        // 1) { employee: { ... } }
        // 2) direct object { id: ..., fullName: ... }
        // 3) array [ {...} ]
        if (!r) {
          throw new Error("Empty response");
        }

        if (r.employee) r = r.employee;
        if (Array.isArray(r) && r.length > 0) r = r[0];

        if (!r || Object.keys(r).length === 0) {
          toast({ title: "Not found", description: "Employee not found", variant: "destructive" });
          navigate("/");
          return;
        }

        // Normalize DB row into the structure UI expects
        const normalized = {
          id: r.id,
          uid: r.employee_uid || r.uid || uid,
          full_name: r.fullName || r.full_name || r.name || "No name",
          email: r.email || "",
          phone: r.phone || "",
          address: r.address || r.location || "",
          avatar: r.avatar || "",
          verification_status: r.verification_status || (r.verified ? "verified" : "unverified"),
          bio: r.bio || r.description || "",
          location: r.address || r.location || "",
          dateOfBirth: r.dateOfBirth || r.dob || null,
          designation: r.designation || "",
          company: r.company || "",
          skills:
            r.skills && Array.isArray(r.skills)
              ? r.skills
              : r.skills && typeof r.skills === "string"
                ? r.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
                : [],
          experience: r.experience || "",
          // keep original raw data if needed
          _raw: r,
        };

        setProfileData(normalized);
        // keep localStorage in sync so Navbar can read quickly
        try {
          localStorage.setItem("verifypro_user", JSON.stringify(normalized));
        } catch (e) {
          // ignore storage write errors
          console.warn("Could not write verifypro_user to localStorage", e);
        }

        // Documents: try /verify then fallback to /verification — keep existing behavior
        try {
          const docRes = await API.get(`/verify/${encodeURIComponent(normalized.uid)}`);
          setDocuments(Array.isArray(docRes.data) ? docRes.data : docRes.data?.documents || []);
        } catch (_err1) {
          try {
            const docRes2 = await API.get(`/verification/${encodeURIComponent(normalized.uid)}`);
            setDocuments(Array.isArray(docRes2.data) ? docRes2.data : docRes2.data?.documents || []);
          } catch (_err2) {
            setDocuments([]);
          }
        }

        // Work history: try endpoint, fallback to raw property
        try {
          const whRes = await API.get(`/employees/${encodeURIComponent(normalized.uid)}/work-history`);
          setWorkHistory(whRes.data?.work_history || whRes.data || normalized._raw?.work_history || []);
        } catch (err) {
          setWorkHistory(normalized._raw?.work_history || []);
        }
      } catch (err: any) {
        console.error("Profile load error:", err);
        toast({ title: "Failed to load", description: "Server error", variant: "destructive" });
        // don't force navigation here; user might retry
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProfile = async () => {
    try {
      const uid = localStorage.getItem("verifypro_uid");
      if (!uid) return;

      const updatedProfile = {
        full_name: profileData.full_name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        skills: profileData.skills || [],
      };


      await API.patch(`/employees/${encodeURIComponent(uid)}`, updatedProfile);

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err) {
      console.error("Update error:", err);
      toast({
        title: "Update Failed",
        description: "Could not save profile changes.",
        variant: "destructive",
      });
    }
  };

  // Skills management
  const handleAddSkill = (newSkill: string) => {
    const updatedSkills = [...(profileData.skills || []), newSkill];
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = profileData.skills.filter((s: string) => s !== skill);
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  const handleAddWorkHistory = async () => {
    try {
      const uid = localStorage.getItem("verifypro_uid");
      if (!uid) return;

      const newWork = { company: "", position: "", duration: "", description: "" };
      const res = await API.post(`/employees/${encodeURIComponent(uid)}/work-history`, newWork);

      setWorkHistory([...workHistory, res.data]);
    } catch (err) {
      console.error("Add work error:", err);
      toast({ title: "Failed", description: "Could not add work history.", variant: "destructive" });
    }
  };

  const handleRemoveWorkHistory = async (id: number) => {
    try {
      const uid = localStorage.getItem("verifypro_uid");
      if (!uid) return;

      await API.delete(`/employees/${encodeURIComponent(uid)}/work-history/${id}`);
      setWorkHistory(workHistory.filter((work) => work.id !== id));

      toast({ title: "Removed", description: "Work history deleted." });
    } catch (err) {
      console.error("Delete work error:", err);
      toast({ title: "Failed", description: "Could not delete work history.", variant: "destructive" });
    }
  };

  if (!profileData) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <Navbar
        user={{
          name: profileData.full_name,
          uid: profileData.uid,
          avatar: profileData.avatar || "",
          verified: profileData.verification_status === "verified",
          available: profileData.status === "available" || profileData.available === true,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 mx-auto">
                      {profileData.avatar ? (
                        <AvatarImage src={profileData.avatar || ""} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                          {profileData.full_name
                            ? profileData.full_name.split(" ").map((n: any) => n[0]).join("")
                            : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button variant="outline" size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">{profileData.full_name}</h2>
                    <p className="text-muted-foreground">{profileData.uid}</p>
                    {profileData.verification_status === "verified" && (
                      <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.email || "—"}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.phone || "—"}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.location || "—"}</span>
                    </div>
                  </div>

                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                    className="w-full"
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" /> Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" /> Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profileData.skills && profileData.skills.length > 0) ? (
                    profileData.skills.map((s: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-muted/50">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <>
                      <Badge variant="secondary" className="bg-muted/50">React</Badge>
                      <Badge variant="secondary" className="bg-muted/50">Node.js</Badge>
                    </>
                  )}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => {
                    const updated = { ...profileData, skills: [...(profileData.skills || []), ""] };
                    setProfileData(updated);
                  }}>
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profileData.email || ""}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone || ""}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location || ""}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio || ""}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">{profileData.bio || "No bio available."}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" /> Work History
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={handleAddWorkHistory}>
                    <Plus className="h-4 w-4 mr-2" /> Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {workHistory.length === 0 ? (
                  <p className="text-muted-foreground">No work history yet.</p>
                ) : (
                  workHistory.map((work) => (
                    <div key={work.id} className="border-l-2 border-primary/20 pl-4 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{work.position}</h4>
                          <p className="text-primary font-medium">{work.company}</p>
                          <p className="text-sm text-muted-foreground">{work.duration}</p>
                          <p className="text-sm mt-2">{work.description}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveWorkHistory(work.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Documents</h3>
          <div>
            {documents.length === 0 ? (
              <p className="text-muted-foreground">No documents uploaded yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documents.map((doc: any) => (
                  <a key={doc.id} href={doc.file_path} target="_blank" rel="noreferrer" className="block p-4 border rounded">
                    <p className="font-medium">{doc.type}</p>
                    <p className="text-sm text-muted-foreground">{new Date(doc.uploaded_at || doc.created_at).toLocaleString()}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
