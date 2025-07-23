import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/navigation";
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<typeof editedUser>) => {
      const res = await apiRequest("PUT", "/api/user/profile", updates);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(editedUser);
  };

  const handleCancel = () => {
    setEditedUser({
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback className="bg-red-500 text-white text-2xl">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.username}
                  </h2>
                  
                  <Badge 
                    variant={user?.role === 'admin' ? 'destructive' : user?.role === 'vendor' ? 'default' : 'secondary'}
                    className="mb-4"
                  >
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                  </Badge>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="text-sm">Account Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={updateProfileMutation.isPending}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        value={editedUser.username}
                        onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{user?.username}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{user?.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedUser.phone}
                        onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                        placeholder="+60 12-345 6789"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{user?.phone || "Not provided"}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <p className="text-gray-900 mt-1 capitalize">{user?.role}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editedUser.address}
                      onChange={(e) => setEditedUser({...editedUser, address: e.target.value})}
                      placeholder="Your address"
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{user?.address || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editedUser.bio}
                      onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{user?.bio || "No bio provided"}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive notifications about your account activity</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Privacy Settings</h3>
                    <p className="text-sm text-gray-600">Control who can see your profile information</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-red-600">Delete Account</h3>
                    <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}