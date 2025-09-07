import questionsDataRaw from '@/data/questions.json';

export interface Question {
  id: string;
  category: string;
  subcategory: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
  company: string;
  companies: string[];
}

// Type assertion to ensure proper typing
const questionsData: Question[] = questionsDataRaw as Question[];

export { questionsData };

export const getQuestionsByCategory = (category: string): Question[] => {
  return questionsData.filter(q => q.category === category);
};

export const getQuestionsBySubCategory = (category: string, subCategory: string, limit?: number): Question[] => {
  const questions = questionsData.filter(q => q.category === category && q.subcategory === subCategory);
  return limit ? questions.slice(0, limit) : questions;
};

export const getQuestionStats = (category: string) => {
  const questions = getQuestionsByCategory(category);
  return {
    total: questions.length,
    easy: questions.filter(q => q.difficulty === "Easy").length,
    medium: questions.filter(q => q.difficulty === "Medium").length,
    hard: questions.filter(q => q.difficulty === "Hard").length
  };
};

export const getSubCategoryStats = (category: string, subCategory: string) => {
  const questions = getQuestionsBySubCategory(category, subCategory);
  return {
    total: questions.length,
    easy: questions.filter(q => q.difficulty === "Easy").length,
    medium: questions.filter(q => q.difficulty === "Medium").length,
    hard: questions.filter(q => q.difficulty === "Hard").length
  };
};
