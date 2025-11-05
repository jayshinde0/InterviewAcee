import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/dbConnect'
import { AptitudeQuestion } from '@/lib/database/models'

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const questionsCollection = db.collection<AptitudeQuestion>('aptitudeQuestions')
    
    // Sample dynamic questions
    const dynamicQuestions: Omit<AptitudeQuestion, '_id'>[] = [
      {
        categoryId: 'dynamic',
        question: 'What is the capital of France?',
        options: ['London', 'Paris', 'Berlin', 'Madrid'],
        correctAnswer: 1,
        explanation: 'Paris is the capital and largest city of France.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'Which programming language is known for its use in web development and has a snake as its mascot?',
        options: ['Java', 'Python', 'C++', 'JavaScript'],
        correctAnswer: 1,
        explanation: 'Python is known for its simplicity and has a snake as its mascot.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
        correctAnswer: 0,
        explanation: 'HTML stands for Hyper Text Markup Language, used for creating web pages.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'In which year was the first iPhone released?',
        options: ['2005', '2006', '2007', '2008'],
        correctAnswer: 2,
        explanation: 'The first iPhone was released by Apple in 2007.',
        difficultyLevel: 'medium',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'What is the largest planet in our solar system?',
        options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'],
        correctAnswer: 2,
        explanation: 'Jupiter is the largest planet in our solar system.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'Which of the following is a NoSQL database?',
        options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
        correctAnswer: 2,
        explanation: 'MongoDB is a popular NoSQL document database.',
        difficultyLevel: 'medium',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1,
        explanation: 'CSS stands for Cascading Style Sheets, used for styling web pages.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'Which company developed the React JavaScript library?',
        options: ['Google', 'Microsoft', 'Facebook', 'Apple'],
        correctAnswer: 2,
        explanation: 'React was developed by Facebook (now Meta) for building user interfaces.',
        difficultyLevel: 'medium',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'What is the time complexity of a binary search algorithm?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1,
        explanation: 'Binary search has O(log n) time complexity as it divides the search space in half each iteration.',
        difficultyLevel: 'hard',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'Which HTTP status code indicates "Not Found"?',
        options: ['200', '301', '404', '500'],
        correctAnswer: 2,
        explanation: 'HTTP status code 404 indicates that the requested resource was not found.',
        difficultyLevel: 'medium',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'What does API stand for?',
        options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Interface', 'Automated Programming Interface'],
        correctAnswer: 0,
        explanation: 'API stands for Application Programming Interface, which allows different software applications to communicate.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'Which of the following is a version control system?',
        options: ['Docker', 'Git', 'Node.js', 'React'],
        correctAnswer: 1,
        explanation: 'Git is a distributed version control system used for tracking changes in source code.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'What is the default port for HTTP?',
        options: ['21', '22', '80', '443'],
        correctAnswer: 2,
        explanation: 'Port 80 is the default port for HTTP (Hypertext Transfer Protocol).',
        difficultyLevel: 'medium',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'Which data structure follows the LIFO (Last In, First Out) principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctAnswer: 1,
        explanation: 'A stack follows the LIFO principle where the last element added is the first one to be removed.',
        difficultyLevel: 'medium',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'What does JSON stand for?',
        options: ['JavaScript Object Notation', 'Java Standard Object Notation', 'JavaScript Oriented Notation', 'Java Script Object Network'],
        correctAnswer: 0,
        explanation: 'JSON stands for JavaScript Object Notation, a lightweight data interchange format.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'Which of the following is NOT a JavaScript framework?',
        options: ['Angular', 'Vue.js', 'Django', 'React'],
        correctAnswer: 2,
        explanation: 'Django is a Python web framework, not a JavaScript framework.',
        difficultyLevel: 'medium',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'What is the purpose of the "alt" attribute in HTML img tags?',
        options: ['To specify image alignment', 'To provide alternative text for screen readers', 'To set image size', 'To add image effects'],
        correctAnswer: 1,
        explanation: 'The "alt" attribute provides alternative text for images, important for accessibility and screen readers.',
        difficultyLevel: 'medium',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'Which SQL command is used to retrieve data from a database?',
        options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
        correctAnswer: 2,
        explanation: 'The SELECT command is used to retrieve data from a database.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'What is the main purpose of a CDN (Content Delivery Network)?',
        options: ['Data storage', 'Faster content delivery', 'User authentication', 'Database management'],
        correctAnswer: 1,
        explanation: 'A CDN is designed to deliver content faster by serving it from servers closer to the user.',
        difficultyLevel: 'medium',
        createdAt: new Date()
      },
      {
        categoryId: 'dynamic',
        question: 'Which of the following is a correct way to declare a variable in JavaScript?',
        options: ['var myVar;', 'let myVar;', 'const myVar = value;', 'All of the above'],
        correctAnswer: 3,
        explanation: 'All three (var, let, const) are valid ways to declare variables in JavaScript, each with different scoping rules.',
        difficultyLevel: 'easy',
        createdAt: new Date()
      }
    ]

    // Insert all dynamic questions
    const result = await questionsCollection.insertMany(dynamicQuestions)
    
    return NextResponse.json({
      message: 'Dynamic questions added successfully',
      questionsInserted: result.insertedCount,
      questions: dynamicQuestions.length
    })
  } catch (error) {
    console.error('Seed dynamic questions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}