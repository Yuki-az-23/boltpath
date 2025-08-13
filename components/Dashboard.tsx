import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { BookOpen, Users, ClipboardList, LogOut, Plus, TrendingUp } from 'lucide-react';
import { useAuth, useAppState } from '../App';
import { StudentManagement } from './StudentManagement';
import { AssignmentManagement } from './AssignmentManagement';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { teacher, logout } = useAuth();
  const { students, assignments } = useAppState();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    onLogout();
  };

  // Filter data for current teacher
  const teacherStudents = students.filter(student => student.teacherId === teacher?.id);
  const teacherAssignments = assignments.filter(assignment => assignment.teacherId === teacher?.id);

  // Calculate statistics
  const totalStudents = teacherStudents.length;
  const totalAssignments = teacherAssignments.length;
  const draftAssignments = teacherAssignments.filter(a => a.status === 'draft').length;
  const activeAssignments = teacherAssignments.filter(a => a.status === 'active').length;
  const completedAssignments = teacherAssignments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  boltpath
                </h1>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{teacher?.fullName}</p>
                <p className="text-sm text-muted-foreground">ID: {teacher?.idNumber}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                aria-label="Sign out of your account"
              >
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8" aria-label="Dashboard navigation">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center space-x-2">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              <span>Assignments</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Welcome back, {teacher?.fullName}</h2>
                <p className="text-muted-foreground mt-1">
                  Here's an overview of your Problem-Based Learning classroom
                </p>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    Active learning profiles
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">PBL Assignments</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAssignments}</div>
                  <p className="text-xs text-muted-foreground">
                    Problem-based projects
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {activeAssignments}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeAssignments}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently running
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {completedAssignments}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedAssignments}</div>
                  <p className="text-xs text-muted-foreground">
                    Finished projects
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Students</CardTitle>
                  <CardDescription>
                    Your most recently added student learning profiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {teacherStudents.slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {teacherStudents.slice(0, 5).map((student) => (
                        <div key={student.id} className="flex items-center space-x-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{student.fullName}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{student.grade}</span>
                              <span>•</span>
                              <span className="capitalize">{student.learningProfile.learningStyle.replace('-', ' ')}</span>
                            </div>
                          </div>
                          {student.learningProfile.accommodations.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {student.learningProfile.accommodations.length} accommodations
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No students added yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setActiveTab('students')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Student
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent PBL Assignments</CardTitle>
                  <CardDescription>
                    Your latest problem-based learning projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {teacherAssignments.slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {teacherAssignments.slice(0, 5).map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <ClipboardList className="h-4 w-4 text-blue-600" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="font-medium">{assignment.title}</p>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{assignment.collaborationType.replace('-', ' ')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge 
                              variant={assignment.status === 'completed' ? 'default' : 'secondary'}
                              className={
                                assignment.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : assignment.status === 'active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {assignment.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {assignment.studentIds.length} students
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No assignments created yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setActiveTab('assignments')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Assignment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to help you manage your PBL classroom
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => setActiveTab('students')}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Student Profile</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('assignments')}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create PBL Project</span>
                  </Button>

                </div>
              </CardContent>
            </Card>

            {/* Status Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="bg-blue-100 rounded-full p-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>PBL Implementation Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
                    <p className="text-sm text-blue-800">Students with learning profiles</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{activeAssignments}</div>
                    <p className="text-sm text-purple-800">Active PBL projects</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {totalStudents > 0 ? Math.round((activeAssignments / Math.max(totalStudents, 1)) * 100) : 0}%
                    </div>
                    <p className="text-sm text-green-800">Student engagement rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <StudentManagement />
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <AssignmentManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}