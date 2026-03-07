import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import {
  getHostelRules,
  createHostelRule,
  updateHostelRule,
  deleteHostelRule,
  toggleHostelRuleStatus,
} from '@/db/api';
import type { HostelRule, HostelRuleFormData } from '@/types';
import { toast } from 'sonner';

const CATEGORIES = [
  'General Rules',
  'Timing & Access',
  'Visitors & Guests',
  'Safety & Security',
  'Prohibited Items',
  'Room & Property',
  'Noise & Disturbance',
  'Food & Dining',
];

export default function HostelRulesManagement() {
  const [rules, setRules] = useState<HostelRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<HostelRule | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState<HostelRuleFormData>({
    category: '',
    title: '',
    description: '',
    rule_type: 'required',
    priority: 0,
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const data = await getHostelRules();
      setRules(data);
    } catch (error) {
      console.error('Failed to load rules:', error);
      toast.error('Failed to load hostel rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRule) {
        await updateHostelRule(editingRule.id, formData);
        toast.success('Rule updated successfully');
      } else {
        await createHostelRule(formData);
        toast.success('Rule created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      loadRules();
    } catch (error) {
      console.error('Failed to save rule:', error);
      toast.error('Failed to save rule');
    }
  };

  const handleEdit = (rule: HostelRule) => {
    setEditingRule(rule);
    setFormData({
      category: rule.category,
      title: rule.title,
      description: rule.description,
      rule_type: rule.rule_type,
      priority: rule.priority,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      await deleteHostelRule(id);
      toast.success('Rule deleted successfully');
      loadRules();
    } catch (error) {
      console.error('Failed to delete rule:', error);
      toast.error('Failed to delete rule');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleHostelRuleStatus(id, !currentStatus);
      toast.success(`Rule ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadRules();
    } catch (error) {
      console.error('Failed to toggle rule status:', error);
      toast.error('Failed to update rule status');
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      title: '',
      description: '',
      rule_type: 'required',
      priority: 0,
    });
    setEditingRule(null);
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'required':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'prohibited':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'info':
        return <AlertTriangle className="h-4 w-4 text-chart-3" />;
      default:
        return null;
    }
  };

  const filteredRules = selectedCategory === 'all'
    ? rules
    : rules.filter((rule) => rule.category === selectedCategory);

  const rulesByCategory = CATEGORIES.map((category) => ({
    category,
    count: rules.filter((r) => r.category === category).length,
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hostel Rules Management</h1>
            <p className="text-muted-foreground">Manage hostel rules and regulations</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Rule
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rules.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {rules.filter((r) => r.is_active).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{CATEGORIES.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Inactive Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {rules.filter((r) => !r.is_active).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All ({rules.length})
              </Button>
              {rulesByCategory.map(({ category, count }) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory === 'all' ? 'All Rules' : selectedCategory}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : filteredRules.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No rules found in this category
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.priority}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rule.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {rule.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRuleTypeIcon(rule.rule_type)}
                          <span className="capitalize">{rule.rule_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rule.is_active ? (
                          <Badge variant="secondary">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(rule.id, rule.is_active)}
                          >
                            {rule.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(rule)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
              <DialogDescription>
                {editingRule ? 'Update the rule details' : 'Create a new hostel rule'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule_type">Rule Type</Label>
                  <Select
                    value={formData.rule_type}
                    onValueChange={(value: any) => setFormData({ ...formData, rule_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required">Required</SelectItem>
                      <SelectItem value="prohibited">Prohibited</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., ID Card Requirement"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the rule"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority (Order)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first within the category
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingRule ? 'Update Rule' : 'Create Rule'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
