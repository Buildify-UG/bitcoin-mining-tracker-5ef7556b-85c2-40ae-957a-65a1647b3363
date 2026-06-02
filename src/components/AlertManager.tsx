import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertSetting } from '@/types/mining';
import { Bell, AlertTriangle, Zap, Wifi } from 'lucide-react';

interface AlertManagerProps {
  alerts: AlertSetting[];
  onUpdateAlert: (id: string, alert: Partial<AlertSetting>) => void;
}

export const AlertManager = ({ alerts, onUpdateAlert }: AlertManagerProps) => {
  const [open, setOpen] = useState(false);

  const getAlertIcon = (type: AlertSetting['type']) => {
    switch (type) {
      case 'temperature':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'hashrate':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'offline':
        return <Wifi className="w-4 h-4 text-red-400" />;
    }
  };

  const getAlertLabel = (type: AlertSetting['type']) => {
    switch (type) {
      case 'temperature':
        return 'High Temperature';
      case 'hashrate':
        return 'Low Hashrate';
      case 'offline':
        return 'Worker Offline';
    }
  };

  const getThresholdLabel = (type: AlertSetting['type']) => {
    switch (type) {
      case 'temperature':
        return '°C';
      case 'hashrate':
        return 'MH/s';
      case 'offline':
        return 'minutes';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <Bell className="w-5 h-5" />
          Alerts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Alert Settings</DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure notifications for mining events
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{getAlertLabel(alert.type)}</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Threshold: <span className="text-white">{alert.threshold} {getThresholdLabel(alert.type)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Switch
                      checked={alert.enabled}
                      onCheckedChange={(checked) =>
                        onUpdateAlert(alert.id, { enabled: checked })
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={alert.threshold}
                        onChange={(e) =>
                          onUpdateAlert(alert.id, { threshold: parseFloat(e.target.value) })
                        }
                        className="w-24 bg-slate-600 border-slate-500 text-white text-sm"
                      />
                      <span className="text-xs text-slate-400 self-center">
                        {getThresholdLabel(alert.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 mt-4">
          <p className="text-sm text-slate-300">
            <strong>Alert Types:</strong>
          </p>
          <ul className="text-xs text-slate-400 mt-2 space-y-1">
            <li>• <strong>High Temperature:</strong> Notifies when GPU temp exceeds threshold</li>
            <li>• <strong>Low Hashrate:</strong> Notifies when hashrate drops below threshold</li>
            <li>• <strong>Worker Offline:</strong> Notifies when worker disconnects</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
