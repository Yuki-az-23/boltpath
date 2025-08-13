import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { BookOpen, Users, Shield, Building2, GraduationCap, Lightbulb, TrendingUp, Mail, Phone, Check } from 'lucide-react';
import { toast } from 'sonner';

interface HomePageProps {
  onNavigateToLogin: () => void;
}

export function HomePage({ onNavigateToLogin }: HomePageProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    organizationType: '',
    numberOfEducators: '',
    message: ''
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the invitation to your backend
    toast.success('Invitation sent! We\'ll be in touch within 24 hours.');
    setIsInviteDialogOpen(false);
    setInviteForm({
      organizationName: '',
      contactName: '',
      email: '',
      phone: '',
      organizationType: '',
      numberOfEducators: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  boltpath
                </h1>
                <p className="text-xs text-muted-foreground">Problem-Based Learning Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex">
                    <Building2 className="h-4 w-4 mr-2" />
                    Invite Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Invite Your Organization</DialogTitle>
                    <DialogDescription>
                      Tell us about your educational institution and we'll help you get started with boltpath.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInviteSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="org-name">Organization Name *</Label>
                        <Input
                          id="org-name"
                          value={inviteForm.organizationName}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, organizationName: e.target.value }))}
                          placeholder="ABC High School"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Contact Name *</Label>
                        <Input
                          id="contact-name"
                          value={inviteForm.contactName}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, contactName: e.target.value }))}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="org-email">Email *</Label>
                        <Input
                          id="org-email"
                          type="email"
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="contact@school.edu"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="org-phone">Phone</Label>
                        <Input
                          id="org-phone"
                          type="tel"
                          value={inviteForm.phone}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="org-type">Organization Type</Label>
                        <Input
                          id="org-type"
                          value={inviteForm.organizationType}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, organizationType: e.target.value }))}
                          placeholder="High School, University, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="num-educators">Number of Educators</Label>
                        <Input
                          id="num-educators"
                          value={inviteForm.numberOfEducators}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, numberOfEducators: e.target.value }))}
                          placeholder="15"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-message">Additional Information</Label>
                      <Textarea
                        id="org-message"
                        value={inviteForm.message}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell us about your PBL goals and any specific needs..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Send Invitation</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button 
                onClick={onNavigateToLogin}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                aria-label="Access teacher login"
              >
                Teacher Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                  Revolutionize Learning with
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Problem-Based Education
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Empower educators to create meaningful, real-world learning experiences that adapt to every student's unique capabilities and learning style.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={onNavigateToLogin}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                >
                  Start Teaching Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(true)}
                  className="text-lg px-8 py-4 border-2"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Invite Your School
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>WCAG 2.1 Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Privacy Focused</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Easy Setup</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 transform rotate-3 shadow-lg">
                <div className="bg-white rounded-2xl p-6 transform -rotate-3 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-2">
                        <Lightbulb className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Climate Change Solutions</p>
                        <p className="text-sm text-muted-foreground">Real-world problem</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-medium">Learning Objective</p>
                        <p className="text-xs text-muted-foreground">Analyze environmental data patterns</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-sm font-medium">Student Accommodation</p>
                        <p className="text-xs text-muted-foreground">Visual aids + Extended time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50" aria-labelledby="features-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="features-title" className="text-4xl font-bold text-gray-900 mb-6">
              Built for Modern Problem-Based Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature designed to support diverse learners and real-world problem solving
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle>Individual Learning Profiles</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Track each student's learning style, strengths, challenges, and required accommodations 
                  to provide personalized support for every learner.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                    <Lightbulb className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle>Problem-Based Assignments</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Create rich, real-world problems with learning objectives, assessment criteria, 
                  and structured timelines that engage students in meaningful learning.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle>Progress Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Monitor individual student progress through PBL phases with accommodation 
                  tracking and reflection notes for comprehensive assessment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle>Learning Accommodations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Built-in support for diverse learning needs with accommodation tracking, 
                  alternative assessment methods, and accessibility features.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                    <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Teacher-only access with secure authentication and privacy-focused design 
                  that protects sensitive student learning information.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                    <Building2 className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle>Institution-Ready</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Scalable for schools and organizations with multi-teacher support, 
                  institutional dashboards, and organization-wide PBL implementation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Organization CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Ready to Transform Your Institution?</h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Join progressive educational institutions that are revolutionizing learning through 
              problem-based education and inclusive teaching practices.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 my-12">
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Get Started Today</h3>
                <p className="text-sm opacity-75">Send us your organization details</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Personalized Demo</h3>
                <p className="text-sm opacity-75">Schedule a tailored walkthrough</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Launch & Train</h3>
                <p className="text-sm opacity-75">Onboard your educators seamlessly</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => setIsInviteDialogOpen(true)}
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Invite Your Organization
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={onNavigateToLogin}
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                Try Individual Access
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">boltpath</h3>
                  <p className="text-xs text-gray-300">Problem-Based Learning</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Empowering educators to create inclusive, real-world learning experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">For Educators</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">PBL Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Materials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Forum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Practices</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              © 2025 boltpath. Built with accessibility and inclusive education in mind.
            </p>
            <p className="text-gray-400 mt-2 text-xs">
              Future integration with Supabase for enhanced institutional management capabilities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}