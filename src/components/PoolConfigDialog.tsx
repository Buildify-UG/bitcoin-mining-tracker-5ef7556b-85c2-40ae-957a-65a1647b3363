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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MiningPool } from '@/types/mining';
import { Settings, Trash2, Edit2 } from 'lucide-react';

interface PoolConfigDialogProps {
  pools: MiningPool[];
  onAddPool: (pool: Omit<MiningPool, 'id'>) => void;
  onUpdatePool: (id: string, pool: Partial<MiningPool>) => void;
  onDeletePool: (id: string) => void;
}

export const PoolConfigDialog = ({
  pools,
  onAddPool,
  onUpdatePool,
  onDeletePool,
}: PoolConfigDialogProps) => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<MiningPool, 'id'>>({
    name: '',
    url: '',
    port: 3333,
    username: '',
    password: '',
    fee: 1.0,
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
      url: '',
      port: 3333,
      username: '',
      password: '',
      fee: 1.0,
    });
  };

  const handleEdit = (pool: MiningPool) => {
    setEditingId(pool.id);
    setFormData({
      name: pool.name,
      url: pool.url,
      port: pool.port,
      username: pool.username,
      password: pool.password,
      fee: pool.fee,
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.url || !formData.username) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      onUpdatePool(editingId, formData);
    } else {
      onAddPool(formData);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    onDeletePool(id);
    setDeleteId(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Settings className="w-5 h-5" />
            Pools
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Mining Pool Configuration</DialogTitle>
            <DialogDescription className="text-slate-400">
              Manage your mining pools and connection settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  {editingId ? 'Edit Pool' : 'Add New Pool'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Pool Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Stratum Pool"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Pool URL *</Label>
                    <Input
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="e.g., stratum.mining.com"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Port</Label>
                    <Input
                      type="number"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Fee (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) })}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Username *</Label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Your username"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Password</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Usually x"
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
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
                    {editingId ? 'Update Pool' : 'Add Pool'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Configured Pools</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pools.length === 0 ? (
                  <p className="text-sm text-slate-400">No pools configured yet</p>
                ) : (
                  pools.map((pool) => (
                    <Card key={pool.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-white">{pool.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {pool.fee}% fee
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400">
                              {pool.url}:{pool.port}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">User: {pool.username}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(pool)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteId(pool.id)}
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
            <AlertDialogTitle className="text-white">Delete Pool?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this mining pool?
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
