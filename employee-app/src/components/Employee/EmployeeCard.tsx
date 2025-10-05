import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Briefcase, 
  Shield, 
  Clock, 
  Eye,
  MessageCircle,
  Mail,   // ✨ new icon for email
  Calendar // ✨ new icon for DOB
} from "lucide-react";

interface EmployeeCardProps {
  employee: {
    id: string;
    uid: string;
    name: string;
    avatar?: string;
    designation: string;
    company: string;
    location: string;
    skills: string[];
    verified: boolean;
    experience: string;
    status: 'available' | 'employed' | 'seeking';
    email?: string;       // ✨ added
    dateOfBirth?: string; // ✨ added
  };
  onViewProfile?: (id: string) => void;
  onContact?: (id: string) => void;
}

const EmployeeCard = ({ employee, onViewProfile, onContact }: EmployeeCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success/10 text-success border-success/20';
      case 'employed': return 'bg-primary/10 text-primary border-primary/20';
      case 'seeking': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'employed': return 'Employed';
      case 'seeking': return 'Job Seeking';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {employee.verified && (
                <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-1">
                  <Shield className="h-3 w-3 text-success-foreground" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-card-foreground">{employee.name}</h3>
                {employee.verified && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                    Verified ✓
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{employee.uid}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(employee.status)} text-xs`}
          >
            {getStatusText(employee.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Designation + Company */}
        <div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
            <Briefcase className="h-4 w-4" />
            <span>{employee.designation}</span>
          </div>
          <p className="text-sm font-medium text-card-foreground">{employee.company}</p>
        </div>

        {/* ✨ Email */}
        {employee.email && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{employee.email}</span>
          </div>
        )}

        {/* ✨ DOB */}
        {employee.dateOfBirth && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{employee.dateOfBirth.split("T")[0]}</span>
          </div>
        )}

        {/* Address */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{employee.location}</span>
        </div>

        {/* Experience */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{employee.experience} experience</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {employee.skills.slice(0, 3).map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-muted/50 text-muted-foreground"
            >
              {skill}
            </Badge>
          ))}
          {employee.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
              +{employee.skills.length - 3} more
            </Badge>
          )}
        </div>

        {/* Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewProfile?.(employee.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onContact?.(employee.id)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
