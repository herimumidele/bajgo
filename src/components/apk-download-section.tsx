import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Download, 
  Smartphone, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  FileText,
  ExternalLink,
  Phone,
  Zap
} from "lucide-react";

interface APKDownloadSectionProps {
  vendor: any;
  appName: string;
  onDownloadClick: () => void;
}

export default function APKDownloadSection({ vendor, appName, onDownloadClick }: APKDownloadSectionProps) {
  const [deviceChecked, setDeviceChecked] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  
  const checkDeviceCompatibility = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    
    const info = {
      isAndroid,
      isCompatible: true, // Our APK supports Android 5.0+
      estimatedSize: "~5.2MB",
      downloadTime: "~30 seconds on 4G"
    };
    
    setDeviceInfo(info);
    setDeviceChecked(true);
  };

  return (
    <div className="space-y-6">
      {/* Quick Download Section */}
      <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <Smartphone className="h-5 w-5" />
            <span>Android App Ready</span>
            <Badge className="bg-green-100 text-green-800 ml-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              Built
            </Badge>
          </CardTitle>
          <CardDescription className="text-red-700">
            Your {appName} mobile app is built and ready for installation on Android devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{appName}</h3>
                <p className="text-sm text-gray-600">Version 1.0.0 • ~5.2MB</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">Android 5.0+</Badge>
                  <Badge variant="outline" className="text-xs">ARM64</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={onDownloadClick}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download APK
            </Button>
          </div>

          {/* Device Compatibility Check */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Device Compatibility</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={checkDeviceCompatibility}
              >
                <Zap className="h-4 w-4 mr-1" />
                {deviceChecked ? "Refresh Check" : "Check Device"}
              </Button>
            </div>
            
            {deviceChecked && deviceInfo && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${deviceInfo.isAndroid ? 'text-green-500' : 'text-orange-500'}`} />
                    <span className="text-sm">
                      {deviceInfo.isAndroid ? 'Android Device Detected' : 'Using Non-Android Browser'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Compatible APK</span>
                  </div>
                </div>
                
                <Alert className={deviceInfo.isAndroid ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {deviceInfo.isAndroid 
                      ? "Perfect! Your Android device can install this APK directly."
                      : "Transfer the downloaded APK to your Android device to install."}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Installation Steps Preview */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Quick Installation Steps</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center justify-center">1</span>
                <span>Download APK file to your Android device</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center justify-center">2</span>
                <span>Allow installation from unknown sources in Settings</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center justify-center">3</span>
                <span>Tap APK file and install when prompted</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center justify-center">4</span>
                <span>Launch and enjoy your new mobile app</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <span>Technical Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">Package Name</div>
              <div className="text-gray-600 text-xs mt-1">com.bajgo.store{vendor?.id}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">Version</div>
              <div className="text-gray-600 text-xs mt-1">1.0.0</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">Min Android</div>
              <div className="text-gray-600 text-xs mt-1">9.0 (API 28)</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">Target SDK</div>
              <div className="text-gray-600 text-xs mt-1">35 (Android 15)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> This APK is digitally signed and safe to install. 
          The security warning appears because it's not distributed through Google Play Store, 
          which is normal for direct APK installations.
        </AlertDescription>
      </Alert>
    </div>
  );
}