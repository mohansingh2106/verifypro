// src/pages/verification.tsx
import { useState, useEffect } from "react";
import Navbar from "@/components/Layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Shield, CheckCircle, Clock, XCircle, Camera, FileImage, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/api";

const Verification = () => {
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'pending' | 'verified' | 'rejected'>('none');
  const [uploadedFiles, setUploadedFiles] = useState({ selfie: null as File | null, cnicFront: null as File | null, cnicBack: null as File | null });
  const { toast } = useToast();
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const local = localStorage.getItem("verifypro_uid");
    setUid(local);
    if (local) fetchStatus(local);
  }, []);

  const fetchStatus = async (uid: string) => {
    try {
      const res = await API.get(`/employee/${encodeURIComponent(uid)}`);
      if (res.data && res.data.employee) {
        setVerificationStatus(res.data.employee.verification_status || 'none');
      }
    } catch (err) {
      console.error("Fetch status error:", err);
    }
  };

  const handleFileUpload = async (type: 'selfie' | 'cnicFront' | 'cnicBack', file: File) => {
    if (!uid) { toast({ title: "No UID", description: "Please login/register first.", variant: "destructive" }); return; }
    setUploadedFiles(prev => ({ ...prev, [type]: file }));
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await API.post(`/upload/${encodeURIComponent(uid)}/${type}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data && res.data.success) {
        toast({ title: "File Uploaded", description: `${type} uploaded successfully.` });
        // refresh status/docs
        fetchStatus(uid);
      } else {
        toast({ title: "Upload failed", description: res.data?.error || "Unknown error", variant: "destructive" });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({ title: "Upload failed", description: err?.response?.data?.error || "Server error", variant: "destructive" });
    }
  };

  const handleSubmitVerification = async () => {
    if (!uid) { toast({ title: "No UID", description: "Please login/register first.", variant: "destructive" }); return; }
    try {
      const res = await API.post("/verification/submit", { uid });
      if (res.data && res.data.success) {
        setVerificationStatus('pending');
        toast({ title: "Verification Submitted", description: "Your documents have been submitted for manual review." });
      } else {
        toast({ title: "Submit failed", description: res.data?.error || "Unknown error", variant: "destructive" });
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      toast({ title: "Submit failed", description: err?.response?.data?.error || "Server error", variant: "destructive" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending': return <Clock className="h-5 w-5 text-warning" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-destructive" />;
      default: return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified ✓';
      case 'pending': return 'Under Review';
      case 'rejected': return 'Rejected';
      default: return 'Not Submitted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <Navbar user={{ name: "User", uid: uid || "", avatar: "", verified: verificationStatus === "verified" }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full"><Shield className="h-6 w-6 text-primary" /></div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Identity Verification</h1>
              <p className="text-muted-foreground">Verify your identity to get the trusted badge and full platform access</p>
            </div>
          </div>

          <Badge variant="outline" className="text-sm">
            {getStatusIcon(verificationStatus)} <span className="ml-2">{getStatusText(verificationStatus)}</span>
          </Badge>
        </div>

        <Card className="mb-8 bg-card/80 border-border/50">
          <CardHeader><CardTitle className="flex items-center gap-2"><FileImage className="h-5 w-5" /> Required Documents</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/** Selfie */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3"><Camera className="h-5 w-5 text-primary" /><h3 className="font-semibold">Selfie Photo</h3></div>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input id="selfie-upload" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload('selfie', f); }} className="hidden" />
                  <label htmlFor="selfie-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Upload Selfie</p>
                  </label>
                </div>
              </div>

              {/** CNIC Front */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3"><FileImage className="h-5 w-5 text-primary" /><h3 className="font-semibold">CNIC Front</h3></div>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input id="cnic-front-upload" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload('cnicFront', f); }} className="hidden" />
                  <label htmlFor="cnic-front-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Upload CNIC Front</p>
                  </label>
                </div>
              </div>

              {/** CNIC Back */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3"><FileImage className="h-5 w-5 text-primary" /><h3 className="font-semibold">CNIC Back</h3></div>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input id="cnic-back-upload" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload('cnicBack', f); }} className="hidden" />
                  <label htmlFor="cnic-back-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Upload CNIC Back</p>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <Button onClick={handleSubmitVerification} className="w-full bg-primary hover:bg-primary-hover" disabled={verificationStatus === 'pending' || verificationStatus === 'verified'}>
                <Shield className="h-4 w-4 mr-2" />
                {verificationStatus === 'pending' ? 'Verification Submitted' : verificationStatus === 'verified' ? 'Already Verified' : 'Submit for Verification'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Verification;
