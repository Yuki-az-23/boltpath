# Contributing to BoltPath PBL Platform

Thank you for your interest in contributing to BoltPath! We welcome contributions from educators, developers, researchers, and anyone passionate about improving education through inclusive technology.

## 🎯 Ways to Contribute

### For Educators
- **Classroom Testing**: Implement BoltPath concepts in your classroom and share feedback
- **Problem Scenarios**: Contribute authentic, real-world problems for different subject areas
- **Accessibility Insights**: Share experiences with diverse learners and accommodation needs
- **Pedagogical Feedback**: Help us improve the PBL methodology implementation

### For Developers
- **Bug Reports**: Help us identify and fix issues
- **Feature Development**: Contribute new functionality
- **Accessibility Improvements**: Ensure the platform works for all users
- **Performance Optimization**: Help make the platform faster and more efficient

### For Researchers
- **Educational Impact Studies**: Collaborate on research projects
- **User Experience Research**: Study how educators and students interact with the platform
- **Learning Analytics**: Contribute to data analysis and insight development
- **Literature Integration**: Help connect our work with current educational research

## 🛠️ Development Guidelines

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/Yuki-az-23/boltpath.git
   cd boltpath-pbl-platform
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Code Standards

#### TypeScript/React Guidelines
- **Use TypeScript** for all new code with proper type annotations
- **Follow React best practices** including hooks and functional components
- **Component structure**: Keep components focused and reusable
- **Props interface**: Always define interfaces for component props

#### Styling Guidelines
- **Use Tailwind CSS** utility classes for consistent styling
- **Follow HSL color format** for CSS variables (compatible with our design system)
- **Responsive design**: Ensure all features work across device sizes
- **Accessibility**: Include proper ARIA labels and semantic HTML

#### Code Quality
- **ESLint compliance**: Follow the configured linting rules
- **Type checking**: Ensure TypeScript compilation without errors
- **Meaningful names**: Use descriptive variable and function names
- **Comment complex logic**: Explain educational methodology implementations

### Accessibility Requirements

All contributions must meet accessibility standards:

- **Keyboard navigation**: Full functionality without mouse
- **Screen reader support**: Proper semantic HTML and ARIA labels
- **Color contrast**: Minimum WCAG AA contrast ratios
- **Focus indicators**: Clear visual focus states
- **Alternative text**: Descriptive alt text for images
- **Captions**: Provide captions for video content

### Educational Considerations

When contributing educational features:

- **Research-based**: Ground features in educational research
- **Inclusive design**: Consider diverse learning needs from the start
- **Teacher workflow**: Ensure features support educator efficiency
- **Student agency**: Promote student choice and self-direction
- **Assessment integration**: Connect to meaningful evaluation methods

## 📝 Submission Process

### Pull Request Guidelines

1. **Descriptive title**: Clearly describe what the PR accomplishes
2. **Detailed description**: Explain the problem solved and approach taken
3. **Educational rationale**: For feature PRs, explain the pedagogical benefit
4. **Testing information**: Describe how you tested the changes
5. **Accessibility verification**: Confirm accessibility requirements are met

### PR Template

```markdown
## Description
Brief description of changes and why they're needed.

## Educational Impact
How does this change improve the learning experience?

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Educational content
- [ ] Accessibility improvement
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Accessibility tested
- [ ] Cross-browser tested
- [ ] Mobile responsive tested

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information reviewers should know.
```

### Review Process

1. **Automated checks**: Ensure all CI checks pass
2. **Educational review**: Educator team reviews pedagogical aspects
3. **Technical review**: Developers review code quality and architecture
4. **Accessibility audit**: Accessibility experts verify compliance
5. **Integration testing**: Test with existing features

## 🎓 Educational Content Guidelines

### Problem Scenario Contributions

When contributing problem-based learning scenarios:

