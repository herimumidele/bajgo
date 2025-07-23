import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle, HeadphonesIcon, Users } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        description: "First name, last name, email, and message are required.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Get in touch with our team. We're here to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-red-500" />
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Thank you for your message!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We've received your inquiry and will get back to you within 24 hours.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John" 
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe" 
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com" 
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        type="tel" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+60 12-345 6789" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your company name" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help you?" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project, questions, or how we can help..." 
                        rows={5} 
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Support Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HeadphonesIcon className="h-5 w-5 mr-2 text-red-500" />
                  Quick Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => window.open('mailto:support@bajgo.my', '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Email Support</div>
                      <div className="text-sm text-gray-500">support@bajgo.my</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => window.open('tel:+60312345678', '_blank')}
                  >
                    <Phone className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Call Support</div>
                      <div className="text-sm text-gray-500">+60 3-1234 5678</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => window.open('https://wa.me/60123456789', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-sm text-gray-500">+60 12-345 6789</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-red-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">support@bajgo.my</p>
                    <p className="text-gray-600">sales@bajgo.my</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-600">+60 3-1234 5678 (Main)</p>
                    <p className="text-gray-600">+60 12-345 6789 (Mobile)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Office</h4>
                    <p className="text-gray-600">
                      Level 10, Menara ABC<br />
                      Jalan Ampang, 50450<br />
                      Kuala Lumpur, Malaysia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Business Hours</h4>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 1:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">How quickly can I get started?</h4>
                  <p className="text-gray-600 text-sm">You can set up your store in just 5 minutes with our guided setup process.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">What payment methods do you support?</h4>
                  <p className="text-gray-600 text-sm">We support Stripe, Billplz, SenangPay, and Cash on Delivery (COD).</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Do you offer delivery integration?</h4>
                  <p className="text-gray-600 text-sm">Yes! We integrate with Lalamove for instant to scheduled delivery across Malaysia.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Can I use my own domain?</h4>
                  <p className="text-gray-600 text-sm">Absolutely! Premium plans include custom domain support.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}