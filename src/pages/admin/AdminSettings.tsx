
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [autoApprove, setAutoApprove] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  
  const handleSettingChange = (setting: string, value: boolean) => {
    // In a real app, this would call an API to save settings
    toast.success(`${setting} ${value ? 'enabled' : 'disabled'}`);
    
    switch(setting) {
      case 'auto-approve':
        setAutoApprove(value);
        break;
      case 'email-notifications':
        setEmailNotifications(value);
        break;
      case 'maintenance-mode':
        setMaintenanceMode(value);
        break;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure your meeting room management system
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Manage system-wide settings for the reservation application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="auto-approve">Auto-approve reservations</Label>
              <p className="text-xs text-muted-foreground">
                Automatically approve all new reservation requests without review
              </p>
            </div>
            <Switch
              id="auto-approve"
              checked={autoApprove}
              onCheckedChange={(checked) => handleSettingChange('auto-approve', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email notifications</Label>
              <p className="text-xs text-muted-foreground">
                Send email notifications for reservation updates
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('email-notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance-mode" className="text-red-500 font-medium">Maintenance mode</Label>
              <p className="text-xs text-muted-foreground">
                Temporarily disable the application for maintenance
              </p>
            </div>
            <Switch
              id="maintenance-mode"
              checked={maintenanceMode}
              onCheckedChange={(checked) => handleSettingChange('maintenance-mode', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
