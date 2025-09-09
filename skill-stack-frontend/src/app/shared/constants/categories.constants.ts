// Skill Categories - Used throughout the application
export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Mobile',
  'Design',
  'Testing',
  'Other'
] as const;

// Goal Categories - Used throughout the application
export const GOAL_CATEGORIES = [
  'Career Development',
  'Skill Enhancement',
  'Project Goals',
  'Learning Objectives',
  'Personal Growth',
  'Certification',
  'Other'
] as const;

// Type definitions for TypeScript
export type SkillCategory = typeof SKILL_CATEGORIES[number];
export type GoalCategory = typeof GOAL_CATEGORIES[number];

// Helper functions
export const getAllSkillCategories = (): string[] => ['All Categories', ...SKILL_CATEGORIES];
export const getAllGoalCategories = (): string[] => ['All Categories', ...GOAL_CATEGORIES];
