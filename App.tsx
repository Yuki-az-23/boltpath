import { createContext, useContext, useState, ReactNode } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';

// Types
export interface Teacher {
  id: string;
  fullName: string;
  idNumber: string;
  organization?: string;
}

export interface LearningProfile {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing' | 'mixed';
  strengths: string[];
  challenges: string[];
  accommodations: string[];
  preferredAssessmentMethods: string[];
  notes: string;
}

export interface Student {
  id: string;
  fullName: string;
  grade: string;
  phoneNumber: string;
  teacherId: string;
  learningProfile: LearningProfile;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface PBLAssignment {
  id: string;
  title: string;
  problemStatement: string;
  realWorldContext: string;
  learningObjectives: string[];
  assessmentCriteria: {
    criterion: string;
    weight: number;
    rubric: string;
  }[];
  resources: string[];
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
  dueDate: string;
  studentIds: string[];
  teacherId: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  collaborationType: 'individual' | 'pairs' | 'small-groups' | 'whole-class';
  skillsFocus: string[];
}

export interface StudentProgress {
  studentId: string;
  assignmentId: string;
  currentPhase: number;
  completedActivities: string[];
  reflectionNotes: string;
  teacherObservations: string;
  accommodationsUsed: string[];
  lastUpdated: string;
}

// Navigation Context
interface NavigationContextType {
  goToHome: () => void;
  goToLogin: () => void;
  goToDashboard: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Auth Context
interface AuthContextType {
  teacher: Teacher | null;
  login: (teacher: Teacher) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// App State Context
interface AppStateContextType {
  students: Student[];
  assignments: PBLAssignment[];
  studentProgress: StudentProgress[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addAssignment: (assignment: Omit<PBLAssignment, 'id'>) => void;
  updateAssignment: (id: string, assignment: Partial<PBLAssignment>) => void;
  deleteAssignment: (id: string) => void;
  updateStudentProgress: (progress: Partial<StudentProgress> & { studentId: string; assignmentId: string }) => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const login = (teacherData: Teacher) => {
    setTeacher(teacherData);
  };

  const logout = () => {
    setTeacher(null);
  };

  return (
    <AuthContext.Provider value={{ teacher, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function AppStateProvider({ children }: { children: ReactNode }) {
  // Mock data - will be replaced with Supabase later
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      fullName: 'Alice Johnson',
      grade: '10th Grade',
      phoneNumber: '(555) 123-4567',
      teacherId: 'teacher1',
      learningProfile: {
        learningStyle: 'visual',
        strengths: ['Critical thinking', 'Visual processing', 'Collaboration'],
        challenges: ['Time management', 'Written expression'],
        accommodations: ['Extended time', 'Visual aids', 'Graphic organizers'],
        preferredAssessmentMethods: ['Portfolio', 'Presentation', 'Project-based'],
        notes: 'Excels in group work and benefits from visual supports. Needs scaffolding for written tasks.'
      },
      emergencyContact: {
        name: 'Sarah Johnson',
        relationship: 'Mother',
        phone: '(555) 123-4568'
      }
    },
    {
      id: '2',
      fullName: 'Bob Smith',
      grade: '9th Grade',
      phoneNumber: '(555) 987-6543',
      teacherId: 'teacher1',
      learningProfile: {
        learningStyle: 'kinesthetic',
        strengths: ['Problem-solving', 'Hands-on learning', 'Leadership'],
        challenges: ['Attention to detail', 'Sitting still for long periods'],
        accommodations: ['Movement breaks', 'Fidget tools', 'Standing desk option'],
        preferredAssessmentMethods: ['Practical demonstration', 'Oral presentation'],
        notes: 'Benefits from hands-on activities and frequent movement. Strong leader in group settings.'
      }
    }
  ]);

  const [assignments, setAssignments] = useState<PBLAssignment[]>([
    {
      id: '1',
      title: 'Climate Change Solutions for Our Community',
      problemStatement: 'How can our local community reduce its carbon footprint by 30% within the next 5 years while maintaining economic growth?',
      realWorldContext: 'Local government has requested student input on sustainable development plans for the city.',
      learningObjectives: [
        'Analyze environmental data and identify patterns',
        'Research and evaluate renewable energy solutions',
        'Collaborate effectively in diverse teams',
        'Present evidence-based recommendations to stakeholders'
      ],
      assessmentCriteria: [
        { criterion: 'Research Quality', weight: 25, rubric: 'Use of credible sources, data analysis, evidence quality' },
        { criterion: 'Problem-Solving', weight: 30, rubric: 'Innovation, feasibility, impact assessment' },
        { criterion: 'Collaboration', weight: 20, rubric: 'Team contribution, communication, conflict resolution' },
        { criterion: 'Presentation', weight: 25, rubric: 'Clarity, organization, audience engagement' }
      ],
      resources: [
        'EPA Climate Data Portal',
        'Local Environmental Assessment Reports',
        'Expert Interview Contacts',
        'Community Survey Tools'
      ],
      timeline: [
        {
          phase: 'Research & Investigation',
          duration: '2 weeks',
          activities: ['Literature review', 'Data collection', 'Expert interviews']
        },
        {
          phase: 'Solution Development',
          duration: '2 weeks',
          activities: ['Brainstorming', 'Feasibility analysis', 'Prototype creation']
        },
        {
          phase: 'Implementation Planning',
          duration: '1 week',
          activities: ['Action plan creation', 'Stakeholder mapping', 'Impact assessment']
        },
        {
          phase: 'Presentation & Reflection',
          duration: '1 week',
          activities: ['Final presentation preparation', 'Peer feedback', 'Self-reflection']
        }
      ],
      dueDate: '2025-09-15',
      studentIds: ['1', '2'],
      teacherId: 'teacher1',
      status: 'active',
      collaborationType: 'small-groups',
      skillsFocus: ['Critical thinking', 'Research skills', 'Environmental literacy', 'Public speaking']
    }
  ]);

  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([
    {
      studentId: '1',
      assignmentId: '1',
      currentPhase: 1,
      completedActivities: ['Literature review', 'Data collection'],
      reflectionNotes: 'Finding it challenging to synthesize information from multiple sources',
      teacherObservations: 'Strong visual processing skills evident. Benefits from graphic organizers.',
      accommodationsUsed: ['Extended time', 'Visual aids'],
      lastUpdated: '2025-08-15'
    }
  ]);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent = {
      ...studentData,
      id: Date.now().toString()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    // Also remove student from assignments and progress
    setAssignments(prev => prev.map(assignment => ({
      ...assignment,
      studentIds: assignment.studentIds.filter(studentId => studentId !== id)
    })));
    setStudentProgress(prev => prev.filter(progress => progress.studentId !== id));
  };

  const addAssignment = (assignmentData: Omit<PBLAssignment, 'id'>) => {
    const newAssignment = {
      ...assignmentData,
      id: Date.now().toString()
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const updateAssignment = (id: string, updates: Partial<PBLAssignment>) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? { ...assignment, ...updates } : assignment
    ));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    setStudentProgress(prev => prev.filter(progress => progress.assignmentId !== id));
  };

  const updateStudentProgress = (progressUpdate: Partial<StudentProgress> & { studentId: string; assignmentId: string }) => {
    setStudentProgress(prev => {
      const existingIndex = prev.findIndex(
        p => p.studentId === progressUpdate.studentId && p.assignmentId === progressUpdate.assignmentId
      );
      
      if (existingIndex >= 0) {
        return prev.map((progress, index) => 
          index === existingIndex 
            ? { ...progress, ...progressUpdate, lastUpdated: new Date().toISOString().split('T')[0] }
            : progress
        );
      } else {
        return [...prev, {
          currentPhase: 0,
          completedActivities: [],
          reflectionNotes: '',
          teacherObservations: '',
          accommodationsUsed: [],
          lastUpdated: new Date().toISOString().split('T')[0],
          ...progressUpdate
        }];
      }
    });
  };

  return (
    <AppStateContext.Provider value={{
      students,
      assignments,
      studentProgress,
      addStudent,
      updateStudent,
      deleteStudent,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      updateStudentProgress
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'dashboard'>('home');

  const navigationHandlers = {
    goToHome: () => setCurrentPage('home'),
    goToLogin: () => setCurrentPage('login'),
    goToDashboard: () => setCurrentPage('dashboard')
  };

  return (
    <NavigationContext.Provider value={navigationHandlers}>
      <AuthProvider>
        <AppStateProvider>
          <div className="min-h-screen bg-background">
            {currentPage === 'home' && (
              <HomePage onNavigateToLogin={() => setCurrentPage('login')} />
            )}
            {currentPage === 'login' && (
              <LoginPage 
                onLoginSuccess={() => setCurrentPage('dashboard')}
                onBackToHome={() => setCurrentPage('home')}
              />
            )}
            {currentPage === 'dashboard' && (
              <Dashboard onLogout={() => setCurrentPage('home')} />
            )}
            <Toaster />
          </div>
        </AppStateProvider>
      </AuthProvider>
    </NavigationContext.Provider>
  );
}