#### Content Requirements
- **Authentic context**: Real-world relevance and application
- **Open-ended**: Multiple valid solution approaches
- **Appropriate complexity**: Challenging but achievable for target age
- **Interdisciplinary connections**: Link multiple subject areas when possible

#### Accessibility Considerations
- **Multiple entry points**: Various ways students can engage with the problem
- **Flexible presentation**: Adaptable to different learning modalities
- **Scaffolding options**: Built-in support for different skill levels
- **Clear success criteria**: Students understand what success looks like

#### Metadata Requirements
```typescript
interface ProblemScenario {
  title: string;
  description: string;
  targetAgeRange: string;
  subjectAreas: string[];
  estimatedDuration: string;
  learningObjectives: string[];
  accommodationSuggestions: string[];
  assessmentRubric: RubricCriteria[];
}
```

## 🐛 Bug Reports

### Before Submitting a Bug Report

1. **Check existing issues** to avoid duplicates
2. **Update to latest version** and test if bug persists
3. **Test in different browsers** to isolate browser-specific issues
4. **Gather reproduction steps** with specific details

### Bug Report Template

```markdown
## Bug Description
Clear, concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- Browser: [e.g., Chrome 91, Firefox 89]
- Device: [e.g., Desktop, iPhone 12]
- Screen reader: [if using assistive technology]

## Additional Context
Screenshots, error messages, or other helpful information.
```

## 🌟 Feature Requests

### Feature Request Guidelines

Before submitting a feature request:

1. **Search existing requests** to avoid duplicates
2. **Consider educational impact** - how does this improve learning?
3. **Think about accessibility** - how will this work for all users?
4. **Propose implementation approach** if you have technical knowledge

### Feature Request Template

```markdown
## Feature Description
Clear description of the requested feature.

## Educational Justification
How would this feature improve the learning experience?

## User Story
As a [teacher/student/administrator], I want [feature] so that [benefit].

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Accessibility requirement met
- [ ] Works across devices

## Additional Context
Mockups, research citations, or examples from other platforms.
```

## 📚 Documentation Contributions

### Documentation Standards

- **Clear language**: Write for educators who may not be technical
- **Step-by-step instructions**: Include screenshots when helpful
- **Educational context**: Explain not just how, but why
- **Accessibility notes**: Include accessibility considerations
- **Update existing docs**: Keep all documentation current

### Types of Documentation Needed

- **Teacher guides**: How to implement PBL methodology
- **Technical documentation**: API references and development guides
- **Accessibility guides**: Making content accessible to all learners
- **Research summaries**: Connecting features to educational research
- **Case studies**: Real classroom implementation examples

## 🤝 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming, inclusive environment for all contributors. We expect:

- **Respectful communication** in all interactions
- **Constructive feedback** focused on improvement
- **Educational focus** keeping student benefit as the priority
- **Inclusive language** that welcomes all participants
- **Professional behavior** in all community spaces

### Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **Documentation**: Check existing guides and tutorials
- **Issue tracker**: Search for solutions to common problems
- **Community forums**: Connect with other educators and developers

### Recognition

Contributors are recognized through:

- **Contributors page** highlighting community members
- **Release notes** acknowledging specific contributions
- **Educational impact stories** sharing how contributions help real classrooms
- **Community spotlight** featuring outstanding contributors

## 📊 Research and Data

### Privacy and Ethics

When contributing research or data-related features:

- **Student privacy**: Never include personally identifiable information
- **Ethical guidelines**: Follow educational research ethics standards
- **Data minimization**: Collect only necessary data for educational improvement
- **Transparency**: Be clear about data collection and use
- **Consent mechanisms**: Provide appropriate consent processes

### Research Contributions

We welcome research collaborations:

- **Impact studies**: Measuring educational outcomes
- **Usability research**: Improving user experience
- **Accessibility studies**: Ensuring universal access
- **Pedagogical research**: Validating PBL implementation
- **Learning analytics**: Understanding student learning patterns

---

**Thank you for contributing to BoltPath! Together, we can create educational technology that truly serves every learner.**