import { 
  Pickaxe, 
  FileText, 
  Settings, 
  BarChart3, 
  RefreshCw, 
  BookOpen, 
  Briefcase, 
  Globe 
} from "lucide-react";

export const getBlockIcon = (blockNumber: number) => {
  const iconClass = "h-6 w-6";
  
  switch (blockNumber) {
    case 1:
      return <Pickaxe className={iconClass} />;
    case 2:
      return <FileText className={iconClass} />;
    case 3:
      return <Settings className={iconClass} />;
    case 4:
      return <BarChart3 className={iconClass} />;
    case 5:
      return <RefreshCw className={iconClass} />;
    case 6:
      return <BookOpen className={iconClass} />;
    case 7:
      return <Briefcase className={iconClass} />;
    case 8:
      return <Globe className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
};
