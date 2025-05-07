
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { api } from '@/services/api';
import { UserIcon } from 'lucide-react';
import { toast } from "sonner";

interface ProfileForm {
  name: string;
  email: string;
  department?: string;
}

const Profile = () => {
  // Fetch current user
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: api.getCurrentUser
  });
  
  const { register, handleSubmit, formState: { isDirty, isSubmitting } } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || ''
    },
    values: {
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || ''
    }
  });
  
  const onSubmit = async (data: ProfileForm) => {
    // This would normally update the user profile
    // Since we're using mock data, we'll just show a success message
    toast.success("Profile updated successfully");
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading profile...</div>;
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          View and update your account information
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your profile details
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" {...register('department')} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Account Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon size={40} className="text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium">{user?.id}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">May 2023</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Total Bookings</p>
                  <p className="font-medium">12</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Favorite Room</p>
                  <p className="font-medium">Executive Suite</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">On</Button>
                  <Button variant="ghost" size="sm">Off</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="calendarSync">Calendar Sync</Label>
                <div className="space-x-2">
                  <Button variant="ghost" size="sm">On</Button>
                  <Button variant="outline" size="sm">Off</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
