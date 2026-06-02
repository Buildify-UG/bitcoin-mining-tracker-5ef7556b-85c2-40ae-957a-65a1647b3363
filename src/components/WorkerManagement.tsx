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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Worker, MiningAlgorithm, MiningPool } from '@/types/mining';
import { Cpu, Trash2, Edit2, Plus } from 'lucide-react';

interface WorkerManagementProps {
  workers: Worker[];
  pools: MiningPool[];
  onAddWorker: (worker: Omit<Worker, 'id' | 'createdAt'>) => void;
  onUpdateWorker: (id: string, worker: Partial<Worker>) => void;
  onDeleteWorker: (id: string) => void;
}

const ALGORITHMS: MiningAlgorithm[] = ['SHA-256', 'Scrypt', 'X11', 'Ethash', 'RandomX'];

export const WorkerManagement = ({
  workers,
  pools,
  onAddWorker,
  onUpdateWorker,
  onDeleteWorker,
}: WorkerManagementProps) => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Worker, 'id' | 'createdAt'>>({
    name: '',
    algorithm: 'SHA-256',
    poolId: pools[0]?.id || '',
    enabled: false,
    intensity: 100,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      algorithm: 'SHA-256',
      poolId: pools[0]?.id || '',
      enabled: false,
      intensity: 100,
    });
  };

  const handleEdit = (worker: Worker) => {
    setEditingId(worker.id);
    setFormData({
      name: worker.name,
      algorithm: worker.algorithm,
      poolId: worker.poolId,
      enabled: worker.enabled,
      intensity: worker.intensity,
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.poolId) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      onUpdateWorker(editingId, formData);
    } else {
      onAddWorker(formData);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    onDeleteWorker(id);
    setDeleteId(null);
  };

  const getPoolName = (poolId: string) => {
    return pools.find((p) => p.id === poolId)?.name || 'Unknown Pool';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Cpu className="w-5 h-5" />
            Workers
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Worker Management</DialogTitle>
            <DialogDescription className="text-slate-400">
              Add and manage your mining workers and rigs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  {editingId ? 'Edit Worker' : 'Add New Worker'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Worker Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., GPU-1"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Algorithm *</Label>
                    <Select value={formData.algorithm} onValueChange={(value) =>
                      setFormData({ ...formData, algorithm: value as MiningAlgorithm })
                    }>
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {ALGORITHMS.map((algo) => (
                          <SelectItem key={algo} value={algo} className="text-white">
                            {algo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Mining Pool *</Label>
                    <Select value={formData.poolId} onValueChange={(value) =>
                      setFormData({ ...formData, poolId: value })
                    }>
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {pools.map((pool) => (
                          <SelectItem key={pool.id} value={pool.id} className="text-white">
                            {pool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Intensity (%)</Label>
                    <Input
                      type="number"
                      min="10"
                      max="100"
                      value={formData.intensity}
                      onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Enabled</Label>
                  <Switch
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    {editingId ? 'Update Worker' : 'Add Worker'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Active Workers</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {workers.length === 0 ? (
                  <p className="text-sm text-slate-400">No workers configured yet</p>
                ) : (
                  workers.map((worker) => (
                    <Card key={worker.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-white">{worker.name}</h4>
                              <Badge variant={worker.enabled ? 'default' : 'secondary'} className="text-xs">
                                {worker.enabled ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {worker.algorithm}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400">
                              Pool: {getPoolName(worker.poolId)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Intensity: {worker.intensity}%
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(worker)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteId(worker.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Worker?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this worker?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel className="border-slate-600 text-slate-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteId && handleDelete(deleteId)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
