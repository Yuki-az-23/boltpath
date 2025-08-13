import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Edit, Trash2, Phone, GraduationCap, AlertCircle, Search, Brain, Eye, Ear, Hand, BookOpen, Users } from 'lucide-react';
import { useAuth, useAppState, Student, LearningProfile } from '../App';
import { toast } from 'sonner';

export function StudentManagement() {
  const { teacher } = useAuth();
  const { students, addStudent, updateStudent, deleteStudent } = useAppState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    fullName: '',
    grade: '',
    phoneNumber: '',
    learningProfile: {
      learningStyle: 'mixed' as LearningProfile['learningStyle'],
      strengths: [] as string[],
      challenges: [] as string[],
      accommodations: [] as string[],
      preferredAssessmentMethods: [] as string[],
      notes: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter students for current teacher and search
  const teacherStudents = students
    .filter(student => student.teacherId === teacher?.id)
    .filter(student => 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const learningStyleOptions = [
    { value: 'visual', label: 'Visual', icon: Eye, description: 'Learns best through images, diagrams, and visual aids' },
    { value: 'auditory', label: 'Auditory', icon: Ear, description: 'Learns best through listening and verbal instruction' },
    { value: 'kinesthetic', label: 'Kinesthetic', icon: Hand, description: 'Learns best through hands-on activities and movement' },
    { value: 'reading-writing', label: 'Reading/Writing', icon: BookOpen, description: 'Learns best through reading and written activities' },
    { value: 'mixed', label: 'Mixed/Multimodal', icon: Brain, description: 'Benefits from multiple learning approaches' }
  ];

  const commonStrengths = [
    'Critical thinking', 'Problem-solving', 'Creativity', 'Collaboration', 'Leadership',
    'Communication', 'Visual processing', 'Mathematical reasoning', 'Scientific inquiry',
    'Artistic expression', 'Technology skills', 'Organization', 'Time management',
    'Research skills', 'Presentation skills', 'Analytical thinking'
  ];

  const commonChallenges = [
    'Reading comprehension', 'Written expression', 'Mathematical calculations', 'Time management',
    'Organization', 'Attention span', 'Social interaction', 'Processing speed',
    'Working memory', 'Sequential processing', 'Fine motor skills', 'Auditory processing',
    'Visual processing', 'Executive functioning', 'Anxiety management'
  ];

  const commonAccommodations = [
    'Extended time', 'Quiet environment', 'Visual aids', 'Graphic organizers',
    'Frequent breaks', 'Simplified instructions', 'Audio support', 'Large print materials',
    'Alternative seating', 'Fidget tools', 'Movement breaks', 'Reduced assignments',
    'Oral testing', 'Calculator use', 'Spell checker', 'Note-taking assistance'
  ];

  const assessmentMethods = [
    'Traditional tests', 'Portfolio assessment', 'Project-based', 'Oral presentation',
    'Practical demonstration', 'Peer assessment', 'Self-reflection', 'Performance tasks',
    'Digital projects', 'Group projects', 'Research papers', 'Creative expression'
  ];

  const resetForm = () => {
    setFormData({
      fullName: '',
      grade: '',
      phoneNumber: '',
      learningProfile: {
        learningStyle: 'mixed',
        strengths: [],
        challenges: [],
        accommodations: [],
        preferredAssessmentMethods: [],
        notes: ''
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    });
    setErrors({});
    setEditingStudent(null);
    setActiveTab('basic');
  };

  const openDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        fullName: student.fullName,
        grade: student.grade,
        phoneNumber: student.phoneNumber,
        learningProfile: student.learningProfile,
        emergencyContact: student.emergencyContact || { name: '', relationship: '', phone: '' }
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters long';
    }

    if (!formData.grade.trim()) {
      newErrors.grade = 'Grade/class is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be in format (XXX) XXX-XXXX';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the form errors');
      return;
    }

    const studentData = {
      ...formData,
      teacherId: teacher?.id || ''
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
      toast.success('Student profile updated successfully');
    } else {
      addStudent(studentData);
      toast.success('Student added successfully');
    }

    closeDialog();
  };

  const handleDelete = (student: Student) => {
    if (window.confirm(`Are you sure you want to delete ${student.fullName}'s profile? This action cannot be undone.`)) {
      deleteStudent(student.id);
      toast.success('Student profile deleted');
    }
  };

  const handlePhoneFormat = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      value = handlePhoneFormat(value);
      setFormData(prev => ({ ...prev, phoneNumber: value }));
    } else if (field.startsWith('emergencyContact.')) {
      const contactField = field.split('.')[1];
      if (contactField === 'phone') {
        value = handlePhoneFormat(value);
      }
      setFormData(prev => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [contactField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLearningProfileChange = (field: keyof LearningProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      learningProfile: { ...prev.learningProfile, [field]: value }
    }));
  };

  const handleArrayToggle = (field: keyof LearningProfile, item: string) => {
    const currentArray = formData.learningProfile[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    handleLearningProfileChange(field, newArray);
  };

  const getLearningStyleIcon = (style: LearningProfile['learningStyle']) => {
    const option = learningStyleOptions.find(opt => opt.value === style);
    return option ? option.icon : Brain;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Student Learning Profiles</h2>
          <p className="text-muted-foreground">
            Manage comprehensive student profiles with learning capabilities and accommodation needs
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} aria-label="Add new student">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" aria-labelledby="dialog-title">
            <DialogHeader>
              <DialogTitle id="dialog-title">
                {editingStudent ? 'Edit Student Profile' : 'Add New Student'}
              </DialogTitle>
              <DialogDescription>
                Create a comprehensive learning profile to support individual student needs.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="learning">Learning Profile</TabsTrigger>
                <TabsTrigger value="contact">Emergency Contact</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-name" className="required">Full Name</Label>
                    <Input
                      id="student-name"
                      type="text"
                      placeholder="Enter student's full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`bg-input-background ${errors.fullName ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive" role="alert">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-grade" className="required">Grade/Class</Label>
                    <Input
                      id="student-grade"
                      type="text"
                      placeholder="e.g., 9th Grade, Class 10A"
                      value={formData.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className={`bg-input-background ${errors.grade ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.grade && (
                      <p className="text-sm text-destructive" role="alert">{errors.grade}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-phone" className="required">Phone Number</Label>
                    <Input
                      id="student-phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`bg-input-background ${errors.phoneNumber ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive" role="alert">{errors.phoneNumber}</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="learning" className="space-y-6">
                  {/* Learning Style */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Primary Learning Style</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {learningStyleOptions.map((style) => {
                        const IconComponent = style.icon;
                        return (
                          <div key={style.value} className="relative">
                            <input
                              type="radio"
                              id={`style-${style.value}`}
                              name="learningStyle"
                              value={style.value}
                              checked={formData.learningProfile.learningStyle === style.value}
                              onChange={(e) => handleLearningProfileChange('learningStyle', e.target.value)}
                              className="sr-only"
                            />
                            <Label
                              htmlFor={`style-${style.value}`}
                              className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                formData.learningProfile.learningStyle === style.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <IconComponent className="h-5 w-5 mt-0.5 text-primary" />
                              <div>
                                <div className="font-medium">{style.label}</div>
                                <div className="text-xs text-muted-foreground">{style.description}</div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Learning Strengths</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {commonStrengths.map((strength) => (
                        <div key={strength} className="flex items-center space-x-2">
                          <Checkbox
                            id={`strength-${strength}`}
                            checked={formData.learningProfile.strengths.includes(strength)}
                            onCheckedChange={() => handleArrayToggle('strengths', strength)}
                          />
                          <Label htmlFor={`strength-${strength}`} className="text-sm cursor-pointer">
                            {strength}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Learning Challenges</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {commonChallenges.map((challenge) => (
                        <div key={challenge} className="flex items-center space-x-2">
                          <Checkbox
                            id={`challenge-${challenge}`}
                            checked={formData.learningProfile.challenges.includes(challenge)}
                            onCheckedChange={() => handleArrayToggle('challenges', challenge)}
                          />
                          <Label htmlFor={`challenge-${challenge}`} className="text-sm cursor-pointer">
                            {challenge}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accommodations */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Required Accommodations</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {commonAccommodations.map((accommodation) => (
                        <div key={accommodation} className="flex items-center space-x-2">
                          <Checkbox
                            id={`accommodation-${accommodation}`}
                            checked={formData.learningProfile.accommodations.includes(accommodation)}
                            onCheckedChange={() => handleArrayToggle('accommodations', accommodation)}
                          />
                          <Label htmlFor={`accommodation-${accommodation}`} className="text-sm cursor-pointer">
                            {accommodation}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assessment Methods */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Preferred Assessment Methods</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {assessmentMethods.map((method) => (
                        <div key={method} className="flex items-center space-x-2">
                          <Checkbox
                            id={`assessment-${method}`}
                            checked={formData.learningProfile.preferredAssessmentMethods.includes(method)}
                            onCheckedChange={() => handleArrayToggle('preferredAssessmentMethods', method)}
                          />
                          <Label htmlFor={`assessment-${method}`} className="text-sm cursor-pointer">
                            {method}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="learning-notes">Additional Learning Notes</Label>
                    <Textarea
                      id="learning-notes"
                      placeholder="Any additional observations, strategies that work well, or specific considerations..."
                      value={formData.learningProfile.notes}
                      onChange={(e) => handleLearningProfileChange('notes', e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-name">Emergency Contact Name</Label>
                    <Input
                      id="emergency-name"
                      type="text"
                      placeholder="Enter emergency contact name"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                      className="bg-input-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-relationship">Relationship</Label>
                    <Input
                      id="emergency-relationship"
                      type="text"
                      placeholder="e.g., Mother, Father, Guardian"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                      className="bg-input-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
                    <Input
                      id="emergency-phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                      className="bg-input-background"
                    />
                  </div>
                </TabsContent>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingStudent ? 'Update Student' : 'Add Student'}
                  </Button>
                </div>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search students by name or grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input-background"
            aria-label="Search students"
          />
        </div>
        <Badge variant="secondary">
          {teacherStudents.length} student{teacherStudents.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Students List */}
      {teacherStudents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {searchTerm ? (
              <>
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No students found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search term or add a new student.
                </p>
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No students yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first student learning profile.
                </p>
                <Button onClick={() => openDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Student
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teacherStudents.map((student) => {
            const LearningStyleIcon = getLearningStyleIcon(student.learningProfile.learningStyle);
            return (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{student.fullName}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {student.grade}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <a 
                            href={`tel:${student.phoneNumber}`}
                            className="hover:text-primary transition-colors"
                          >
                            {student.phoneNumber}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <LearningStyleIcon className="h-4 w-4 mr-1" />
                          <span className="capitalize">{student.learningProfile.learningStyle.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(student)}
                        aria-label={`Edit ${student.fullName}'s profile`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(student)}
                        className="text-destructive hover:text-destructive"
                        aria-label={`Delete ${student.fullName}'s profile`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {/* Learning Strengths */}
                  {student.learningProfile.strengths.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Strengths:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.learningProfile.strengths.slice(0, 3).map((strength) => (
                          <Badge key={strength} variant="secondary" className="text-xs bg-green-100 text-green-800">
                            {strength}
                          </Badge>
                        ))}
                        {student.learningProfile.strengths.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            +{student.learningProfile.strengths.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Accommodations */}
                  {student.learningProfile.accommodations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Accommodations:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.learningProfile.accommodations.slice(0, 3).map((accommodation) => (
                          <Badge key={accommodation} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {accommodation}
                          </Badge>
                        ))}
                        {student.learningProfile.accommodations.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            +{student.learningProfile.accommodations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes Preview */}
                  {student.learningProfile.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">Notes:</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {student.learningProfile.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Privacy Notice */}
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Privacy & Learning Support:</strong> Student learning profiles are designed to support inclusive education. 
          All data is stored securely and should be used solely for educational accommodation and support purposes.
        </AlertDescription>
      </Alert>
    </div>
  );
}