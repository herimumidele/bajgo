import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Download, 
  Settings, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  FileText,
  Play,
  ChevronRight
} from "lucide-react";

interface APKInstallationGuideProps {
  vendorName: string;
  appName: string;
  onDownloadClick: () => void;
  apkFileSize?: string;
}

export default function APKInstallationGuide({ 
  vendorName, 
  appName, 
  onDownloadClick,
  apkFileSize = "~5MB"
}: APKInstallationGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const installationSteps = [
    {
      title: "Download APK File",
      icon: Download,
      description: "Download the app installation file to your device",
      details: `The APK file (${apkFileSize}) will be downloaded to your Downloads folder.`
    },
    {
      title: "Enable Unknown Sources", 
      icon: Shield,
      description: "Allow installation from unknown sources in your device settings",
      details: "This is required because the app is not from Google Play Store."
    },
    {
      title: "Install Application",
      icon: Smartphone,
      description: "Tap the downloaded file and follow installation prompts",
      details: "Your device will guide you through the final installation steps."
    },
    {
      title: "Launch & Enjoy",
      icon: Play,
      description: "Open your new mobile app and start shopping",
      details: "The app will appear in your app drawer and home screen."
    }
  ];

  const AndroidVersionGuide = () => (
    <Tabs defaultValue="android11+" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="android11+">Android 11+</TabsTrigger>
        <TabsTrigger value="android8-10">Android 8-10</TabsTrigger>
        <TabsTrigger value="android7-">Android 7 & Below</TabsTrigger>
      </TabsList>
      
      <TabsContent value="android11+" className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>For Android 11, 12, 13, 14:</strong> Most secure method
          </AlertDescription>
        </Alert>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">1</span>
            <div>
              <p className="font-medium">Open Settings</p>
              <p className="text-sm text-gray-600">Go to Settings → Apps & notifications → Special app access</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">2</span>
            <div>
              <p className="font-medium">Find Install Unknown Apps</p>
              <p className="text-sm text-gray-600">Look for "Install unknown apps" or "Unknown app sources"</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">3</span>
            <div>
              <p className="font-medium">Select Your Browser/File Manager</p>
              <p className="text-sm text-gray-600">Choose Chrome, Files app, or your download manager</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">4</span>
            <div>
              <p className="font-medium">Enable "Allow from this source"</p>
              <p className="text-sm text-gray-600">Toggle the switch to enable installations</p>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="android8-10" className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>For Android 8, 9, 10:</strong> Standard method
          </AlertDescription>
        </Alert>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">1</span>
            <div>
              <p className="font-medium">Open Settings</p>
              <p className="text-sm text-gray-600">Go to Settings → Security & location</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">2</span>
            <div>
              <p className="font-medium">Find Unknown Sources</p>
              <p className="text-sm text-gray-600">Look for "Unknown sources" under Device administration</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">3</span>
            <div>
              <p className="font-medium">Enable Unknown Sources</p>
              <p className="text-sm text-gray-600">Toggle the switch and confirm the security warning</p>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="android7-" className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>For Android 6, 7:</strong> Classic method
          </AlertDescription>
        </Alert>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">1</span>
            <div>
              <p className="font-medium">Open Settings</p>
              <p className="text-sm text-gray-600">Go to Settings → Security</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">2</span>
            <div>
              <p className="font-medium">Find Unknown Sources</p>
              <p className="text-sm text-gray-600">Look for "Unknown sources" in Device administration</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center justify-center">3</span>
            <div>
              <p className="font-medium">Enable Unknown Sources</p>
              <p className="text-sm text-gray-600">Check the box and accept the security warning</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  const TroubleshootingSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Common Issues & Solutions</h3>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>"App not installed" or "Parse error"</strong>
          <br />
          Solution: Re-download the APK file and ensure it downloaded completely. Check your internet connection.
        </AlertDescription>
      </Alert>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>"Installation blocked" warning</strong>
          <br />
          Solution: This is normal security behavior. Follow the Android version guide above to enable unknown sources.
        </AlertDescription>
      </Alert>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Can't find the APK file after download</strong>
          <br />
          Solution: Check your Downloads folder or notification panel. Use a file manager app to locate the file.
        </AlertDescription>
      </Alert>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>App crashes or won't open</strong>
          <br />
          Solution: Ensure your Android version is 5.0+ (API level 21). Restart your device and try again.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5 text-red-600" />
          <span>Android App Installation</span>
        </CardTitle>
        <CardDescription>
          Download and install the {appName} mobile app on your Android device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Start Section */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Download className="h-5 w-5 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Ready to Install</h3>
              <p className="text-sm text-red-700 mb-3">
                Your app is built and ready for download. File size: {apkFileSize}
              </p>
              <Button 
                onClick={onDownloadClick} 
                className="bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download APK
              </Button>
            </div>
          </div>
        </div>

        {/* Installation Steps */}
        <div>
          <h3 className="font-semibold mb-4">Installation Process</h3>
          <div className="space-y-3">
            {installationSteps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${
                  index <= currentStep ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`flex-shrink-0 p-2 rounded-full ${
                  index <= currentStep ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  <step.icon className={`h-4 w-4 ${
                    index <= currentStep ? 'text-green-700' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{step.details}</p>
                </div>
                {index < installationSteps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Detailed Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-1">
                    <Settings className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Settings Guide</span>
                  </div>
                  <p className="text-sm text-gray-600">Step-by-step Android settings</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Android Security Settings Guide</DialogTitle>
                <DialogDescription>
                  Enable app installation from unknown sources on your Android device
                </DialogDescription>
              </DialogHeader>
              <AndroidVersionGuide />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Troubleshooting</span>
                  </div>
                  <p className="text-sm text-gray-600">Common issues & solutions</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Installation Troubleshooting</DialogTitle>
                <DialogDescription>
                  Solutions for common APK installation problems
                </DialogDescription>
              </DialogHeader>
              <TroubleshootingSection />
            </DialogContent>
          </Dialog>
        </div>

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> This app is authentic and safe to install. 
            The security warning appears because it's not distributed through Google Play Store. 
            Remember to disable "Unknown Sources" after installation for security.
          </AlertDescription>
        </Alert>

        {/* Progress Tracker */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Installation Progress:</span>
          <div className="flex space-x-2">
            {installationSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous Step
          </Button>
          <Button
            variant="outline" 
            size="sm"
            onClick={() => setCurrentStep(Math.min(installationSteps.length - 1, currentStep + 1))}
            disabled={currentStep === installationSteps.length - 1}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}