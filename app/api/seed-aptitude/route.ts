import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/dbConnect'
import { AptitudeQuestion } from '@/lib/database/models'

export async function POST(request: NextRequest) {
    try {
        const db = await getDatabase()
        const questionsCollection = db.collection<AptitudeQuestion>('aptitudeQuestions')

        // Clear existing questions
        await questionsCollection.deleteMany({})

        const aptitudeQuestions: Omit<AptitudeQuestion, '_id'>[] = [
            // General Aptitude - Mathematical and numerical reasoning
            {
                categoryId: 'general',
                question: 'If a train travels 120 km in 2 hours, what is its average speed?',
                options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
                correctAnswer: 1,
                explanation: 'Speed = Distance / Time = 120 km / 2 hours = 60 km/h',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'general',
                question: 'What is 25% of 80?',
                options: ['15', '20', '25', '30'],
                correctAnswer: 1,
                explanation: '25% of 80 = (25/100) × 80 = 20',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'general',
                question: 'If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?',
                options: ['8', '10', '12', '15'],
                correctAnswer: 1,
                explanation: 'If boys:girls = 3:2 and boys = 15, then girls = (2/3) × 15 = 10',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'general',
                question: 'A shopkeeper sells an item for ₹450 and makes a profit of 25%. What was the cost price?',
                options: ['₹350', '₹360', '₹375', '₹400'],
                correctAnswer: 1,
                explanation: 'If CP = x, then SP = x + 25% of x = 1.25x = 450, so x = 450/1.25 = ₹360',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'general',
                question: 'What is the compound interest on ₹1000 for 2 years at 10% per annum?',
                options: ['₹200', '₹210', '₹220', '₹250'],
                correctAnswer: 1,
                explanation: 'CI = P(1+r/100)^n - P = 1000(1.1)^2 - 1000 = 1210 - 1000 = ₹210',
                difficultyLevel: 'hard',
                createdAt: new Date()
            },

            // Verbal & Reasoning
            {
                categoryId: 'verbal-reasoning',
                question: 'Choose the word that is most similar in meaning to "ABUNDANT":',
                options: ['Scarce', 'Plentiful', 'Limited', 'Rare'],
                correctAnswer: 1,
                explanation: 'Abundant means existing in large quantities; plentiful.',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'verbal-reasoning',
                question: 'Complete the analogy: Book : Author :: Painting : ?',
                options: ['Canvas', 'Brush', 'Artist', 'Gallery'],
                correctAnswer: 2,
                explanation: 'A book is created by an author, similarly a painting is created by an artist.',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'verbal-reasoning',
                question: 'If all roses are flowers and some flowers are red, which conclusion is correct?',
                options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined'],
                correctAnswer: 3,
                explanation: 'We cannot determine the color of roses from the given information.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'verbal-reasoning',
                question: 'Choose the odd one out:',
                options: ['Triangle', 'Square', 'Circle', 'Angle'],
                correctAnswer: 3,
                explanation: 'Triangle, Square, and Circle are shapes, while Angle is a geometric concept.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'verbal-reasoning',
                question: 'In a certain code, COMPUTER is written as RFUVQNPC. How is SCIENCE written?',
                options: ['PDJFODF', 'EDJFODF', 'FPJFODF', 'EDJFPDF'],
                correctAnswer: 1,
                explanation: 'Each letter is shifted by +3 positions in the alphabet, then reversed.',
                difficultyLevel: 'hard',
                createdAt: new Date()
            },

            // Current Affairs & GK
            {
                categoryId: 'current-affairs',
                question: 'Who is the current President of India (as of 2024)?',
                options: ['Ram Nath Kovind', 'Droupadi Murmu', 'Pranab Mukherjee', 'A.P.J. Abdul Kalam'],
                correctAnswer: 1,
                explanation: 'Droupadi Murmu is the current President of India since July 2022.',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'current-affairs',
                question: 'Which planet is known as the "Red Planet"?',
                options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                correctAnswer: 1,
                explanation: 'Mars is called the Red Planet due to iron oxide (rust) on its surface.',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'current-affairs',
                question: 'The Quit India Movement was launched in which year?',
                options: ['1940', '1942', '1944', '1946'],
                correctAnswer: 1,
                explanation: 'The Quit India Movement was launched by Mahatma Gandhi on August 8, 1942.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'current-affairs',
                question: 'Which is the longest river in the world?',
                options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
                correctAnswer: 1,
                explanation: 'The Nile River is generally considered the longest river in the world at 6,650 km.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'current-affairs',
                question: 'What is the chemical symbol for Gold?',
                options: ['Go', 'Gd', 'Au', 'Ag'],
                correctAnswer: 2,
                explanation: 'Au is the chemical symbol for Gold, derived from the Latin word "aurum".',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },

            // Technical MCQs
            {
                categoryId: 'technical-mcqs',
                question: 'Which of the following is not a programming language?',
                options: ['Python', 'Java', 'HTML', 'C++'],
                correctAnswer: 2,
                explanation: 'HTML is a markup language, not a programming language.',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'technical-mcqs',
                question: 'What does SQL stand for?',
                options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],
                correctAnswer: 0,
                explanation: 'SQL stands for Structured Query Language.',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'technical-mcqs',
                question: 'Which data structure uses LIFO (Last In First Out) principle?',
                options: ['Queue', 'Stack', 'Array', 'Linked List'],
                correctAnswer: 1,
                explanation: 'Stack follows LIFO principle where the last element added is the first to be removed.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'technical-mcqs',
                question: 'What is the time complexity of binary search?',
                options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
                correctAnswer: 1,
                explanation: 'Binary search has O(log n) time complexity as it divides the search space in half each time.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'technical-mcqs',
                question: 'Which of the following is a NoSQL database?',
                options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
                correctAnswer: 2,
                explanation: 'MongoDB is a NoSQL document database, while others are relational databases.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },

            // Interview Questions
            {
                categoryId: 'interview',
                question: 'What is your greatest strength?',
                options: ['I work too hard', 'I am a perfectionist', 'I am a good team player and communicator', 'I have no weaknesses'],
                correctAnswer: 2,
                explanation: 'Focus on genuine strengths that are relevant to the job and provide specific examples.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'interview',
                question: 'Why do you want to work for our company?',
                options: ['For the salary', 'It\'s close to my home', 'I admire your company culture and growth opportunities', 'I need a job'],
                correctAnswer: 2,
                explanation: 'Show genuine interest in the company and how you can contribute to their goals.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'interview',
                question: 'How do you handle stress and pressure?',
                options: ['I avoid stressful situations', 'I get overwhelmed easily', 'I prioritize tasks and stay organized', 'I don\'t get stressed'],
                correctAnswer: 2,
                explanation: 'Demonstrate practical stress management techniques and your ability to perform under pressure.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'interview',
                question: 'Where do you see yourself in 5 years?',
                options: ['In your position', 'I don\'t know', 'Growing professionally and taking on more responsibilities', 'Running my own company'],
                correctAnswer: 2,
                explanation: 'Show ambition while aligning your goals with the company\'s growth opportunities.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'interview',
                question: 'Tell me about a time you failed.',
                options: ['I never fail', 'I failed an exam once', 'I learned from a project setback and improved my approach', 'I prefer not to discuss failures'],
                correctAnswer: 2,
                explanation: 'Show how you learn from failures and turn them into growth opportunities.',
                difficultyLevel: 'hard',
                createdAt: new Date()
            },

            // Programming Questions
            {
                categoryId: 'programming',
                question: 'What will be the output of: print(2 ** 3 ** 2)?',
                options: ['64', '512', '256', 'Error'],
                correctAnswer: 1,
                explanation: 'Exponentiation is right-associative, so 2 ** 3 ** 2 = 2 ** (3 ** 2) = 2 ** 9 = 512',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'programming',
                question: 'Which of the following is the correct way to declare a variable in JavaScript?',
                options: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'All of the above'],
                correctAnswer: 3,
                explanation: 'All three (var, let, const) are valid ways to declare variables in JavaScript, each with different scoping rules.',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'programming',
                question: 'What is the purpose of the "break" statement in loops?',
                options: ['To skip the current iteration', 'To exit the loop completely', 'To restart the loop', 'To pause the loop'],
                correctAnswer: 1,
                explanation: 'The break statement is used to exit/terminate the loop completely.',
                difficultyLevel: 'easy',
                createdAt: new Date()
            },
            {
                categoryId: 'programming',
                question: 'In object-oriented programming, what is inheritance?',
                options: ['Creating multiple objects', 'A class acquiring properties of another class', 'Hiding implementation details', 'Overloading methods'],
                correctAnswer: 1,
                explanation: 'Inheritance allows a class to acquire properties and methods from another class.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            },
            {
                categoryId: 'programming',
                question: 'What is the difference between "==" and "===" in JavaScript?',
                options: ['No difference', '== checks type, === checks value', '== checks value, === checks type and value', '=== is faster'],
                correctAnswer: 2,
                explanation: '== performs type coercion and compares values, while === compares both type and value without coercion.',
                difficultyLevel: 'medium',
                createdAt: new Date()
            }
        ]

        // Insert all questions
        const result = await questionsCollection.insertMany(aptitudeQuestions)

        // Create categories collection
        const categoriesCollection = db.collection('aptitudeCategories')
        await categoriesCollection.deleteMany({})

        const categories = [
            {
                categoryId: 'general',
                name: 'General Aptitude',
                description: 'Mathematical and numerical reasoning',
                totalQuestions: 20,
                timeLimitMinutes: 20,
                createdAt: new Date()
            },
            {
                categoryId: 'verbal-reasoning',
                name: 'Verbal & Reasoning',
                description: 'Language skills and logical thinking',
                totalQuestions: 20,
                timeLimitMinutes: 20,
                createdAt: new Date()
            },
            {
                categoryId: 'current-affairs',
                name: 'Current Affairs & GK',
                description: 'Current affairs and general awareness',
                totalQuestions: 20,
                timeLimitMinutes: 20,
                createdAt: new Date()
            },
            {
                categoryId: 'technical-mcqs',
                name: 'Technical MCQs',
                description: 'Technical knowledge and concepts',
                totalQuestions: 20,
                timeLimitMinutes: 20,
                createdAt: new Date()
            },
            {
                categoryId: 'interview',
                name: 'Interview Questions',
                description: 'Common interview questions and scenarios',
                totalQuestions: 20,
                timeLimitMinutes: 20,
                createdAt: new Date()
            },
            {
                categoryId: 'programming',
                name: 'Programming Questions',
                description: 'Programming concepts and coding questions',
                totalQuestions: 20,
                timeLimitMinutes: 20,
                createdAt: new Date()
            }
        ]

        await categoriesCollection.insertMany(categories)

        return NextResponse.json({
            message: 'Aptitude questions and categories seeded successfully',
            questionsInserted: result.insertedCount,
            categoriesInserted: categories.length
        })
    } catch (error) {
        console.error('Seed aptitude error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}