import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Phone, 
  Send, 
  Settings, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Copy,
  QrCode,
  Smartphone,
  MessageSquare,
  Bell,
  Download
} from "lucide-react";

interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'document';
  orderId?: string;
  customerName?: string;
  vendorName?: string;
}

interface WhatsAppConfig {
  isEnabled: boolean;
  businessPhoneNumber: string;
  businessName: string;
  welcomeMessage: string;
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
  orderNotificationsEnabled: boolean;
  supportTicketEnabled: boolean;
  businessHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
}

interface WhatsAppIntegrationProps {
  userRole: string;
  vendorId?: number;
}

export default function WhatsAppIntegration({ userRole, vendorId }: WhatsAppIntegrationProps) {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [config, setConfig] = useState<WhatsAppConfig>({
    isEnabled: false,
    businessPhoneNumber: "",
    businessName: "",
    welcomeMessage: "Welcome to BajGo! How can we help you today?",
    autoReplyEnabled: false,
    autoReplyMessage: "Thank you for your message. We'll get back to you soon!",
    orderNotificationsEnabled: true,
    supportTicketEnabled: true,
    businessHours: {
      enabled: false,
      start: "09:00",
      end: "18:00",
      timezone: "UTC+8"
    }
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/whatsapp/messages", vendorId],
    refetchInterval: 5000, // Refresh every 5 seconds
    enabled: !!vendorId
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ["/api/whatsapp/conversations", vendorId],
    refetchInterval: 10000, // Refresh every 10 seconds
    enabled: !!vendorId
  });

  const { data: whatsappConfig } = useQuery({
    queryKey: ["/api/whatsapp/config", vendorId],
    enabled: !!vendorId,
    onSuccess: (data) => {
      if (data) {
        setConfig(data);
      }
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { to: string; message: string; orderId?: string }) => {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...messageData,
          vendorId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/messages", vendorId] });
      toast({
        title: "Message Sent",
        description: "Your WhatsApp message has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Send Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (configData: WhatsAppConfig) => {
      const response = await fetch("/api/whatsapp/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...configData,
          vendorId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update configuration");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/config", vendorId] });
      toast({
        title: "Configuration Updated",
        description: "WhatsApp settings have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    sendMessageMutation.mutate({
      to: selectedConversation,
      message: newMessage,
    });
  };

  const handleUpdateConfig = () => {
    updateConfigMutation.mutate(config);
  };

  const handleSendOrderNotification = (orderId: string, customerPhone: string, message: string) => {
    sendMessageMutation.mutate({
      to: customerPhone,
      message,
      orderId,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Phone number copied to clipboard",
    });
  };

  const getWhatsAppLink = (phoneNumber: string, message?: string) => {
    const encodedMessage = message ? encodeURIComponent(message) : "";
    return `https://wa.me/${phoneNumber.replace(/\+/g, "")}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
  };

  if (messagesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">WhatsApp Integration</h2>
          <p className="text-gray-600">Communicate with customers directly through WhatsApp</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={config.isEnabled ? "default" : "secondary"}>
            {config.isEnabled ? "Active" : "Inactive"}
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>WhatsApp Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enabled">Enable WhatsApp Integration</Label>
                    <p className="text-sm text-gray-600">Allow customers to contact you via WhatsApp</p>
                  </div>
                  <Switch
                    id="enabled"
                    checked={config.isEnabled}
                    onCheckedChange={(checked) => setConfig({ ...config, isEnabled: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone Number</Label>
                  <Input
                    id="businessPhone"
                    value={config.businessPhoneNumber}
                    onChange={(e) => setConfig({ ...config, businessPhoneNumber: e.target.value })}
                    placeholder="+60123456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={config.businessName}
                    onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
                    placeholder="Your Business Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={config.welcomeMessage}
                    onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                    placeholder="Welcome message for new customers"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoReply">Auto-Reply</Label>
                    <p className="text-sm text-gray-600">Automatically respond to new messages</p>
                  </div>
                  <Switch
                    id="autoReply"
                    checked={config.autoReplyEnabled}
                    onCheckedChange={(checked) => setConfig({ ...config, autoReplyEnabled: checked })}
                  />
                </div>

                {config.autoReplyEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="autoReplyMessage">Auto-Reply Message</Label>
                    <Textarea
                      id="autoReplyMessage"
                      value={config.autoReplyMessage}
                      onChange={(e) => setConfig({ ...config, autoReplyMessage: e.target.value })}
                      placeholder="Automatic response message"
                      rows={2}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderNotifications">Order Notifications</Label>
                    <p className="text-sm text-gray-600">Send order updates via WhatsApp</p>
                  </div>
                  <Switch
                    id="orderNotifications"
                    checked={config.orderNotificationsEnabled}
                    onCheckedChange={(checked) => setConfig({ ...config, orderNotificationsEnabled: checked })}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button onClick={handleUpdateConfig} disabled={updateConfigMutation.isPending}>
                    {updateConfigMutation.isPending ? "Saving..." : "Save Configuration"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!config.isEnabled && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              WhatsApp Integration Disabled
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Enable WhatsApp integration in settings to start communicating with customers.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {config.isEnabled && (
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {conversations.map((conversation: any) => (
                      <div
                        key={conversation.phone}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conversation.phone
                            ? 'bg-primary text-white'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedConversation(conversation.phone)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{conversation.customerName || conversation.phone}</p>
                            <p className="text-sm opacity-75">{conversation.lastMessage}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs opacity-75">{conversation.timestamp}</p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="mt-1">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {selectedConversation ? `Chat with ${selectedConversation}` : 'Select a conversation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedConversation ? (
                    <div className="space-y-4">
                      {/* Messages */}
                      <div className="h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                        {messages
                          .filter((msg: WhatsAppMessage) => 
                            msg.from === selectedConversation || msg.to === selectedConversation
                          )
                          .map((message: WhatsAppMessage) => (
                            <div
                              key={message.id}
                              className={`flex ${message.from === config.businessPhoneNumber ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${
                                  message.from === config.businessPhoneNumber
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-900'
                                }`}
                              >
                                <p>{message.message}</p>
                                <div className="flex items-center justify-end space-x-1 mt-1">
                                  <span className="text-xs opacity-75">{message.timestamp}</span>
                                  {message.from === config.businessPhoneNumber && (
                                    <div className="flex items-center">
                                      {message.status === 'sent' && <Clock className="h-3 w-3" />}
                                      {message.status === 'delivered' && <CheckCircle className="h-3 w-3" />}
                                      {message.status === 'read' && <CheckCircle className="h-3 w-3 text-blue-300" />}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Message Input */}
                      <div className="flex items-center space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Select a conversation to start chatting</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quick-actions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Send Quick Message</CardTitle>
                  <CardDescription>Send a message to a specific customer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Customer Phone</Label>
                    <Input
                      id="customerPhone"
                      placeholder="+60123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quickMessage">Message</Label>
                    <Textarea
                      id="quickMessage"
                      placeholder="Type your message..."
                      rows={3}
                    />
                  </div>
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Links</CardTitle>
                  <CardDescription>Generate WhatsApp links for easy sharing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business WhatsApp Link</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={getWhatsAppLink(config.businessPhoneNumber, config.welcomeMessage)}
                        readOnly
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(getWhatsAppLink(config.businessPhoneNumber, config.welcomeMessage))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>QR Code</Label>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowQRCode(true)}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={config.businessPhoneNumber}
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(config.businessPhoneNumber)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Templates</CardTitle>
                  <CardDescription>Pre-made templates for order notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Order Confirmed</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        "Hi [Customer Name], your order #[Order ID] has been confirmed! 
                        Expected delivery: [Delivery Time]. Track your order: [Link]"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Order Preparing</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        "Good news! Your order #[Order ID] is now being prepared. 
                        We'll notify you when it's ready for delivery."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Order Out for Delivery</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        "Your order #[Order ID] is now out for delivery! 
                        Driver: [Driver Name], Phone: [Driver Phone]"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Templates</CardTitle>
                  <CardDescription>Common support responses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Thank You</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        "Thank you for choosing BajGo! We appreciate your business and hope you enjoyed your order."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Order Issue</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        "We apologize for any inconvenience with your order. Our team is looking into this and will resolve it quickly."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Business Hours</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        "Thank you for your message! Our business hours are 9 AM - 6 PM. We'll respond during our next business day."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Messages Sent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">1,234</p>
                  <p className="text-sm text-gray-600">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">85%</p>
                  <p className="text-sm text-gray-600">Average response rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">5min</p>
                  <p className="text-sm text-gray-600">Average response time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600">42</p>
                  <p className="text-sm text-gray-600">Currently active</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}