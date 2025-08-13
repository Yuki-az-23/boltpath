import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Plus, Edit, Trash2, Calendar, Users, AlertCircle, Search, Target, Brain } from 'lucide-react';
import { useAuth, useAppState, PBLAssignment, StudentProgress } from '../App';
import { toast } from 'sonner';

export function AssignmentManagement() {
  const { teacher } = useAuth();
  const { students, assignments, studentProgress, addAssignment, updateAssignment, deleteAssignment } = useAppState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<PBLAssignment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'completed' | 'archived'>('all');
  const [activeTab, setActiveTab] = useState('basic');
  const [showProgressTracking, setShowProgressTracking] = useState(false);

  // Initial form state
  const initialFormData = {
    title: '',
    problemStatement: '',
    realWorldContext: '',
    learningObjectives: [''],
    assessmentCriteria: [{ criterion: '', weight: 25, rubric: '' }],
    resources: [''],
    timeline: [{ phase: '', duration: '', activities: [''] }],
    dueDate: '',
    studentIds: [] as string[],
    collaborationType: 'small-groups' as PBLAssignment['collaborationType'],
    skillsFocus: ['']
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter data for current teacher
  const teacherStudents = students.filter(student => student.teacherId === teacher?.id);
  const teacherAssignments = assignments
    .filter(assignment => assignment.teacherId === teacher?.id)
    .filter(assignment => 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.problemStatement.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(assignment => statusFilter === 'all' || assignment.status === statusFilter);

  const commonSkills = [
    'Critical thinking', 'Problem-solving', 'Research skills', 'Communication',
    'Collaboration', 'Creativity', 'Data analysis', 'Scientific method',
    'Mathematical reasoning', 'Technology literacy', 'Project management',
    'Presentation skills', 'Time management', 'Leadership', 'Environmental awareness'
  ];

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingAssignment(null);
    setActiveTab('basic');
  };

  const openDialog = (assignment?: PBLAssignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        title: assignment.title,
        problemStatement: assignment.problemStatement,
        realWorldContext: assignment.realWorldContext,
        learningObjectives: assignment.learningObjectives,
        assessmentCriteria: assignment.assessmentCriteria,
        resources: assignment.resources,
        timeline: assignment.timeline,
        dueDate: assignment.dueDate,
        studentIds: assignment.studentIds,
        collaborationType: assignment.collaborationType,
        skillsFocus: assignment.skillsFocus
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement = 'Problem statement is required';
    }

    if (!formData.realWorldContext.trim()) {
      newErrors.realWorldContext = 'Real-world context is required';
    }

    if (formData.learningObjectives.filter(obj => obj.trim()).length === 0) {
      newErrors.learningObjectives = 'At least one learning objective is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.studentIds.length === 0) {
      newErrors.students = 'At least one student must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please complete all required fields');
      return;
    }

    const assignmentData = {
      ...formData,
      teacherId: teacher?.id || '',
      status: 'draft' as const,
      learningObjectives: formData.learningObjectives.filter(obj => obj.trim()),
      resources: formData.resources.filter(res => res.trim()),
      skillsFocus: formData.skillsFocus.filter(skill => skill.trim())
    };

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, assignmentData);
      toast.success('PBL Assignment updated successfully');
    } else {
      addAssignment(assignmentData);
      toast.success('PBL Assignment created successfully');
    }

    closeDialog();
  };

  const handleDelete = (assignment: PBLAssignment) => {
    if (window.confirm(`Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`)) {
      deleteAssignment(assignment.id);
      toast.success('Assignment deleted');
    }
  };

  const handleStatusChange = (assignmentId: string, newStatus: PBLAssignment['status']) => {
    updateAssignment(assignmentId, { status: newStatus });
    toast.success(`Assignment status updated to ${newStatus}`);
  };

  const handleStudentToggle = (studentId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      studentIds: checked 
        ? [...prev.studentIds, studentId]
        : prev.studentIds.filter(id => id !== studentId)
    }));
  };

  const addArrayItem = (field: keyof typeof formData, item: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), item]
    }));
  };

  const updateArrayItem = (field: keyof typeof formData, index: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  const getStatusBadgeVariant = (status: PBLAssignment['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'active': return 'secondary';
      case 'draft': return 'outline';
      case 'archived': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: PBLAssignment['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStudentProgress = (studentId: string, assignmentId: string) => {
    return studentProgress.find(p => p.studentId === studentId && p.assignmentId === assignmentId);
  };

  const calculateProgressPercentage = (progress: StudentProgress, assignment: PBLAssignment) => {
    if (!progress) return 0;
    const totalPhases = assignment.timeline.length;
    return totalPhases > 0 ? Math.round((progress.currentPhase / totalPhases) * 100) : 0;
  };

  // Get tomorrow's date as minimum due date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Problem-Based Learning Assignments</h2>
          <p className="text-muted-foreground">
            Create and manage real-world problems that engage students in meaningful learning
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setShowProgressTracking(!showProgressTracking)}
            className="hidden sm:flex"
          >
            <Target className="h-4 w-4 mr-2" />
            {showProgressTracking ? 'Hide Progress' : 'Track Progress'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()} aria-label="Create new PBL assignment">
                <Plus className="h-4 w-4 mr-2" />
                Create PBL Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto" aria-labelledby="dialog-title">
              <DialogHeader>
                <DialogTitle id="dialog-title">
                  {editingAssignment ? 'Edit PBL Assignment' : 'Create New PBL Assignment'}
                </DialogTitle>
                <DialogDescription>
                  Design a problem-based learning experience that connects to real-world challenges and supports diverse learners.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Problem</TabsTrigger>
                  <TabsTrigger value="objectives">Objectives</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignment-title" className="required">Assignment Title</Label>
                      <Input
                        id="assignment-title"
                        placeholder="Enter a compelling assignment title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={errors.title ? 'border-destructive' : ''}
                        required
                      />
                      {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="problem-statement" className="required">Problem Statement</Label>
                      <Textarea
                        id="problem-statement"
                        placeholder="Present a compelling, open-ended problem that requires investigation and solution development..."
                        value={formData.problemStatement}
                        onChange={(e) => setFormData(prev => ({ ...prev, problemStatement: e.target.value }))}
                        className={`min-h-[100px] ${errors.problemStatement ? 'border-destructive' : ''}`}
                        required
                      />
                      {errors.problemStatement && <p className="text-sm text-destructive">{errors.problemStatement}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="real-world-context" className="required">Real-World Context</Label>
                      <Textarea
                        id="real-world-context"
                        placeholder="Explain how this problem relates to real-world situations and why it matters..."
                        value={formData.realWorldContext}
                        onChange={(e) => setFormData(prev => ({ ...prev, realWorldContext: e.target.value }))}
                        className={`min-h-[80px] ${errors.realWorldContext ? 'border-destructive' : ''}`}
                        required
                      />
                      {errors.realWorldContext && <p className="text-sm text-destructive">{errors.realWorldContext}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="collaboration-type">Collaboration Type</Label>
                        <Select 
                          value={formData.collaborationType} 
                          onValueChange={(value: PBLAssignment['collaborationType']) => 
                            setFormData(prev => ({ ...prev, collaborationType: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual Work</SelectItem>
                            <SelectItem value="pairs">Pairs</SelectItem>
                            <SelectItem value="small-groups">Small Groups (3-5)</SelectItem>
                            <SelectItem value="whole-class">Whole Class</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="due-date" className="required">Due Date</Label>
                        <Input
                          id="due-date"
                          type="date"
                          min={minDate}
                          value={formData.dueDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                          className={errors.dueDate ? 'border-destructive' : ''}
                          required
                        />
                        {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="objectives" className="space-y-6">
                    {/* Learning Objectives */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Learning Objectives</Label>
                      {formData.learningObjectives.map((objective, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder="Enter a specific, measurable learning objective"
                            value={objective}
                            onChange={(e) => updateArrayItem('learningObjectives', index, e.target.value)}
                            className="flex-1"
                          />
                          {formData.learningObjectives.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem('learningObjectives', index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('learningObjectives', '')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Objective
                      </Button>
                      {errors.learningObjectives && <p className="text-sm text-destructive">{errors.learningObjectives}</p>}
                    </div>

                    {/* Assessment Criteria */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Assessment Criteria</Label>
                      {formData.assessmentCriteria.map((criterion, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                              <Label htmlFor={`criterion-${index}`}>Criterion</Label>
                              <Input
                                id={`criterion-${index}`}
                                placeholder="e.g., Research Quality"
                                value={criterion.criterion}
                                onChange={(e) => updateArrayItem('assessmentCriteria', index, { ...criterion, criterion: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`weight-${index}`}>Weight (%)</Label>
                              <Input
                                id={`weight-${index}`}
                                type="number"
                                min="0"
                                max="100"
                                value={criterion.weight}
                                onChange={(e) => updateArrayItem('assessmentCriteria', index, { ...criterion, weight: Number(e.target.value) })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`rubric-${index}`}>Rubric Description</Label>
                            <Textarea
                              id={`rubric-${index}`}
                              placeholder="Describe what constitutes excellent, good, and needs improvement for this criterion"
                              value={criterion.rubric}
                              onChange={(e) => updateArrayItem('assessmentCriteria', index, { ...criterion, rubric: e.target.value })}
                              rows={2}
                            />
                          </div>
                          {formData.assessmentCriteria.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem('assessmentCriteria', index)}
                            >
                              Remove Criterion
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('assessmentCriteria', { criterion: '', weight: 25, rubric: '' })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Criterion
                      </Button>
                    </div>

                    {/* Skills Focus */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Key Skills Focus</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {commonSkills.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={`skill-${skill}`}
                              checked={formData.skillsFocus.includes(skill)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({ ...prev, skillsFocus: [...prev.skillsFocus, skill] }));
                                } else {
                                  setFormData(prev => ({ ...prev, skillsFocus: prev.skillsFocus.filter(s => s !== skill) }));
                                }
                              }}
                            />
                            <Label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer">
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Resources & Materials</Label>
                      {formData.resources.map((resource, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder="Enter resource name, website, or material"
                            value={resource}
                            onChange={(e) => updateArrayItem('resources', index, e.target.value)}
                            className="flex-1"
                          />
                          {formData.resources.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem('resources', index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('resources', '')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Project Timeline & Phases</Label>
                      {formData.timeline.map((phase, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`phase-name-${index}`}>Phase Name</Label>
                              <Input
                                id={`phase-name-${index}`}
                                placeholder="e.g., Research & Investigation"
                                value={phase.phase}
                                onChange={(e) => updateArrayItem('timeline', index, { ...phase, phase: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`phase-duration-${index}`}>Duration</Label>
                              <Input
                                id={`phase-duration-${index}`}
                                placeholder="e.g., 2 weeks"
                                value={phase.duration}
                                onChange={(e) => updateArrayItem('timeline', index, { ...phase, duration: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Phase Activities</Label>
                            {phase.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="flex space-x-2 mt-2">
                                <Input
                                  placeholder="Enter activity description"
                                  value={activity}
                                  onChange={(e) => {
                                    const newActivities = [...phase.activities];
                                    newActivities[actIndex] = e.target.value;
                                    updateArrayItem('timeline', index, { ...phase, activities: newActivities });
                                  }}
                                  className="flex-1"
                                />
                                {phase.activities.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newActivities = phase.activities.filter((_, i) => i !== actIndex);
                                      updateArrayItem('timeline', index, { ...phase, activities: newActivities });
                                    }}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                const newActivities = [...phase.activities, ''];
                                updateArrayItem('timeline', index, { ...phase, activities: newActivities });
                              }}
                            >
                              Add Activity
                            </Button>
                          </div>
                          {formData.timeline.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem('timeline', index)}
                            >
                              Remove Phase
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('timeline', { phase: '', duration: '', activities: [''] })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Phase
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="students" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="required">Assign to Students</Label>
                      {teacherStudents.length === 0 ? (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No students available. Please add students first before creating assignments.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="border rounded-md p-3 bg-input-background max-h-64 overflow-y-auto">
                          <div className="space-y-3">
                            {teacherStudents.map((student) => (
                              <div key={student.id} className="flex items-start space-x-3 p-2 rounded border">
                                <Checkbox
                                  id={`student-${student.id}`}
                                  checked={formData.studentIds.includes(student.id)}
                                  onCheckedChange={(checked) => 
                                    handleStudentToggle(student.id, checked as boolean)
                                  }
                                />
                                <div className="flex-1">
                                  <Label htmlFor={`student-${student.id}`} className="cursor-pointer font-medium">
                                    {student.fullName}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">{student.grade}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {student.learningProfile.learningStyle.replace('-', ' ')}
                                    </Badge>
                                    {student.learningProfile.accommodations.slice(0, 2).map((acc) => (
                                      <Badge key={acc} variant="secondary" className="text-xs">
                                        {acc}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.students && (
                        <p className="text-sm text-destructive" role="alert">
                          {errors.students}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={closeDialog}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={teacherStudents.length === 0}>
                      {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                    </Button>
                  </div>
                </form>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input-background"
            aria-label="Search assignments"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary">
          {teacherAssignments.length} assignment{teacherAssignments.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Assignments List */}
      {teacherAssignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {searchTerm || statusFilter !== 'all' ? (
              <>
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No assignments found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <div className="space-x-2">
                  <Button onClick={() => setSearchTerm('')} variant="outline">
                    Clear Search
                  </Button>
                  <Button onClick={() => setStatusFilter('all')} variant="outline">
                    Show All
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No PBL assignments yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first problem-based learning assignment to engage students in real-world challenges.
                </p>
                {teacherStudents.length > 0 ? (
                  <Button onClick={() => openDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First PBL Assignment
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add students first before creating assignments.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {teacherAssignments.map((assignment) => {
            const assignedStudents = teacherStudents.filter(student => 
              assignment.studentIds.includes(student.id)
            );
            const dueDate = new Date(assignment.dueDate);
            const isOverdue = dueDate < new Date() && assignment.status !== 'completed';

            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{assignment.title}</CardTitle>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                        <Badge 
                          variant={getStatusBadgeVariant(assignment.status)}
                          className={getStatusColor(assignment.status)}
                        >
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">Problem Statement:</p>
                        <p className="text-sm text-blue-800 line-clamp-2">{assignment.problemStatement}</p>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {dueDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {assignedStudents.length} student{assignedStudents.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          {assignment.learningObjectives.length} objective{assignment.learningObjectives.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Select
                        value={assignment.status}
                        onValueChange={(value: PBLAssignment['status']) => 
                          handleStatusChange(assignment.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(assignment)}
                        aria-label={`Edit ${assignment.title}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(assignment)}
                        className="text-destructive hover:text-destructive"
                        aria-label={`Delete ${assignment.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  {/* Skills Focus */}
                  {assignment.skillsFocus.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Key Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {assignment.skillsFocus.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Student Progress (if tracking enabled) */}
                  {showProgressTracking && assignedStudents.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-3">Student Progress:</p>
                      <div className="space-y-2">
                        {assignedStudents.map((student) => {
                          const progress = getStudentProgress(student.id, assignment.id);
                          const progressPercentage = progress ? calculateProgressPercentage(progress, assignment) : 0;
                          
                          return (
                            <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium">{student.fullName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {student.learningProfile.learningStyle.replace('-', ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-24">
                                  <Progress value={progressPercentage} className="h-2" />
                                </div>
                                <span className="text-xs text-muted-foreground min-w-[2rem]">
                                  {progressPercentage}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Assigned Students */}
                  {assignedStudents.length > 0 && !showProgressTracking && (
                    <div>
                      <p className="text-sm font-medium mb-2">Assigned to:</p>
                      <div className="flex flex-wrap gap-1">
                        {assignedStudents.map((student) => (
                          <Badge key={student.id} variant="outline" className="text-xs">
                            {student.fullName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* PBL Information */}
      <Alert className="bg-blue-50 border-blue-200">
        <Brain className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Problem-Based Learning Focus:</strong> These assignments are designed to engage students in real-world problems 
          that require critical thinking, collaboration, and application of knowledge. Each assignment tracks individual student 
          capabilities and provides accommodations for diverse learners.
        </AlertDescription>
      </Alert>
    </div>
  );
}