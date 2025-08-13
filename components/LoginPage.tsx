import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../App';
import { toast } from 'sonner';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export function LoginPage({ onLoginSuccess, onBackToHome }: LoginPageProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters long';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    } else if (!/^[A-Za-z0-9]{3,20}$/.test(formData.idNumber.trim())) {
      newErrors.idNumber = 'ID number must be 3-20 alphanumeric characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the form errors before submitting');
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      // Mock authentication - in real app, this would be a Supabase API call
      const mockTeachers = [
        { fullName: 'John Smith', idNumber: 'TEACH001' },
        { fullName: 'Sarah Johnson', idNumber: 'TEACH002' },
        { fullName: 'User name', idNumber: 'DEMO123' }
      ];

      const teacher = mockTeachers.find(
        t => t.fullName.toLowerCase() === formData.fullName.toLowerCase() && 
             t.idNumber.toLowerCase() === formData.idNumber.toLowerCase()
      );

      if (teacher) {
        login({
          id: 'teacher1',
          fullName: teacher.fullName,
          idNumber: teacher.idNumber
        });
        toast.success(`Welcome back to boltpath, ${teacher.fullName}!`);
        onLoginSuccess();
      } else {
        setErrors({ 
          general: 'Invalid credentials. Please check your full name and ID number.' 
        });
        toast.error('Login failed. Please check your credentials.');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBackToHome}
            className="mb-4 hover:bg-white/50"
            aria-label="Go back to homepage"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Home
          </Button>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                boltpath
              </h1>
              <p className="text-xs text-muted-foreground">Problem-Based Learning</p>
            </div>
          </div>
          <h2 className="text-lg text-gray-600">Teacher Access Portal</h2>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-2">
          <CardHeader className="text-center">
            <CardTitle>Access Your PBL Dashboard</CardTitle>
            <CardDescription>
              Enter your credentials to manage student learning profiles and problem-based assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Credentials Info */}
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo Credentials:</strong><br/>
                Name: User name<br/>
                ID: DEMO123
              </AlertDescription>
            </Alert>

            {/* General Error */}
            {errors.general && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="fullName" 
                    className="required-field"
                    aria-required="true"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`bg-input-background ${errors.fullName ? 'border-destructive focus:border-destructive' : ''}`}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                    required
                    autoComplete="name"
                  />
                  {errors.fullName && (
                    <p 
                      id="fullName-error" 
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* ID Number Field */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="idNumber"
                    className="required-field"
                    aria-required="true"
                  >
                    Teacher ID Number
                  </Label>
                  <Input
                    id="idNumber"
                    type="text"
                    placeholder="Enter your ID number"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    className={`bg-input-background ${errors.idNumber ? 'border-destructive focus:border-destructive' : ''}`}
                    aria-describedby={errors.idNumber ? 'idNumber-error' : undefined}
                    aria-invalid={errors.idNumber ? 'true' : 'false'}
                    required
                    autoComplete="username"
                  />
                  {errors.idNumber && (
                    <p 
                      id="idNumber-error" 
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.idNumber}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                  disabled={isLoading}
                  aria-describedby="login-status"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></div>
                      Signing In...
                    </>
                  ) : (
                    'Access Dashboard'
                  )}
                </Button>
              </div>
            </form>

            {/* Accessibility Note */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Accessibility:</strong> This form supports screen readers and keyboard navigation. 
                Use Tab to navigate between fields and Enter to submit.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Secure authentication powered by boltpath<br/>
            <span className="text-xs">Future Supabase integration ready</span>
          </p>
        </div>
      </div>
    </div>
  );
}