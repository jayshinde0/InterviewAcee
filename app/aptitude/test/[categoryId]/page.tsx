"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw, ArrowLeft, Target } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
  language?: string
}

const questionBank: Question[] = [
  // General Aptitude Questions (20 total)
  {
    id: 1,
    question: "Which one of the following numbers is completely divisible by 45?",
    options: ["181560", "331145", "202860", "2033555"],
    correctAnswer: 2,
    explanation: "A number is divisible by 45 if it's divisible by both 5 and 9. 202860 ends in 0 (divisible by 5) and sum of digits = 2+0+2+8+6+0 = 18 (divisible by 9).",
    category: "general"
  },
  {
    id: 2,
    question: "If the number 517*324 is completely divisible by 3, then the smallest whole number in the place of * will be:",
    options: ["0", "1", "2", "None of these"],
    correctAnswer: 2,
    explanation: "For divisibility by 3, sum of digits must be divisible by 3. Sum = 5+1+7+*+3+2+4 = 22+*. For 22+* to be divisible by 3, * = 2 (since 24 is divisible by 3).",
    category: "general"
  },
  {
    id: 3,
    question: "Which one of the following can't be the square of natural number?",
    options: ["30976", "75625", "28561", "143642"],
    correctAnswer: 3,
    explanation: "A perfect square never ends in 2, 3, 7, or 8. 143642 ends in 2, so it cannot be a perfect square.",
    category: "general"
  },
  {
    id: 4,
    question: "The greatest possible length which can be used to measure exactly the lengths 7 m, 3 m 85 cm, 12 m 95 cm is:",
    options: ["15 cm", "25 cm", "35 cm", "42 cm"],
    correctAnswer: 2,
    explanation: "Convert to cm: 700 cm, 385 cm, 1295 cm. Find HCF of 700, 385, 1295 = 35 cm.",
    category: "general"
  },
  {
    id: 5,
    question: "The rational number for recurring decimal 0.125125.... is:",
    options: ["63/487", "119/993", "125/999", "None of these"],
    correctAnswer: 2,
    explanation: "Let x = 0.125125... Then 1000x = 125.125125... Subtracting: 999x = 125, so x = 125/999.",
    category: "general"
  },
  {
    id: 6,
    question: "At present, the ratio between the ages of Arun and Deepak is 4:3. After 6 years, Arun's age will be 26 years. What is the age of Deepak at present?",
    options: ["12 years", "15 years", "19 and half", "21 years"],
    correctAnswer: 1,
    explanation: "Arun's present age = 26 - 6 = 20 years. If ratio is 4:3, then Deepak's age = (3/4) × 20 = 15 years.",
    category: "general"
  },
  {
    id: 7,
    question: "Six years ago, the ratio of the ages of Kunal and Sagar was 6:5. Four years hence, the ratio of their ages will be 11:10. What is Sagar's age at present?",
    options: ["16 years", "18 years", "20 years", "Cannot be determined"],
    correctAnswer: 0,
    explanation: "Let present ages be K and S. (K-6):(S-6) = 6:5 and (K+4):(S+4) = 11:10. Solving these equations gives S = 16 years.",
    category: "general"
  },
  {
    id: 8,
    question: "Rajeev buys goods worth Rs. 6650. He gets a rebate of 6% on it. After getting the rebate, he pays sales tax @ 10%. Find the amount he will have to pay for the goods.",
    options: ["Rs. 6876.10", "Rs. 6999.20", "Rs. 6654", "Rs. 7000"],
    correctAnswer: 0,
    explanation: "After 6% rebate: 6650 × 0.94 = 6251. After 10% tax: 6251 × 1.10 = 6876.10",
    category: "general"
  },
  {
    id: 9,
    question: "What is R's share of profit in a joint venture? I. Q started business investing Rs. 80,000. II. R joined him after 3 months. III. P joined after 4 months with a capital of Rs. 1,20,000 and got Rs. 6000 as his share profit.",
    options: ["All I, II and III", "I and III only", "II and III only", "Even with all I, II and III, the answer cannot be arrived at"],
    correctAnswer: 3,
    explanation: "We need R's investment amount to calculate his share, which is not given in any statement.",
    category: "general"
  },
  {
    id: 10,
    question: "A pump can fill a tank with water in 2 hours. Because of a leak, it took 2⅓ hours to fill the tank. The leak can drain all the water of the tank in:",
    options: ["4⅓ hours", "7 hours", "8 hours", "14 hours"],
    correctAnswer: 3,
    explanation: "Pump rate = 1/2 tank/hour. Combined rate = 1/(7/3) = 3/7 tank/hour. Leak rate = 1/2 - 3/7 = 1/14 tank/hour. So leak empties tank in 14 hours.",
    category: "general"
  },
  {
    id: 11,
    question: "8 litres are drawn from a cask full of wine and is then filled with water. This operation is performed three more times. The ratio of the quantity of wine now left in cask to that of water is 16:65. How much wine did the cask hold originally?",
    options: ["18 litres", "24 litres", "32 litres", "42 litres"],
    correctAnswer: 1,
    explanation: "Let original capacity be x litres. After 4 operations, wine left = x(1-8/x)⁴. Given ratio 16:65, so x(1-8/x)⁴ : x[1-(1-8/x)⁴] = 16:65. Solving gives x = 24 litres.",
    category: "general"
  },
  {
    id: 12,
    question: "If 20% of a = b, then b% of 20 is the same as:",
    options: ["4% of a", "5% of a", "20% of a", "None of these"],
    correctAnswer: 0,
    explanation: "20% of a = b, so b = 0.2a. b% of 20 = (b/100) × 20 = 0.2b = 0.2 × 0.2a = 0.04a = 4% of a.",
    category: "general"
  },
  {
    id: 13,
    question: "The compound interest on Rs. 30,000 at 7% per annum is Rs. 4347. The period is:",
    options: ["2 years", "2.5 years", "3 years", "4 years"],
    correctAnswer: 0,
    explanation: "CI = P[(1+r/100)ⁿ - 1]. 4347 = 30000[(1.07)ⁿ - 1]. Solving: (1.07)ⁿ = 1.1449, so n = 2 years.",
    category: "general"
  },
  {
    id: 14,
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "180 metres", "324 metres", "150 metres"],
    correctAnswer: 3,
    explanation: "Speed = 60 km/hr = 60 × 5/18 = 50/3 m/s. Length = Speed × Time = (50/3) × 9 = 150 metres.",
    category: "general"
  },
  {
    id: 15,
    question: "In how many different ways can the letters of the word 'LEADING' be arranged in such a way that the vowels always come together?",
    options: ["720", "520", "700", "360"],
    correctAnswer: 0,
    explanation: "Vowels: E, A, I (3 vowels). Consonants: L, D, N, G (4 consonants). Treat vowels as one unit. Total units = 5. Arrangements = 5! × 3! = 120 × 6 = 720.",
    category: "general"
  },
  {
    id: 16,
    question: "The difference between simple and compound interest on Rs. 1200 for one year at 10% per annum is:",
    options: ["Rs. 0", "Rs. 1", "Rs. 10", "Rs. 12"],
    correctAnswer: 0,
    explanation: "For one year, simple interest and compound interest are always equal. Difference = 0.",
    category: "general"
  },
  {
    id: 17,
    question: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:",
    options: ["Rs. 650", "Rs. 690", "Rs. 698", "Rs. 700"],
    correctAnswer: 2,
    explanation: "SI for 1 year = 854 - 815 = Rs. 39. SI for 3 years = 39 × 3 = Rs. 117. Principal = 815 - 117 = Rs. 698.",
    category: "general"
  },
  {
    id: 18,
    question: "The area of a rectangular plot is 528 m². The length of the plot is one more than twice its breadth. What is the length of the plot in metres?",
    options: ["33", "22", "24", "26"],
    correctAnswer: 0,
    explanation: "Let breadth = x, then length = 2x + 1. Area: x(2x + 1) = 528. Solving: 2x² + x - 528 = 0. x = 16, so length = 33m.",
    category: "general"
  },
  {
    id: 19,
    question: "If the numerator of a fraction is increased by 15% and the denominator is decreased by 8%, the value of the fraction becomes 15/16. What is the original fraction?",
    options: ["3/4", "2/3", "4/5", "5/6"],
    correctAnswer: 0,
    explanation: "Let original fraction be x/y. (1.15x)/(0.92y) = 15/16. Solving: x/y = (15×0.92)/(16×1.15) = 3/4.",
    category: "general"
  },
  {
    id: 20,
    question: "A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour?",
    options: ["7.2 km/hr", "8.4 km/hr", "10 km/hr", "12 km/hr"],
    correctAnswer: 0,
    explanation: "Speed = 600m/5min = 120 m/min = 120×60/1000 = 7.2 km/hr.",
    category: "general"
  },
  // Verbal & Reasoning Questions (20 total) - Placement Focused
  {
    id: 21,
    question: "Choose the word that is most similar in meaning to 'METICULOUS':",
    options: ["Careless", "Thorough", "Quick", "Lazy"],
    correctAnswer: 1,
    explanation: "Meticulous means showing great attention to detail; being very careful and precise. Thorough is the closest synonym.",
    category: "verbal-reasoning"
  },
  {
    id: 22,
    question: "Find the odd one out: Optimistic, Hopeful, Confident, Pessimistic",
    options: ["Optimistic", "Hopeful", "Confident", "Pessimistic"],
    correctAnswer: 3,
    explanation: "Pessimistic has a negative connotation while the others (optimistic, hopeful, confident) are positive traits.",
    category: "verbal-reasoning"
  },
  {
    id: 23,
    question: "Complete the analogy: BOOK : READ :: MUSIC : ?",
    options: ["Hear", "Listen", "Sound", "Play"],
    correctAnswer: 1,
    explanation: "A book is meant to be read, similarly music is meant to be listened to.",
    category: "verbal-reasoning"
  },
  {
    id: 24,
    question: "If MONDAY is coded as ONMYAD, how will FRIDAY be coded?",
    options: ["RFDYAI", "RFYDAI", "RIFYAD", "RIFDAY"],
    correctAnswer: 1,
    explanation: "The pattern is: 1st and 2nd letters swap, 3rd and 4th letters swap, 5th and 6th letters swap. FRIDAY → FR-ID-AY → RF-YD-AI = RFYDAI.",
    category: "verbal-reasoning"
  },
  {
    id: 25,
    question: "Choose the correct spelling:",
    options: ["Accomodate", "Accommodate", "Acomodate", "Acommodate"],
    correctAnswer: 1,
    explanation: "The correct spelling is 'Accommodate' with double 'c' and double 'm'.",
    category: "verbal-reasoning"
  },
  {
    id: 26,
    question: "What comes next in the series: Z, Y, X, W, V, ?",
    options: ["U", "T", "S", "R"],
    correctAnswer: 0,
    explanation: "The series is in reverse alphabetical order: Z, Y, X, W, V, U.",
    category: "verbal-reasoning"
  },
  {
    id: 27,
    question: "Choose the word that best completes the sentence: 'His _____ remarks offended everyone at the meeting.'",
    options: ["tactful", "diplomatic", "tactless", "polite"],
    correctAnswer: 2,
    explanation: "Tactless means lacking sensitivity in dealing with others, which would offend people.",
    category: "verbal-reasoning"
  },
  {
    id: 28,
    question: "Find the antonym of 'ENHANCE':",
    options: ["Improve", "Diminish", "Strengthen", "Amplify"],
    correctAnswer: 1,
    explanation: "Enhance means to improve or increase. Diminish means to reduce or lessen, making it the antonym.",
    category: "verbal-reasoning"
  },
  {
    id: 29,
    question: "Complete the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    explanation: "Pattern: n(n+1) where n = 1,2,3,4,5,6. Next term = 6×7 = 42.",
    category: "verbal-reasoning"
  },
  {
    id: 30,
    question: "If 'LEADER' is written as 'AELDER', how is 'FRIEND' written?",
    options: ["RFINED", "RFIEDN", "RFIEND", "IRFEND"],
    correctAnswer: 0,
    explanation: "The pattern moves the first letter to the second position: LEADER → AELDER, FRIEND → RFINED.",
    category: "verbal-reasoning"
  },
  {
    id: 31,
    question: "Choose the grammatically correct sentence:",
    options: ["Neither of the students were present", "Neither of the students was present", "Neither of the student were present", "Neither of the student was present"],
    correctAnswer: 1,
    explanation: "'Neither' is singular and takes a singular verb 'was'. 'Students' is correct plural form.",
    category: "verbal-reasoning"
  },
  {
    id: 32,
    question: "What is the meaning of the idiom 'Break the ice'?",
    options: ["To be very cold", "To start a conversation", "To break something", "To be angry"],
    correctAnswer: 1,
    explanation: "'Break the ice' means to initiate conversation or interaction, especially in an awkward situation.",
    category: "verbal-reasoning"
  },
  {
    id: 33,
    question: "Find the missing number: 1, 4, 9, 16, 25, ?",
    options: ["30", "35", "36", "49"],
    correctAnswer: 2,
    explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6² = 36.",
    category: "verbal-reasoning"
  },
  {
    id: 34,
    question: "Choose the word that doesn't belong: Honest, Sincere, Truthful, Deceptive",
    options: ["Honest", "Sincere", "Truthful", "Deceptive"],
    correctAnswer: 3,
    explanation: "Deceptive means misleading or dishonest, while the others relate to honesty and truthfulness.",
    category: "verbal-reasoning"
  },
  {
    id: 35,
    question: "Complete the analogy: DOCTOR : HOSPITAL :: TEACHER : ?",
    options: ["Student", "School", "Book", "Education"],
    correctAnswer: 1,
    explanation: "A doctor works in a hospital, similarly a teacher works in a school.",
    category: "verbal-reasoning"
  },
  {
    id: 36,
    question: "If all roses are flowers and some flowers are red, which conclusion is correct?",
    options: ["All roses are red", "Some roses are red", "No roses are red", "Cannot be determined"],
    correctAnswer: 3,
    explanation: "We cannot determine the color of roses from the given information. Some roses might be red, but it's not certain.",
    category: "verbal-reasoning"
  },
  {
    id: 37,
    question: "Choose the correctly punctuated sentence:",
    options: ["Let's eat, grandma!", "Let's eat grandma!", "Lets eat, grandma!", "Lets eat grandma!"],
    correctAnswer: 0,
    explanation: "The comma makes the difference between inviting grandma to eat vs. eating grandma. Also, 'Let's' needs an apostrophe.",
    category: "verbal-reasoning"
  },
  {
    id: 38,
    question: "What comes next: Monday, Wednesday, Friday, ?",
    options: ["Saturday", "Sunday", "Tuesday", "Thursday"],
    correctAnswer: 1,
    explanation: "The pattern skips one day each time: Monday (skip Tuesday), Wednesday (skip Thursday), Friday (skip Saturday), Sunday.",
    category: "verbal-reasoning"
  },
  {
    id: 39,
    question: "Choose the word closest in meaning to 'UBIQUITOUS':",
    options: ["Rare", "Everywhere", "Hidden", "Unique"],
    correctAnswer: 1,
    explanation: "Ubiquitous means present, appearing, or found everywhere; omnipresent.",
    category: "verbal-reasoning"
  },
  {
    id: 40,
    question: "If in a code language, 'COMPUTER' is written as 'PMOCUTER', how is 'SCIENCE' written?",
    options: ["ECNEICS", "NEICECS", "CNEICES", "EICENCS"],
    correctAnswer: 0,
    explanation: "The word is simply reversed: COMPUTER → RETUPMOC (but shown as PMOCUTER in question, so SCIENCE → ECNEICS).",
    category: "verbal-reasoning"
  },

  // Current Affairs & GK Questions (20 total)
  {
    id: 41,
    question: "Who is known as the 'Father of Indian Constitution'?",
    options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
    correctAnswer: 1,
    explanation: "Dr. B.R. Ambedkar is known as the Father of Indian Constitution for his role in drafting it.",
    category: "current-affairs"
  },
  {
    id: 42,
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface.",
    category: "current-affairs"
  },
  {
    id: 43,
    question: "The capital of Australia is:",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: 2,
    explanation: "Canberra is the capital city of Australia, not Sydney or Melbourne.",
    category: "current-affairs"
  },
  {
    id: 44,
    question: "Who wrote the national anthem of India?",
    options: ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Sarojini Naidu", "Subhas Chandra Bose"],
    correctAnswer: 0,
    explanation: "Jana Gana Mana was written by Rabindranath Tagore.",
    category: "current-affairs"
  },
  {
    id: 45,
    question: "The largest ocean in the world is:",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    explanation: "Pacific Ocean is the largest ocean covering about 46% of the world's water surface.",
    category: "current-affairs"
  },
  {
    id: 46,
    question: "Which gas is most abundant in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: 2,
    explanation: "Nitrogen makes up about 78% of Earth's atmosphere.",
    category: "current-affairs"
  },
  {
    id: 47,
    question: "The first President of India was:",
    options: ["Dr. Rajendra Prasad", "Dr. S. Radhakrishnan", "Dr. A.P.J. Abdul Kalam", "Dr. Zakir Hussain"],
    correctAnswer: 0,
    explanation: "Dr. Rajendra Prasad was the first President of India (1950-1962).",
    category: "current-affairs"
  },
  {
    id: 48,
    question: "Which country has the most time zones?",
    options: ["Russia", "USA", "China", "Canada"],
    correctAnswer: 0,
    explanation: "Russia has 11 time zones, the most of any country.",
    category: "current-affairs"
  },
  {
    id: 49,
    question: "The currency of Japan is:",
    options: ["Yuan", "Won", "Yen", "Ringgit"],
    correctAnswer: 2,
    explanation: "The Japanese currency is Yen.",
    category: "current-affairs"
  },
  {
    id: 50,
    question: "Mount Everest is located in:",
    options: ["Nepal", "India", "Tibet", "Nepal-Tibet border"],
    correctAnswer: 3,
    explanation: "Mount Everest is located on the border between Nepal and Tibet (China).",
    category: "current-affairs"
  },
  {
    id: 51,
    question: "The smallest country in the world is:",
    options: ["Monaco", "Nauru", "Vatican City", "San Marino"],
    correctAnswer: 2,
    explanation: "Vatican City is the smallest country in the world with an area of 0.17 square miles.",
    category: "current-affairs"
  },
  {
    id: 52,
    question: "Who invented the telephone?",
    options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Benjamin Franklin"],
    correctAnswer: 1,
    explanation: "Alexander Graham Bell is credited with inventing the telephone in 1876.",
    category: "current-affairs"
  },
  {
    id: 53,
    question: "The Great Wall of China was built to protect against invasions from:",
    options: ["South", "East", "West", "North"],
    correctAnswer: 3,
    explanation: "The Great Wall was built to protect against invasions from northern nomadic tribes.",
    category: "current-affairs"
  },
  {
    id: 54,
    question: "Which vitamin is produced when skin is exposed to sunlight?",
    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    correctAnswer: 3,
    explanation: "Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight.",
    category: "current-affairs"
  },
  {
    id: 55,
    question: "The study of earthquakes is called:",
    options: ["Geology", "Seismology", "Meteorology", "Volcanology"],
    correctAnswer: 1,
    explanation: "Seismology is the scientific study of earthquakes and seismic waves.",
    category: "current-affairs"
  },
  {
    id: 56,
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Aluminum", "Gold", "Argon"],
    correctAnswer: 2,
    explanation: "Au is the chemical symbol for Gold (from Latin 'aurum').",
    category: "current-affairs"
  },
  {
    id: 57,
    question: "The longest river in the world is:",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    correctAnswer: 1,
    explanation: "The Nile River is traditionally considered the longest river in the world at 6,650 km.",
    category: "current-affairs"
  },
  {
    id: 58,
    question: "Which organ in the human body produces insulin?",
    options: ["Liver", "Kidney", "Pancreas", "Heart"],
    correctAnswer: 2,
    explanation: "The pancreas produces insulin, which regulates blood sugar levels.",
    category: "current-affairs"
  },
  {
    id: 59,
    question: "The speed of light in vacuum is approximately:",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
    correctAnswer: 0,
    explanation: "The speed of light in vacuum is approximately 299,792,458 m/s or about 300,000 km/s.",
    category: "current-affairs"
  },
  {
    id: 60,
    question: "Which programming language was developed by James Gosling?",
    options: ["Python", "Java", "C++", "JavaScript"],
    correctAnswer: 1,
    explanation: "Java was developed by James Gosling at Sun Microsystems in the 1990s.",
    category: "current-affairs"
  },

  // Technical MCQs Questions (20 total)
  {
    id: 61,
    question: "What does HTTP stand for?",
    options: ["Hyper Text Transfer Protocol", "High Tech Transfer Protocol", "Hyper Transfer Text Protocol", "Home Tool Transfer Protocol"],
    correctAnswer: 0,
    explanation: "HTTP stands for Hyper Text Transfer Protocol, used for transferring web pages.",
    category: "technical-mcqs"
  },
  {
    id: 62,
    question: "Which of the following is a NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
    correctAnswer: 2,
    explanation: "MongoDB is a NoSQL (document-based) database, while others are relational databases.",
    category: "technical-mcqs"
  },
  {
    id: 63,
    question: "What is the default port number for HTTPS?",
    options: ["80", "443", "8080", "21"],
    correctAnswer: 1,
    explanation: "HTTPS uses port 443 by default, while HTTP uses port 80.",
    category: "technical-mcqs"
  },
  {
    id: 64,
    question: "Which data structure follows LIFO principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation: "Stack follows Last In First Out (LIFO) principle.",
    category: "technical-mcqs"
  },
  {
    id: 65,
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
    correctAnswer: 0,
    explanation: "SQL stands for Structured Query Language.",
    category: "technical-mcqs"
  },
  {
    id: 66,
    question: "Which of the following is NOT an operating system?",
    options: ["Windows", "Linux", "Oracle", "macOS"],
    correctAnswer: 2,
    explanation: "Oracle is a database management system, not an operating system.",
    category: "technical-mcqs"
  },
  {
    id: 67,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search has O(log n) time complexity as it divides search space in half each time.",
    category: "technical-mcqs"
  },
  {
    id: 68,
    question: "Which protocol is used for sending emails?",
    options: ["HTTP", "FTP", "SMTP", "TCP"],
    correctAnswer: 2,
    explanation: "SMTP (Simple Mail Transfer Protocol) is used for sending emails.",
    category: "technical-mcqs"
  },
  {
    id: 69,
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Advanced Programming Interface", "Application Process Interface", "Automated Programming Interface"],
    correctAnswer: 0,
    explanation: "API stands for Application Programming Interface.",
    category: "technical-mcqs"
  },
  {
    id: 70,
    question: "Which of the following is a version control system?",
    options: ["Git", "Docker", "Jenkins", "Maven"],
    correctAnswer: 0,
    explanation: "Git is a distributed version control system for tracking changes in source code.",
    category: "technical-mcqs"
  },
  {
    id: 71,
    question: "What is the full form of RAM?",
    options: ["Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Real Access Memory"],
    correctAnswer: 0,
    explanation: "RAM stands for Random Access Memory.",
    category: "technical-mcqs"
  },
  {
    id: 72,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
    correctAnswer: 2,
    explanation: "Merge Sort has O(n log n) average-case time complexity, which is optimal for comparison-based sorting.",
    category: "technical-mcqs"
  },
  {
    id: 73,
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    correctAnswer: 1,
    explanation: "CSS stands for Cascading Style Sheets.",
    category: "technical-mcqs"
  },
  {
    id: 74,
    question: "Which of the following is NOT a programming paradigm?",
    options: ["Object-Oriented", "Functional", "Procedural", "Relational"],
    correctAnswer: 3,
    explanation: "Relational is a database model, not a programming paradigm.",
    category: "technical-mcqs"
  },
  {
    id: 75,
    question: "What is the default port for SSH?",
    options: ["21", "22", "23", "25"],
    correctAnswer: 1,
    explanation: "SSH (Secure Shell) uses port 22 by default.",
    category: "technical-mcqs"
  },
  {
    id: 76,
    question: "Which data structure is used for BFS traversal?",
    options: ["Stack", "Queue", "Array", "Tree"],
    correctAnswer: 1,
    explanation: "Queue is used for Breadth-First Search (BFS) traversal.",
    category: "technical-mcqs"
  },
  {
    id: 77,
    question: "What does JSON stand for?",
    options: ["JavaScript Object Notation", "Java Standard Object Notation", "JavaScript Oriented Notation", "Java Serialized Object Notation"],
    correctAnswer: 0,
    explanation: "JSON stands for JavaScript Object Notation.",
    category: "technical-mcqs"
  },
  {
    id: 78,
    question: "Which of the following is a cloud computing platform?",
    options: ["AWS", "MySQL", "Apache", "Linux"],
    correctAnswer: 0,
    explanation: "AWS (Amazon Web Services) is a cloud computing platform.",
    category: "technical-mcqs"
  },
  {
    id: 79,
    question: "What is the purpose of DNS?",
    options: ["Data encryption", "Domain name resolution", "Database management", "Device networking"],
    correctAnswer: 1,
    explanation: "DNS (Domain Name System) resolves domain names to IP addresses.",
    category: "technical-mcqs"
  },
  {
    id: 80,
    question: "Which of the following is NOT a web browser?",
    options: ["Chrome", "Firefox", "Safari", "Apache"],
    correctAnswer: 3,
    explanation: "Apache is a web server software, not a web browser.",
    category: "technical-mcqs"
  },

  // Interview Questions (20 total)
  {
    id: 81,
    question: "Tell me about yourself - What should you focus on?",
    options: ["Personal life details", "Professional background and skills", "Family background", "Hobbies only"],
    correctAnswer: 1,
    explanation: "Focus on professional background, relevant skills, and career achievements.",
    category: "interview"
  },
  {
    id: 82,
    question: "What is your greatest weakness?",
    options: ["I work too hard", "I'm a perfectionist", "I'm learning time management skills", "I have no weaknesses"],
    correctAnswer: 2,
    explanation: "Show self-awareness and mention how you're actively working to improve.",
    category: "interview"
  },
  {
    id: 83,
    question: "Why do you want to work here?",
    options: ["For money", "It's close to home", "Company's mission aligns with my values", "Any job is fine"],
    correctAnswer: 2,
    explanation: "Show genuine interest in the company's mission, values, and growth opportunities.",
    category: "interview"
  },
  {
    id: 84,
    question: "Where do you see yourself in 5 years?",
    options: ["I don't know", "In your position", "Leading a team and contributing to company growth", "Retired"],
    correctAnswer: 2,
    explanation: "Show ambition and alignment with potential career growth at the company.",
    category: "interview"
  },
  {
    id: 85,
    question: "Why are you leaving your current job?",
    options: ["My boss is terrible", "I hate my colleagues", "Seeking new challenges and growth opportunities", "The work is boring"],
    correctAnswer: 2,
    explanation: "Focus on positive reasons like growth, learning, and new challenges.",
    category: "interview"
  },
  {
    id: 86,
    question: "What are your salary expectations?",
    options: ["As much as possible", "I'll take anything", "Based on market research, I expect X range", "Whatever you offer"],
    correctAnswer: 2,
    explanation: "Research market rates and provide a reasonable range based on your experience.",
    category: "interview"
  },
  {
    id: 87,
    question: "Describe a challenging situation and how you handled it.",
    options: ["I avoid challenges", "Use STAR method to structure response", "Blame others for the challenge", "Say you never faced challenges"],
    correctAnswer: 1,
    explanation: "Use STAR method (Situation, Task, Action, Result) to structure your response.",
    category: "interview"
  },
  {
    id: 88,
    question: "What motivates you?",
    options: ["Money only", "Solving problems and learning new skills", "Easy work", "Flexible hours only"],
    correctAnswer: 1,
    explanation: "Show intrinsic motivation like learning, problem-solving, and making an impact.",
    category: "interview"
  },
  {
    id: 89,
    question: "How do you handle stress and pressure?",
    options: ["I don't get stressed", "I break down under pressure", "I prioritize tasks and stay organized", "I avoid stressful situations"],
    correctAnswer: 2,
    explanation: "Show practical stress management techniques and ability to perform under pressure.",
    category: "interview"
  },
  {
    id: 90,
    question: "What are your strengths?",
    options: ["I'm perfect at everything", "Provide specific examples with evidence", "I don't have any", "Generic qualities"],
    correctAnswer: 1,
    explanation: "Mention specific strengths relevant to the job with concrete examples.",
    category: "interview"
  },
  {
    id: 91,
    question: "Do you have any questions for us?",
    options: ["No questions", "What's the salary?", "About company culture and growth opportunities", "When can I take vacation?"],
    correctAnswer: 2,
    explanation: "Ask thoughtful questions about company culture, role expectations, and growth opportunities.",
    category: "interview"
  },
  {
    id: 92,
    question: "How do you work in a team?",
    options: ["I prefer working alone", "I'm a collaborative team player with examples", "I like to control everything", "Teams slow me down"],
    correctAnswer: 1,
    explanation: "Demonstrate collaboration skills with specific examples of successful teamwork.",
    category: "interview"
  },
  {
    id: 93,
    question: "What is your leadership style?",
    options: ["I'm not a leader", "Authoritarian approach", "Collaborative and supportive leadership", "I avoid leadership roles"],
    correctAnswer: 2,
    explanation: "Describe a collaborative, supportive leadership style with examples.",
    category: "interview"
  },
  {
    id: 94,
    question: "How do you handle criticism?",
    options: ["I don't accept criticism", "I take it personally", "I listen, learn, and improve", "I argue back"],
    correctAnswer: 2,
    explanation: "Show that you're open to feedback and use it for improvement.",
    category: "interview"
  },
  {
    id: 95,
    question: "What makes you unique?",
    options: ["Nothing special", "I'm better than everyone", "Specific combination of skills and experiences", "I don't know"],
    correctAnswer: 2,
    explanation: "Highlight your unique combination of skills, experiences, and perspectives.",
    category: "interview"
  },
  {
    id: 96,
    question: "How do you prioritize your work?",
    options: ["I do whatever comes first", "Use systematic approach like urgency/importance matrix", "I don't prioritize", "Others decide for me"],
    correctAnswer: 1,
    explanation: "Describe systematic approaches like urgency/importance matrix or time management techniques.",
    category: "interview"
  },
  {
    id: 97,
    question: "Describe your ideal work environment.",
    options: ["No work at all", "Collaborative, learning-focused environment", "Complete isolation", "Chaotic environment"],
    correctAnswer: 1,
    explanation: "Describe an environment that promotes collaboration, learning, and productivity.",
    category: "interview"
  },
  {
    id: 98,
    question: "How do you stay updated with industry trends?",
    options: ["I don't need to", "Through continuous learning and professional networks", "I rely on others", "Trends don't matter"],
    correctAnswer: 1,
    explanation: "Show commitment to continuous learning through various channels.",
    category: "interview"
  },
  {
    id: 99,
    question: "What would your previous manager say about you?",
    options: ["They hated me", "Positive qualities with specific examples", "I don't know", "They were wrong about me"],
    correctAnswer: 1,
    explanation: "Mention positive qualities your manager would highlight with specific examples.",
    category: "interview"
  },
  {
    id: 100,
    question: "How do you handle failure?",
    options: ["I never fail", "I blame others", "I learn from mistakes and improve", "I give up"],
    correctAnswer: 2,
    explanation: "Show resilience and ability to learn from failures and setbacks.",
    category: "interview"
  },

  // Programming Language Questions - C (20 total)
  {
    id: 101,
    question: "Which of the following is the correct way to declare a pointer in C?",
    options: ["int ptr;", "int *ptr;", "int &ptr;", "pointer int ptr;"],
    correctAnswer: 1,
    explanation: "In C, pointers are declared using the * operator before the variable name.",
    category: "programming",
    language: "c"
  },
  {
    id: 102,
    question: "What is the size of int data type in C (on most systems)?",
    options: ["2 bytes", "4 bytes", "8 bytes", "1 byte"],
    correctAnswer: 1,
    explanation: "On most modern systems, int is 4 bytes (32 bits).",
    category: "programming",
    language: "c"
  },
  {
    id: 103,
    question: "Which function is used to allocate memory dynamically in C?",
    options: ["alloc()", "malloc()", "new()", "create()"],
    correctAnswer: 1,
    explanation: "malloc() function is used for dynamic memory allocation in C.",
    category: "programming",
    language: "c"
  },
  {
    id: 104,
    question: "What does the 'static' keyword do in C?",
    options: ["Makes variable global", "Preserves variable value between function calls", "Makes variable constant", "Allocates memory"],
    correctAnswer: 1,
    explanation: "Static keyword preserves the variable's value between function calls and limits scope to the file.",
    category: "programming",
    language: "c"
  },
  {
    id: 105,
    question: "Which header file is required for printf() function?",
    options: ["<stdlib.h>", "<stdio.h>", "<string.h>", "<math.h>"],
    correctAnswer: 1,
    explanation: "stdio.h header file contains the declaration for printf() function.",
    category: "programming",
    language: "c"
  },
  {
    id: 106,
    question: "What is the correct syntax for a for loop in C?",
    options: ["for(init; condition; increment)", "for(condition; init; increment)", "for(increment; condition; init)", "for(init; increment; condition)"],
    correctAnswer: 0,
    explanation: "The correct syntax is for(initialization; condition; increment/decrement).",
    category: "programming",
    language: "c"
  },
  {
    id: 107,
    question: "Which operator is used to access the value at the address stored in a pointer?",
    options: ["&", "*", "->", "."],
    correctAnswer: 1,
    explanation: "The * operator (dereference operator) is used to access the value at the address stored in a pointer.",
    category: "programming",
    language: "c"
  },
  {
    id: 108,
    question: "What is the return type of main() function in C?",
    options: ["void", "int", "char", "float"],
    correctAnswer: 1,
    explanation: "The main() function should return int to indicate the program's exit status.",
    category: "programming",
    language: "c"
  },
  {
    id: 109,
    question: "Which of the following is NOT a valid C data type?",
    options: ["int", "float", "boolean", "char"],
    correctAnswer: 2,
    explanation: "C doesn't have a built-in boolean data type (though C99 introduced _Bool).",
    category: "programming",
    language: "c"
  },
  {
    id: 110,
    question: "What does the 'const' keyword do in C?",
    options: ["Makes variable global", "Makes variable unchangeable", "Allocates memory", "Defines a macro"],
    correctAnswer: 1,
    explanation: "The const keyword makes a variable read-only (unchangeable after initialization).",
    category: "programming",
    language: "c"
  },
  {
    id: 111,
    question: "Which function is used to free dynamically allocated memory?",
    options: ["delete()", "free()", "remove()", "clear()"],
    correctAnswer: 1,
    explanation: "free() function is used to deallocate memory that was allocated by malloc(), calloc(), or realloc().",
    category: "programming",
    language: "c"
  },
  {
    id: 112,
    question: "What is the difference between '++i' and 'i++'?",
    options: ["No difference", "++i increments before use, i++ increments after use", "++i is faster", "i++ is faster"],
    correctAnswer: 1,
    explanation: "++i (pre-increment) increments the value before using it, i++ (post-increment) uses the value then increments.",
    category: "programming",
    language: "c"
  },
  {
    id: 113,
    question: "Which of the following is the correct way to include a user-defined header file?",
    options: ["<myheader.h>", "\"myheader.h\"", "#myheader.h", "include myheader.h"],
    correctAnswer: 1,
    explanation: "User-defined header files are included using double quotes: \"myheader.h\".",
    category: "programming",
    language: "c"
  },
  {
    id: 114,
    question: "What is the purpose of the 'break' statement?",
    options: ["Exit the program", "Exit the current loop or switch", "Skip current iteration", "Pause execution"],
    correctAnswer: 1,
    explanation: "The break statement is used to exit the current loop or switch statement.",
    category: "programming",
    language: "c"
  },
  {
    id: 115,
    question: "Which of the following is the correct way to declare an array in C?",
    options: ["int arr[];", "int arr[10];", "array int arr[10];", "int [10]arr;"],
    correctAnswer: 1,
    explanation: "Arrays are declared as: datatype arrayname[size]; e.g., int arr[10];",
    category: "programming",
    language: "c"
  },
  {
    id: 116,
    question: "What does the 'sizeof' operator return?",
    options: ["Address of variable", "Value of variable", "Size in bytes", "Type of variable"],
    correctAnswer: 2,
    explanation: "The sizeof operator returns the size of a data type or variable in bytes.",
    category: "programming",
    language: "c"
  },
  {
    id: 117,
    question: "Which of the following is a valid comment in C?",
    options: ["// This is a comment", "/* This is a comment */", "# This is a comment", "Both A and B"],
    correctAnswer: 3,
    explanation: "C supports both // (single-line) and /* */ (multi-line) comments.",
    category: "programming",
    language: "c"
  },
  {
    id: 118,
    question: "What is the default value of uninitialized local variables in C?",
    options: ["0", "NULL", "Garbage value", "-1"],
    correctAnswer: 2,
    explanation: "Uninitialized local variables contain garbage values (unpredictable values).",
    category: "programming",
    language: "c"
  },
  {
    id: 119,
    question: "Which function is used to compare two strings in C?",
    options: ["compare()", "strcmp()", "strcomp()", "equals()"],
    correctAnswer: 1,
    explanation: "strcmp() function from string.h is used to compare two strings in C.",
    category: "programming",
    language: "c"
  },
  {
    id: 120,
    question: "What is the correct way to define a macro in C?",
    options: ["#define PI 3.14", "define PI 3.14", "#macro PI 3.14", "const PI 3.14"],
    correctAnswer: 0,
    explanation: "Macros are defined using #define directive: #define MACRO_NAME value",
    category: "programming",
    language: "c"
  },

  // Programming Language Questions - C++ (20 total)
  {
    id: 121,
    question: "Which of the following is NOT a feature of C++?",
    options: ["Object-Oriented Programming", "Function Overloading", "Automatic Garbage Collection", "Operator Overloading"],
    correctAnswer: 2,
    explanation: "C++ does not have automatic garbage collection; memory management is manual.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 122,
    question: "What is the correct way to declare a class in C++?",
    options: ["class MyClass {}", "Class MyClass {}", "define class MyClass {}", "struct class MyClass {}"],
    correctAnswer: 0,
    explanation: "Classes in C++ are declared using the 'class' keyword followed by the class name and braces.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 123,
    question: "Which operator is used for dynamic memory allocation in C++?",
    options: ["malloc", "new", "alloc", "create"],
    correctAnswer: 1,
    explanation: "The 'new' operator is used for dynamic memory allocation in C++.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 124,
    question: "What is a constructor in C++?",
    options: ["A function that destroys objects", "A special function called when object is created", "A data member", "A friend function"],
    correctAnswer: 1,
    explanation: "A constructor is a special member function that is called automatically when an object is created.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 125,
    question: "Which access specifier makes members accessible only within the class?",
    options: ["public", "private", "protected", "internal"],
    correctAnswer: 1,
    explanation: "Private members are accessible only within the same class.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 126,
    question: "What is function overloading in C++?",
    options: ["Calling multiple functions", "Having multiple functions with same name but different parameters", "Inheriting functions", "Virtual functions"],
    correctAnswer: 1,
    explanation: "Function overloading allows multiple functions with the same name but different parameter lists.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 127,
    question: "Which header file is required for cout and cin?",
    options: ["<stdio.h>", "<iostream>", "<conio.h>", "<stdlib.h>"],
    correctAnswer: 1,
    explanation: "The <iostream> header file contains declarations for cout and cin.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 128,
    question: "What is inheritance in C++?",
    options: ["Creating new objects", "Acquiring properties of another class", "Destroying objects", "Overloading operators"],
    correctAnswer: 1,
    explanation: "Inheritance allows a class to acquire properties and methods of another class.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 129,
    question: "Which operator is used to access members of a class through an object?",
    options: ["->", ".", "::", "&"],
    correctAnswer: 1,
    explanation: "The dot (.) operator is used to access members of a class through an object.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 130,
    question: "What is a virtual function in C++?",
    options: ["A function that doesn't exist", "A function that can be overridden in derived classes", "A static function", "A friend function"],
    correctAnswer: 1,
    explanation: "A virtual function can be overridden in derived classes to achieve runtime polymorphism.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 131,
    question: "Which operator is used to deallocate memory in C++?",
    options: ["free", "delete", "remove", "clear"],
    correctAnswer: 1,
    explanation: "The 'delete' operator is used to deallocate memory allocated with 'new'.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 132,
    question: "What is the scope resolution operator in C++?",
    options: [".", "->", "::", "&"],
    correctAnswer: 2,
    explanation: "The scope resolution operator (::) is used to access global variables or class members.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 133,
    question: "Which of the following is true about destructors?",
    options: ["They have parameters", "They can be overloaded", "They are called when object is destroyed", "They return values"],
    correctAnswer: 2,
    explanation: "Destructors are called automatically when an object is destroyed or goes out of scope.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 134,
    question: "What is encapsulation in C++?",
    options: ["Hiding implementation details", "Creating multiple objects", "Inheriting properties", "Overloading functions"],
    correctAnswer: 0,
    explanation: "Encapsulation is the concept of hiding implementation details and exposing only necessary interfaces.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 135,
    question: "Which of the following is the correct syntax for a reference in C++?",
    options: ["int &ref = var;", "int *ref = var;", "int ref& = var;", "reference int ref = var;"],
    correctAnswer: 0,
    explanation: "References are declared using & after the data type: int &ref = var;",
    category: "programming",
    language: "cpp"
  },
  {
    id: 136,
    question: "What is polymorphism in C++?",
    options: ["Having multiple forms", "Creating objects", "Destroying objects", "Allocating memory"],
    correctAnswer: 0,
    explanation: "Polymorphism allows objects of different types to be treated as objects of a common base type.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 137,
    question: "Which keyword is used to prevent inheritance of a class?",
    options: ["static", "final", "sealed", "const"],
    correctAnswer: 1,
    explanation: "The 'final' keyword (C++11) prevents a class from being inherited.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 138,
    question: "What is a friend function in C++?",
    options: ["A member function", "A function that can access private members", "A virtual function", "A static function"],
    correctAnswer: 1,
    explanation: "A friend function can access private and protected members of a class.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 139,
    question: "Which of the following is true about inline functions?",
    options: ["They are always faster", "Compiler may ignore inline request", "They must be virtual", "They cannot have parameters"],
    correctAnswer: 1,
    explanation: "The inline keyword is a request to the compiler, which may ignore it based on various factors.",
    category: "programming",
    language: "cpp"
  },
  {
    id: 140,
    question: "What is the default access specifier for class members in C++?",
    options: ["public", "private", "protected", "internal"],
    correctAnswer: 1,
    explanation: "Class members are private by default in C++.",
    category: "programming",
    language: "cpp"
  },

  // Programming Language Questions - Java (20 total)
  {
    id: 141,
    question: "Which of the following is the correct way to declare a main method in Java?",
    options: ["public static void main(String args[])", "static public void main(String[] args)", "public static void main(String[] args)", "All of the above"],
    correctAnswer: 3,
    explanation: "All three declarations are valid in Java. The order of public and static can be interchanged.",
    category: "programming",
    language: "java"
  },
  {
    id: 142,
    question: "What is the size of int data type in Java?",
    options: ["2 bytes", "4 bytes", "8 bytes", "Platform dependent"],
    correctAnswer: 1,
    explanation: "In Java, int is always 4 bytes (32 bits) regardless of the platform.",
    category: "programming",
    language: "java"
  },
  {
    id: 143,
    question: "Which of the following is NOT a Java keyword?",
    options: ["static", "Boolean", "void", "private"],
    correctAnswer: 1,
    explanation: "Boolean (with capital B) is not a keyword. The primitive type is 'boolean' (lowercase).",
    category: "programming",
    language: "java"
  },
  {
    id: 144,
    question: "What is the default value of boolean variable in Java?",
    options: ["true", "false", "0", "null"],
    correctAnswer: 1,
    explanation: "The default value of boolean variables in Java is false.",
    category: "programming",
    language: "java"
  },
  {
    id: 145,
    question: "Which method is used to start a thread in Java?",
    options: ["run()", "start()", "init()", "resume()"],
    correctAnswer: 1,
    explanation: "The start() method is used to start a thread, which internally calls the run() method.",
    category: "programming",
    language: "java"
  },
  {
    id: 146,
    question: "What is the correct way to create an object in Java?",
    options: ["MyClass obj = new MyClass();", "MyClass obj = MyClass();", "new MyClass() obj;", "MyClass obj = create MyClass();"],
    correctAnswer: 0,
    explanation: "Objects are created using the 'new' keyword followed by the constructor call.",
    category: "programming",
    language: "java"
  },
  {
    id: 147,
    question: "Which of the following is true about Java?",
    options: ["Java is platform dependent", "Java supports multiple inheritance", "Java is compiled to bytecode", "Java has pointers"],
    correctAnswer: 2,
    explanation: "Java source code is compiled to bytecode which runs on the Java Virtual Machine (JVM).",
    category: "programming",
    language: "java"
  },
  {
    id: 148,
    question: "What is the parent class of all classes in Java?",
    options: ["String", "Class", "Object", "System"],
    correctAnswer: 2,
    explanation: "Object class is the parent class of all classes in Java.",
    category: "programming",
    language: "java"
  },
  {
    id: 149,
    question: "Which access modifier makes a member accessible within the same package?",
    options: ["private", "protected", "public", "default (package-private)"],
    correctAnswer: 3,
    explanation: "Default (no modifier) access makes members accessible within the same package.",
    category: "programming",
    language: "java"
  },
  {
    id: 150,
    question: "What is the correct way to handle exceptions in Java?",
    options: ["try-catch", "if-else", "switch-case", "for-loop"],
    correctAnswer: 0,
    explanation: "Exceptions in Java are handled using try-catch blocks.",
    category: "programming",
    language: "java"
  },
  {
    id: 151,
    question: "Which of the following is used to achieve multiple inheritance in Java?",
    options: ["Classes", "Interfaces", "Abstract classes", "Final classes"],
    correctAnswer: 1,
    explanation: "Java achieves multiple inheritance through interfaces, not classes.",
    category: "programming",
    language: "java"
  },
  {
    id: 152,
    question: "What is the difference between == and equals() in Java?",
    options: ["No difference", "== compares references, equals() compares content", "== compares content, equals() compares references", "Both compare content"],
    correctAnswer: 1,
    explanation: "== compares object references (memory addresses), while equals() compares object content.",
    category: "programming",
    language: "java"
  },
  {
    id: 153,
    question: "Which collection class allows duplicate elements in Java?",
    options: ["Set", "HashSet", "ArrayList", "TreeSet"],
    correctAnswer: 2,
    explanation: "ArrayList allows duplicate elements, while Set implementations do not.",
    category: "programming",
    language: "java"
  },
  {
    id: 154,
    question: "What is the correct way to declare a constant in Java?",
    options: ["const int x = 10;", "final int x = 10;", "static int x = 10;", "readonly int x = 10;"],
    correctAnswer: 1,
    explanation: "Constants in Java are declared using the 'final' keyword.",
    category: "programming",
    language: "java"
  },
  {
    id: 155,
    question: "Which method is called when an object is garbage collected?",
    options: ["finalize()", "delete()", "destroy()", "cleanup()"],
    correctAnswer: 0,
    explanation: "The finalize() method is called by the garbage collector before an object is destroyed.",
    category: "programming",
    language: "java"
  },
  {
    id: 156,
    question: "What is a constructor in Java?",
    options: ["A method that returns a value", "A special method to initialize objects", "A method to destroy objects", "A static method"],
    correctAnswer: 1,
    explanation: "A constructor is a special method used to initialize objects when they are created.",
    category: "programming",
    language: "java"
  },
  {
    id: 157,
    question: "Which keyword is used to inherit a class in Java?",
    options: ["inherits", "extends", "implements", "super"],
    correctAnswer: 1,
    explanation: "The 'extends' keyword is used for class inheritance in Java.",
    category: "programming",
    language: "java"
  },
  {
    id: 158,
    question: "What is the correct syntax for a for-each loop in Java?",
    options: ["for(int i : array)", "foreach(int i in array)", "for(int i in array)", "for each(int i : array)"],
    correctAnswer: 0,
    explanation: "The enhanced for loop (for-each) syntax is: for(datatype variable : collection)",
    category: "programming",
    language: "java"
  },
  {
    id: 159,
    question: "Which of the following is true about static methods?",
    options: ["They can access instance variables", "They belong to the class, not instances", "They can be overridden", "They require an object to be called"],
    correctAnswer: 1,
    explanation: "Static methods belong to the class and can be called without creating an instance.",
    category: "programming",
    language: "java"
  },
  {
    id: 160,
    question: "What is the purpose of the 'this' keyword in Java?",
    options: ["Refers to parent class", "Refers to current object", "Refers to static variables", "Refers to local variables"],
    correctAnswer: 1,
    explanation: "The 'this' keyword refers to the current object instance.",
    category: "programming",
    language: "java"
  },

  // Programming Language Questions - Python (20 total)
  {
    id: 161,
    question: "Which of the following is the correct way to define a function in Python?",
    options: ["function myFunc():", "def myFunc():", "define myFunc():", "func myFunc():"],
    correctAnswer: 1,
    explanation: "Functions in Python are defined using the 'def' keyword.",
    category: "programming",
    language: "python"
  },
  {
    id: 162,
    question: "What is the correct way to create a list in Python?",
    options: ["list = [1, 2, 3]", "list = (1, 2, 3)", "list = {1, 2, 3}", "list = <1, 2, 3>"],
    correctAnswer: 0,
    explanation: "Lists in Python are created using square brackets [].",
    category: "programming",
    language: "python"
  },
  {
    id: 163,
    question: "Which of the following is used for comments in Python?",
    options: ["//", "/* */", "#", "<!-- -->"],
    correctAnswer: 2,
    explanation: "Single-line comments in Python start with the # symbol.",
    category: "programming",
    language: "python"
  },
  {
    id: 164,
    question: "What is the output of print(type([]))?",
    options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"],
    correctAnswer: 1,
    explanation: "[] creates an empty list, so type([]) returns <class 'list'>.",
    category: "programming",
    language: "python"
  },
  {
    id: 165,
    question: "Which method is used to add an element to the end of a list?",
    options: ["add()", "append()", "insert()", "push()"],
    correctAnswer: 1,
    explanation: "The append() method adds an element to the end of a list in Python.",
    category: "programming",
    language: "python"
  },
  {
    id: 166,
    question: "What is the correct way to import a module in Python?",
    options: ["include module", "import module", "require module", "using module"],
    correctAnswer: 1,
    explanation: "Modules are imported using the 'import' keyword in Python.",
    category: "programming",
    language: "python"
  },
  {
    id: 167,
    question: "Which of the following is a mutable data type in Python?",
    options: ["tuple", "string", "list", "int"],
    correctAnswer: 2,
    explanation: "Lists are mutable in Python, meaning they can be modified after creation.",
    category: "programming",
    language: "python"
  },
  {
    id: 168,
    question: "What is the correct syntax for a dictionary in Python?",
    options: ["{key: value}", "[key: value]", "(key: value)", "<key: value>"],
    correctAnswer: 0,
    explanation: "Dictionaries in Python are created using curly braces {} with key:value pairs.",
    category: "programming",
    language: "python"
  },
  {
    id: 169,
    question: "Which keyword is used to define a class in Python?",
    options: ["class", "Class", "define", "object"],
    correctAnswer: 0,
    explanation: "Classes in Python are defined using the 'class' keyword.",
    category: "programming",
    language: "python"
  },
  {
    id: 170,
    question: "What is the output of print(3 ** 2)?",
    options: ["6", "9", "32", "Error"],
    correctAnswer: 1,
    explanation: "The ** operator is used for exponentiation in Python. 3 ** 2 = 3² = 9.",
    category: "programming",
    language: "python"
  },
  {
    id: 171,
    question: "Which method is used to remove an element from a list by index?",
    options: ["remove()", "delete()", "pop()", "clear()"],
    correctAnswer: 2,
    explanation: "The pop() method removes and returns an element at a specific index.",
    category: "programming",
    language: "python"
  },
  {
    id: 172,
    question: "What is the correct way to handle exceptions in Python?",
    options: ["try-catch", "try-except", "catch-throw", "handle-error"],
    correctAnswer: 1,
    explanation: "Python uses try-except blocks for exception handling.",
    category: "programming",
    language: "python"
  },
  {
    id: 173,
    question: "Which of the following is used to create a tuple with one element?",
    options: ["(1)", "(1,)", "[1]", "{1}"],
    correctAnswer: 1,
    explanation: "A tuple with one element requires a trailing comma: (1,)",
    category: "programming",
    language: "python"
  },
  {
    id: 174,
    question: "What is the purpose of the 'self' parameter in Python class methods?",
    options: ["Refers to the class", "Refers to the current instance", "Refers to parent class", "It's optional"],
    correctAnswer: 1,
    explanation: "The 'self' parameter refers to the current instance of the class.",
    category: "programming",
    language: "python"
  },
  {
    id: 175,
    question: "Which function is used to get the length of a list?",
    options: ["length()", "size()", "len()", "count()"],
    correctAnswer: 2,
    explanation: "The len() function returns the length of a sequence in Python.",
    category: "programming",
    language: "python"
  },
  {
    id: 176,
    question: "What is the correct way to create a string in Python?",
    options: ["'Hello' or \"Hello\"", "String('Hello')", "new String('Hello')", "char('Hello')"],
    correctAnswer: 0,
    explanation: "Strings can be created using single quotes ' ' or double quotes \" \" in Python.",
    category: "programming",
    language: "python"
  },
  {
    id: 177,
    question: "Which operator is used for floor division in Python?",
    options: ["/", "//", "%", "**"],
    correctAnswer: 1,
    explanation: "The // operator performs floor division (returns integer result).",
    category: "programming",
    language: "python"
  },
  {
    id: 178,
    question: "What is the output of print(bool([]))?",
    options: ["True", "False", "None", "Error"],
    correctAnswer: 1,
    explanation: "An empty list [] evaluates to False when converted to boolean.",
    category: "programming",
    language: "python"
  },
  {
    id: 179,
    question: "Which method is used to convert a string to lowercase?",
    options: ["toLower()", "lowercase()", "lower()", "downcase()"],
    correctAnswer: 2,
    explanation: "The lower() method converts a string to lowercase in Python.",
    category: "programming",
    language: "python"
  },
  {
    id: 180,
    question: "What is the correct way to iterate over a dictionary's keys?",
    options: ["for key in dict:", "for key in dict.keys():", "Both A and B", "for key of dict:"],
    correctAnswer: 2,
    explanation: "Both 'for key in dict:' and 'for key in dict.keys():' iterate over dictionary keys.",
    category: "programming",
    language: "python"
  },
  // JavaScript Questions
  {
    id: 181,
    question: "Which method is used to add an element to the end of an array in JavaScript?",
    options: ["push()", "add()", "append()", "insert()"],
    correctAnswer: 0,
    explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 182,
    question: "What is the correct way to declare a variable in JavaScript ES6?",
    options: ["var x = 5;", "let x = 5;", "const x = 5;", "Both let and const"],
    correctAnswer: 3,
    explanation: "ES6 introduced 'let' and 'const' for block-scoped variable declarations.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 183,
    question: "Which operator is used for strict equality comparison in JavaScript?",
    options: ["==", "===", "=", "!="],
    correctAnswer: 1,
    explanation: "The === operator checks for strict equality without type coercion.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 184,
    question: "What does 'this' keyword refer to in JavaScript?",
    options: ["Current function", "Current object", "Global object", "Depends on context"],
    correctAnswer: 3,
    explanation: "'this' refers to different objects depending on how the function is called.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 185,
    question: "Which method is used to convert a string to uppercase in JavaScript?",
    options: ["toUpper()", "toUpperCase()", "upper()", "upperCase()"],
    correctAnswer: 1,
    explanation: "The toUpperCase() method converts a string to uppercase letters.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 186,
    question: "What is the output of typeof null in JavaScript?",
    options: ["null", "undefined", "object", "boolean"],
    correctAnswer: 2,
    explanation: "typeof null returns 'object' due to a historical bug in JavaScript.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 187,
    question: "Which method is used to remove the last element from an array?",
    options: ["pop()", "remove()", "delete()", "splice()"],
    correctAnswer: 0,
    explanation: "The pop() method removes and returns the last element of an array.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 188,
    question: "What is a closure in JavaScript?",
    options: ["A loop structure", "A function with access to outer variables", "A data type", "An error handling mechanism"],
    correctAnswer: 1,
    explanation: "A closure is a function that has access to variables in its outer (enclosing) scope.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 189,
    question: "Which keyword is used to create a function in JavaScript?",
    options: ["function", "func", "def", "create"],
    correctAnswer: 0,
    explanation: "The 'function' keyword is used to declare functions in JavaScript.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 190,
    question: "What does JSON stand for?",
    options: ["JavaScript Object Notation", "Java Syntax Object Notation", "JavaScript Online Notation", "Java Script Object Network"],
    correctAnswer: 0,
    explanation: "JSON stands for JavaScript Object Notation, a data interchange format.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 191,
    question: "Which method is used to parse a JSON string?",
    options: ["JSON.parse()", "JSON.stringify()", "parseJSON()", "stringifyJSON()"],
    correctAnswer: 0,
    explanation: "JSON.parse() converts a JSON string into a JavaScript object.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 192,
    question: "What is the difference between == and === in JavaScript?",
    options: ["No difference", "== checks type, === doesn't", "=== checks type, == doesn't", "Both are deprecated"],
    correctAnswer: 2,
    explanation: "=== performs strict comparison (type and value), while == performs loose comparison with type coercion.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 193,
    question: "Which method is used to join array elements into a string?",
    options: ["join()", "concat()", "merge()", "combine()"],
    correctAnswer: 0,
    explanation: "The join() method creates and returns a new string by concatenating array elements.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 194,
    question: "What is the scope of variables declared with 'let'?",
    options: ["Global scope", "Function scope", "Block scope", "Module scope"],
    correctAnswer: 2,
    explanation: "Variables declared with 'let' have block scope, meaning they're only accessible within the block they're declared in.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 195,
    question: "Which method is used to add elements to the beginning of an array?",
    options: ["unshift()", "push()", "prepend()", "addFirst()"],
    correctAnswer: 0,
    explanation: "The unshift() method adds one or more elements to the beginning of an array.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 196,
    question: "What is the correct way to create an object in JavaScript?",
    options: ["var obj = {};", "var obj = new Object();", "var obj = Object.create({});", "All of the above"],
    correctAnswer: 3,
    explanation: "All three methods are valid ways to create objects in JavaScript.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 197,
    question: "Which event is fired when a page finishes loading?",
    options: ["onload", "onready", "onfinish", "oncomplete"],
    correctAnswer: 0,
    explanation: "The 'onload' event is fired when a page has finished loading completely.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 198,
    question: "What does the 'new' keyword do in JavaScript?",
    options: ["Creates a new variable", "Creates a new function", "Creates a new object instance", "Creates a new array"],
    correctAnswer: 2,
    explanation: "The 'new' keyword creates a new instance of an object from a constructor function.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 199,
    question: "Which method is used to find the length of a string?",
    options: ["length()", "size()", "length property", "count()"],
    correctAnswer: 2,
    explanation: "The length property returns the number of characters in a string.",
    category: "programming",
    language: "javascript"
  },
  {
    id: 200,
    question: "What is the output of '5' + 3 in JavaScript?",
    options: ["8", "53", "Error", "undefined"],
    correctAnswer: 1,
    explanation: "JavaScript performs string concatenation when one operand is a string, resulting in '53'.",
    category: "programming",
    language: "javascript"
  },
  // PHP Questions - Interview Focused
  {
    id: 201,
    question: "What is the difference between include() and require() in PHP?",
    options: ["No difference", "include() gives warning on failure, require() gives fatal error", "require() gives warning, include() gives fatal error", "Both are deprecated"],
    correctAnswer: 1,
    explanation: "include() produces a warning on failure and continues execution, while require() produces a fatal error and stops execution.",
    category: "programming",
    language: "php"
  },
  {
    id: 202,
    question: "Which PHP function is used to connect to a MySQL database?",
    options: ["mysql_connect()", "mysqli_connect()", "pdo_connect()", "Both A and B"],
    correctAnswer: 3,
    explanation: "Both mysql_connect() (deprecated) and mysqli_connect() can be used, but mysqli_connect() is preferred.",
    category: "programming",
    language: "php"
  },
  {
    id: 203,
    question: "What does PHP stand for?",
    options: ["Personal Home Page", "PHP: Hypertext Preprocessor", "Private Home Page", "Public Hypertext Processor"],
    correctAnswer: 1,
    explanation: "PHP is a recursive acronym that stands for 'PHP: Hypertext Preprocessor'.",
    category: "programming",
    language: "php"
  },
  {
    id: 204,
    question: "Which superglobal variable contains form data sent via POST method?",
    options: ["$_GET", "$_POST", "$_REQUEST", "$_FORM"],
    correctAnswer: 1,
    explanation: "$_POST is the superglobal array that contains data sent via HTTP POST method.",
    category: "programming",
    language: "php"
  },
  {
    id: 205,
    question: "What is the correct way to start a PHP session?",
    options: ["session_start()", "start_session()", "begin_session()", "init_session()"],
    correctAnswer: 0,
    explanation: "session_start() is the correct function to initialize a session in PHP.",
    category: "programming",
    language: "php"
  },
  {
    id: 206,
    question: "Which operator is used for string concatenation in PHP?",
    options: ["+", ".", "&", "||"],
    correctAnswer: 1,
    explanation: "The dot (.) operator is used for string concatenation in PHP.",
    category: "programming",
    language: "php"
  },
  {
    id: 207,
    question: "What is the difference between == and === in PHP?",
    options: ["No difference", "== checks type, === doesn't", "=== checks type and value, == only value", "Both are deprecated"],
    correctAnswer: 2,
    explanation: "=== performs strict comparison (type and value), while == performs loose comparison with type juggling.",
    category: "programming",
    language: "php"
  },
  {
    id: 208,
    question: "Which function is used to get the length of a string in PHP?",
    options: ["length()", "strlen()", "size()", "count()"],
    correctAnswer: 1,
    explanation: "strlen() returns the length of a string in PHP.",
    category: "programming",
    language: "php"
  },
  {
    id: 209,
    question: "What is the correct way to define a constant in PHP?",
    options: ["const NAME = 'value';", "define('NAME', 'value');", "constant('NAME', 'value');", "Both A and B"],
    correctAnswer: 3,
    explanation: "Both 'const' keyword and define() function can be used to define constants in PHP.",
    category: "programming",
    language: "php"
  },
  {
    id: 210,
    question: "Which PHP function is used to redirect to another page?",
    options: ["redirect()", "header()", "location()", "goto()"],
    correctAnswer: 1,
    explanation: "header('Location: url') is used to redirect to another page in PHP.",
    category: "programming",
    language: "php"
  },
  {
    id: 211,
    question: "What is the scope of a variable declared with 'global' keyword?",
    options: ["Local scope", "Function scope", "Global scope", "Class scope"],
    correctAnswer: 2,
    explanation: "The 'global' keyword makes a variable accessible in the global scope from within a function.",
    category: "programming",
    language: "php"
  },
  {
    id: 212,
    question: "Which method is used to prevent SQL injection in PHP?",
    options: ["mysql_escape_string()", "Prepared statements", "addslashes()", "All of the above"],
    correctAnswer: 1,
    explanation: "Prepared statements are the most secure way to prevent SQL injection attacks.",
    category: "programming",
    language: "php"
  },
  {
    id: 213,
    question: "What is the difference between public, private, and protected in PHP classes?",
    options: ["No difference", "Visibility levels", "Data types", "Function types"],
    correctAnswer: 1,
    explanation: "They are visibility modifiers: public (accessible everywhere), private (same class only), protected (same class and subclasses).",
    category: "programming",
    language: "php"
  },
  {
    id: 214,
    question: "Which function is used to include a file only once in PHP?",
    options: ["include()", "require()", "include_once()", "require_once()"],
    correctAnswer: 2,
    explanation: "include_once() includes a file only once, preventing duplicate inclusions.",
    category: "programming",
    language: "php"
  },
  {
    id: 215,
    question: "What is the correct way to create an associative array in PHP?",
    options: ["$arr = array(1, 2, 3);", "$arr = ['key' => 'value'];", "$arr = {key: 'value'};", "$arr = (key => 'value');"],
    correctAnswer: 1,
    explanation: "Associative arrays use the '=>' operator to map keys to values.",
    category: "programming",
    language: "php"
  },
  {
    id: 216,
    question: "Which PHP function is used to convert a string to lowercase?",
    options: ["toLowerCase()", "strtolower()", "lower()", "downcase()"],
    correctAnswer: 1,
    explanation: "strtolower() converts a string to lowercase in PHP.",
    category: "programming",
    language: "php"
  },
  {
    id: 217,
    question: "What is the purpose of the __construct() method in PHP?",
    options: ["Destroy objects", "Create objects", "Initialize objects", "Copy objects"],
    correctAnswer: 2,
    explanation: "__construct() is a magic method called automatically when an object is instantiated to initialize it.",
    category: "programming",
    language: "php"
  },
  {
    id: 218,
    question: "Which function is used to check if a variable is set in PHP?",
    options: ["is_set()", "isset()", "defined()", "exists()"],
    correctAnswer: 1,
    explanation: "isset() checks whether a variable is set and is not null.",
    category: "programming",
    language: "php"
  },
  {
    id: 219,
    question: "What is the correct way to handle exceptions in PHP?",
    options: ["if-else", "try-catch", "switch-case", "for-loop"],
    correctAnswer: 1,
    explanation: "try-catch blocks are used to handle exceptions in PHP.",
    category: "programming",
    language: "php"
  },
  {
    id: 220,
    question: "Which PHP function is used to get the current timestamp?",
    options: ["time()", "date()", "now()", "timestamp()"],
    correctAnswer: 0,
    explanation: "time() returns the current Unix timestamp in PHP.",
    category: "programming",
    language: "php"
  },
  // Ruby Questions - Interview Focused
  {
    id: 221,
    question: "What is the difference between a symbol and a string in Ruby?",
    options: ["No difference", "Symbols are immutable, strings are mutable", "Strings are faster", "Symbols use more memory"],
    correctAnswer: 1,
    explanation: "Symbols are immutable and stored once in memory, while strings are mutable objects.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 222,
    question: "Which method is used to iterate over an array in Ruby?",
    options: ["for", "each", "loop", "iterate"],
    correctAnswer: 1,
    explanation: "The .each method is the most common way to iterate over arrays in Ruby.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 223,
    question: "What is the correct way to define a method in Ruby?",
    options: ["function method_name", "def method_name", "method method_name", "define method_name"],
    correctAnswer: 1,
    explanation: "The 'def' keyword is used to define methods in Ruby.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 224,
    question: "What is the difference between nil and false in Ruby?",
    options: ["They are the same", "nil is absence of value, false is boolean", "false is absence of value", "Both are truthy"],
    correctAnswer: 1,
    explanation: "nil represents the absence of a value, while false is a boolean value. Both are falsy in Ruby.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 225,
    question: "Which operator is used for string interpolation in Ruby?",
    options: ["+ operator", "#{} inside double quotes", "& operator", "|| operator"],
    correctAnswer: 1,
    explanation: "String interpolation in Ruby uses #{} syntax inside double-quoted strings.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 226,
    question: "What is a block in Ruby?",
    options: ["A data type", "A chunk of code between {} or do..end", "A class method", "A variable type"],
    correctAnswer: 1,
    explanation: "A block is a chunk of code that can be passed to methods, defined with {} or do..end.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 227,
    question: "Which method is used to convert a string to an integer in Ruby?",
    options: ["to_int", "to_i", "integer", "int"],
    correctAnswer: 1,
    explanation: "The to_i method converts a string to an integer in Ruby.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 228,
    question: "What is the difference between class variables and instance variables in Ruby?",
    options: ["No difference", "Class variables use @@, instance variables use @", "Instance variables use @@", "Class variables are faster"],
    correctAnswer: 1,
    explanation: "Class variables are prefixed with @@ and shared among all instances, instance variables use @ and are unique per instance.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 229,
    question: "Which method is used to check if an object responds to a method in Ruby?",
    options: ["has_method?", "respond_to?", "method_exists?", "can_respond?"],
    correctAnswer: 1,
    explanation: "The respond_to? method checks if an object can respond to a particular method.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 230,
    question: "What is the purpose of the initialize method in Ruby classes?",
    options: ["Destroy objects", "Create class methods", "Constructor for objects", "Define constants"],
    correctAnswer: 2,
    explanation: "The initialize method is the constructor that's called when a new object is created.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 231,
    question: "Which keyword is used for inheritance in Ruby?",
    options: ["extends", "inherits", "<", "super"],
    correctAnswer: 2,
    explanation: "The < symbol is used to indicate inheritance in Ruby class definitions.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 232,
    question: "What does the 'self' keyword refer to in Ruby?",
    options: ["Current class", "Current object", "Parent class", "Global scope"],
    correctAnswer: 1,
    explanation: "'self' refers to the current object in the context where it's used.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 233,
    question: "Which method is used to get the class of an object in Ruby?",
    options: ["typeof", "class", "get_class", "object_class"],
    correctAnswer: 1,
    explanation: "The .class method returns the class of an object in Ruby.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 234,
    question: "What is the difference between puts and print in Ruby?",
    options: ["No difference", "puts adds newline, print doesn't", "print adds newline", "puts is faster"],
    correctAnswer: 1,
    explanation: "puts automatically adds a newline after output, while print doesn't.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 235,
    question: "Which method is used to find the length of an array in Ruby?",
    options: ["length", "size", "count", "All of the above"],
    correctAnswer: 3,
    explanation: "Ruby arrays have length, size, and count methods that all return the number of elements.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 236,
    question: "What is a hash in Ruby?",
    options: ["An array", "A key-value pair collection", "A string method", "A number type"],
    correctAnswer: 1,
    explanation: "A hash is a collection of key-value pairs, similar to dictionaries in other languages.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 237,
    question: "Which operator is used for pattern matching in Ruby case statements?",
    options: ["==", "===", "=~", "match"],
    correctAnswer: 1,
    explanation: "The === operator (case equality) is used for pattern matching in case statements.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 238,
    question: "What is the difference between require and load in Ruby?",
    options: ["No difference", "require loads once, load loads every time", "load is faster", "require is deprecated"],
    correctAnswer: 1,
    explanation: "require loads a file only once and keeps track of loaded files, while load executes the file every time.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 239,
    question: "Which method is used to convert an object to a string in Ruby?",
    options: ["to_string", "to_s", "string", "str"],
    correctAnswer: 1,
    explanation: "The to_s method converts an object to its string representation in Ruby.",
    category: "programming",
    language: "ruby"
  },
  {
    id: 240,
    question: "What is the range operator in Ruby?",
    options: ["..", "->", "=>", "::"],
    correctAnswer: 0,
    explanation: "The .. operator creates ranges in Ruby, e.g., (1..10) creates a range from 1 to 10.",
    category: "programming",
    language: "ruby"
  },
  // Go Questions - Interview Focused
  {
    id: 241,
    question: "What is the correct way to declare a variable in Go?",
    options: ["var x int", "int x", "x := 5", "Both A and C"],
    correctAnswer: 3,
    explanation: "Go supports both 'var x int' declaration and ':=' short variable declaration.",
    category: "programming",
    language: "go"
  },
  {
    id: 242,
    question: "Which keyword is used to define a function in Go?",
    options: ["function", "func", "def", "fn"],
    correctAnswer: 1,
    explanation: "The 'func' keyword is used to define functions in Go.",
    category: "programming",
    language: "go"
  },
  {
    id: 243,
    question: "What is a goroutine in Go?",
    options: ["A data structure", "A lightweight thread", "A package", "A variable type"],
    correctAnswer: 1,
    explanation: "A goroutine is a lightweight thread managed by the Go runtime for concurrent execution.",
    category: "programming",
    language: "go"
  },
  {
    id: 244,
    question: "Which keyword is used to start a goroutine?",
    options: ["go", "start", "run", "async"],
    correctAnswer: 0,
    explanation: "The 'go' keyword is used to start a goroutine in Go.",
    category: "programming",
    language: "go"
  },
  {
    id: 245,
    question: "What is a channel in Go?",
    options: ["A function", "A communication mechanism between goroutines", "A data type", "A package"],
    correctAnswer: 1,
    explanation: "Channels are used for communication between goroutines in Go.",
    category: "programming",
    language: "go"
  },
  {
    id: 246,
    question: "How do you create a channel in Go?",
    options: ["make(chan int)", "new(chan int)", "chan int{}", "create(chan int)"],
    correctAnswer: 0,
    explanation: "Channels are created using the make() function: make(chan type).",
    category: "programming",
    language: "go"
  },
  {
    id: 247,
    question: "What is the zero value of a pointer in Go?",
    options: ["0", "null", "nil", "undefined"],
    correctAnswer: 2,
    explanation: "The zero value of a pointer in Go is nil.",
    category: "programming",
    language: "go"
  },
  {
    id: 248,
    question: "Which operator is used to get the address of a variable in Go?",
    options: ["*", "&", "@", "#"],
    correctAnswer: 1,
    explanation: "The & operator is used to get the address of a variable in Go.",
    category: "programming",
    language: "go"
  },
  {
    id: 249,
    question: "What is an interface in Go?",
    options: ["A class", "A collection of method signatures", "A data structure", "A package"],
    correctAnswer: 1,
    explanation: "An interface in Go is a collection of method signatures that a type can implement.",
    category: "programming",
    language: "go"
  },
  {
    id: 250,
    question: "How do you handle errors in Go?",
    options: ["try-catch", "if err != nil", "throw-catch", "error blocks"],
    correctAnswer: 1,
    explanation: "Go uses explicit error handling with 'if err != nil' pattern.",
    category: "programming",
    language: "go"
  },
  {
    id: 251,
    question: "What is the difference between arrays and slices in Go?",
    options: ["No difference", "Arrays have fixed size, slices are dynamic", "Slices are faster", "Arrays are deprecated"],
    correctAnswer: 1,
    explanation: "Arrays have a fixed size determined at compile time, while slices are dynamic and can grow.",
    category: "programming",
    language: "go"
  },
  {
    id: 252,
    question: "Which function is used to get the length of a slice in Go?",
    options: ["length()", "len()", "size()", "count()"],
    correctAnswer: 1,
    explanation: "The len() function returns the length of a slice, array, or string in Go.",
    category: "programming",
    language: "go"
  },
  {
    id: 253,
    question: "What is defer in Go?",
    options: ["A loop", "Delays function execution until surrounding function returns", "A data type", "An error handler"],
    correctAnswer: 1,
    explanation: "defer delays the execution of a function until the surrounding function returns.",
    category: "programming",
    language: "go"
  },
  {
    id: 254,
    question: "How do you create a struct in Go?",
    options: ["class Person{}", "struct Person{}", "type Person struct{}", "new Person{}"],
    correctAnswer: 2,
    explanation: "Structs are defined using 'type Name struct{}' syntax in Go.",
    category: "programming",
    language: "go"
  },
  {
    id: 255,
    question: "What is the blank identifier in Go?",
    options: ["_", "null", "void", "empty"],
    correctAnswer: 0,
    explanation: "The blank identifier '_' is used to ignore values in Go.",
    category: "programming",
    language: "go"
  },
  {
    id: 256,
    question: "Which keyword is used for package declaration in Go?",
    options: ["module", "package", "namespace", "import"],
    correctAnswer: 1,
    explanation: "The 'package' keyword is used to declare the package name in Go files.",
    category: "programming",
    language: "go"
  },
  {
    id: 257,
    question: "What is the entry point of a Go program?",
    options: ["start()", "main()", "init()", "run()"],
    correctAnswer: 1,
    explanation: "The main() function in the main package is the entry point of a Go program.",
    category: "programming",
    language: "go"
  },
  {
    id: 258,
    question: "How do you convert a string to an integer in Go?",
    options: ["int(str)", "strconv.Atoi(str)", "parse(str)", "toInt(str)"],
    correctAnswer: 1,
    explanation: "strconv.Atoi() is used to convert a string to an integer in Go.",
    category: "programming",
    language: "go"
  },
  {
    id: 259,
    question: "What is the purpose of the init() function in Go?",
    options: ["Main entry point", "Initialize package-level variables", "Error handling", "Memory allocation"],
    correctAnswer: 1,
    explanation: "init() functions are used to initialize package-level variables and run setup code.",
    category: "programming",
    language: "go"
  },
  {
    id: 260,
    question: "Which statement is used for type assertion in Go?",
    options: ["x.(Type)", "x as Type", "Type(x)", "cast(x, Type)"],
    correctAnswer: 0,
    explanation: "Type assertion uses the syntax x.(Type) to assert that x is of type Type.",
    category: "programming",
    language: "go"
  },
  // Rust Questions - Interview Focused
  {
    id: 261,
    question: "What is ownership in Rust?",
    options: ["A design pattern", "A memory management system", "A data type", "A compiler feature"],
    correctAnswer: 1,
    explanation: "Ownership is Rust's unique memory management system that ensures memory safety without garbage collection.",
    category: "programming",
    language: "rust"
  },
  {
    id: 262,
    question: "What does 'borrowing' mean in Rust?",
    options: ["Copying data", "Taking temporary access to data", "Moving ownership", "Deleting data"],
    correctAnswer: 1,
    explanation: "Borrowing allows you to use a value without taking ownership of it.",
    category: "programming",
    language: "rust"
  },
  {
    id: 263,
    question: "Which keyword is used to define a function in Rust?",
    options: ["function", "fn", "def", "func"],
    correctAnswer: 1,
    explanation: "The 'fn' keyword is used to define functions in Rust.",
    category: "programming",
    language: "rust"
  },
  {
    id: 264,
    question: "What is the difference between String and &str in Rust?",
    options: ["No difference", "String is owned, &str is borrowed", "&str is owned", "String is faster"],
    correctAnswer: 1,
    explanation: "String is an owned, growable string type, while &str is a string slice (borrowed reference).",
    category: "programming",
    language: "rust"
  },
  {
    id: 265,
    question: "Which operator is used for pattern matching in Rust?",
    options: ["switch", "match", "case", "if"],
    correctAnswer: 1,
    explanation: "The 'match' expression is used for pattern matching in Rust.",
    category: "programming",
    language: "rust"
  },
  {
    id: 266,
    question: "What is the Result type used for in Rust?",
    options: ["Storing integers", "Error handling", "String operations", "Memory allocation"],
    correctAnswer: 1,
    explanation: "Result<T, E> is used for error handling, representing either success (Ok) or failure (Err).",
    category: "programming",
    language: "rust"
  },
  {
    id: 267,
    question: "How do you create a mutable variable in Rust?",
    options: ["let x = 5", "mut x = 5", "let mut x = 5", "var x = 5"],
    correctAnswer: 2,
    explanation: "Variables are immutable by default; use 'let mut' to create mutable variables.",
    category: "programming",
    language: "rust"
  },
  {
    id: 268,
    question: "What is a trait in Rust?",
    options: ["A data structure", "A collection of methods", "A variable type", "A memory region"],
    correctAnswer: 1,
    explanation: "A trait defines shared behavior that types can implement, similar to interfaces.",
    category: "programming",
    language: "rust"
  },
  {
    id: 269,
    question: "Which macro is used for printing in Rust?",
    options: ["print!", "println!", "Both A and B", "printf!"],
    correctAnswer: 2,
    explanation: "Both print! and println! macros are used for printing, with println! adding a newline.",
    category: "programming",
    language: "rust"
  },
  {
    id: 270,
    question: "What is the Option type in Rust?",
    options: ["A number type", "Represents optional values", "An error type", "A string type"],
    correctAnswer: 1,
    explanation: "Option<T> represents optional values: Some(T) or None, eliminating null pointer errors.",
    category: "programming",
    language: "rust"
  },
  {
    id: 271,
    question: "How do you handle errors with the ? operator in Rust?",
    options: ["It panics", "It returns early on error", "It ignores errors", "It logs errors"],
    correctAnswer: 1,
    explanation: "The ? operator propagates errors by returning early if a Result is Err or Option is None.",
    category: "programming",
    language: "rust"
  },
  {
    id: 272,
    question: "What is a lifetime in Rust?",
    options: ["Variable duration", "Reference validity scope", "Memory size", "Function runtime"],
    correctAnswer: 1,
    explanation: "Lifetimes specify how long references are valid to prevent dangling references.",
    category: "programming",
    language: "rust"
  },
  {
    id: 273,
    question: "Which keyword is used to create a structure in Rust?",
    options: ["struct", "class", "type", "object"],
    correctAnswer: 0,
    explanation: "The 'struct' keyword is used to define structures in Rust.",
    category: "programming",
    language: "rust"
  },
  {
    id: 274,
    question: "What is the purpose of impl in Rust?",
    options: ["Import modules", "Implement methods for types", "Define variables", "Handle errors"],
    correctAnswer: 1,
    explanation: "'impl' blocks are used to implement methods and associated functions for types.",
    category: "programming",
    language: "rust"
  },
  {
    id: 275,
    question: "How do you create a vector in Rust?",
    options: ["Vec::new()", "vec![]", "vector!()", "Both A and B"],
    correctAnswer: 3,
    explanation: "Vectors can be created with Vec::new() or the vec![] macro.",
    category: "programming",
    language: "rust"
  },
  {
    id: 276,
    question: "What does 'move' semantics mean in Rust?",
    options: ["Copy data", "Transfer ownership", "Delete data", "Share data"],
    correctAnswer: 1,
    explanation: "Move semantics transfer ownership of data from one variable to another.",
    category: "programming",
    language: "rust"
  },
  {
    id: 277,
    question: "Which attribute is used to derive common traits in Rust?",
    options: ["#[derive]", "#[trait]", "#[impl]", "#[auto]"],
    correctAnswer: 0,
    explanation: "The #[derive] attribute automatically implements common traits like Debug, Clone, etc.",
    category: "programming",
    language: "rust"
  },
  {
    id: 278,
    question: "What is unsafe code in Rust?",
    options: ["Buggy code", "Code that bypasses safety checks", "Deprecated code", "Slow code"],
    correctAnswer: 1,
    explanation: "Unsafe code allows operations that bypass Rust's safety guarantees, like raw pointer dereferencing.",
    category: "programming",
    language: "rust"
  },
  {
    id: 279,
    question: "How do you iterate over a collection in Rust?",
    options: ["for item in collection", "collection.iter()", "collection.into_iter()", "All of the above"],
    correctAnswer: 3,
    explanation: "Rust provides multiple ways to iterate: for loops, .iter(), and .into_iter() methods.",
    category: "programming",
    language: "rust"
  },
  {
    id: 280,
    question: "What is Cargo in Rust?",
    options: ["A data type", "Package manager and build system", "A compiler", "A runtime"],
    correctAnswer: 1,
    explanation: "Cargo is Rust's package manager and build system for managing dependencies and building projects.",
    category: "programming",
    language: "rust"
  },
  // Swift Questions - Interview Focused
  {
    id: 281,
    question: "What is optional binding in Swift?",
    options: ["A data type", "Safely unwrapping optionals", "A loop construct", "An error handler"],
    correctAnswer: 1,
    explanation: "Optional binding safely unwraps optionals using if let or guard let syntax.",
    category: "programming",
    language: "swift"
  },
  {
    id: 282,
    question: "Which keyword is used to define a variable in Swift?",
    options: ["var", "let", "const", "Both A and B"],
    correctAnswer: 3,
    explanation: "'var' creates mutable variables, 'let' creates immutable constants.",
    category: "programming",
    language: "swift"
  },
  {
    id: 283,
    question: "What is the difference between class and struct in Swift?",
    options: ["No difference", "Classes are reference types, structs are value types", "Structs are faster", "Classes are deprecated"],
    correctAnswer: 1,
    explanation: "Classes are reference types (passed by reference), structs are value types (passed by value).",
    category: "programming",
    language: "swift"
  },
  {
    id: 284,
    question: "How do you handle nil values safely in Swift?",
    options: ["Force unwrapping", "Optional chaining", "Guard statements", "All of the above"],
    correctAnswer: 3,
    explanation: "Swift provides multiple safe ways to handle nil: optional chaining (?.), guard statements, and optional binding.",
    category: "programming",
    language: "swift"
  },
  {
    id: 285,
    question: "What is a closure in Swift?",
    options: ["A class method", "Self-contained blocks of functionality", "A data structure", "An error type"],
    correctAnswer: 1,
    explanation: "Closures are self-contained blocks of functionality that can be passed around and used in code.",
    category: "programming",
    language: "swift"
  },
  {
    id: 286,
    question: "Which operator is used for force unwrapping in Swift?",
    options: ["?", "!", "&", "*"],
    correctAnswer: 1,
    explanation: "The ! operator force unwraps optionals, but should be used carefully as it can cause crashes.",
    category: "programming",
    language: "swift"
  },
  {
    id: 287,
    question: "What is the purpose of 'guard' statements in Swift?",
    options: ["Loop control", "Early exit with condition checking", "Error handling", "Memory management"],
    correctAnswer: 1,
    explanation: "Guard statements provide early exit from functions when conditions aren't met, improving code readability.",
    category: "programming",
    language: "swift"
  },
  {
    id: 288,
    question: "How do you define a protocol in Swift?",
    options: ["protocol ProtocolName", "interface ProtocolName", "abstract ProtocolName", "trait ProtocolName"],
    correctAnswer: 0,
    explanation: "Protocols are defined using the 'protocol' keyword followed by the protocol name.",
    category: "programming",
    language: "swift"
  },
  {
    id: 289,
    question: "What is ARC in Swift?",
    options: ["A data type", "Automatic Reference Counting", "A design pattern", "A compiler"],
    correctAnswer: 1,
    explanation: "ARC (Automatic Reference Counting) automatically manages memory by tracking references to objects.",
    category: "programming",
    language: "swift"
  },
  {
    id: 290,
    question: "Which keyword is used for inheritance in Swift?",
    options: ["extends", "inherits", ":", "super"],
    correctAnswer: 2,
    explanation: "Swift uses the colon (:) to indicate inheritance: class ChildClass: ParentClass.",
    category: "programming",
    language: "swift"
  },
  {
    id: 291,
    question: "What is the difference between weak and unowned references?",
    options: ["No difference", "weak can be nil, unowned cannot", "unowned is faster", "weak is deprecated"],
    correctAnswer: 1,
    explanation: "weak references can become nil and are optionals, unowned references are expected to always have a value.",
    category: "programming",
    language: "swift"
  },
  {
    id: 292,
    question: "How do you create an array in Swift?",
    options: ["Array<Int>()", "[Int]()", "var arr: [Int] = []", "All of the above"],
    correctAnswer: 3,
    explanation: "Swift provides multiple ways to create arrays: Array<Type>(), [Type](), and literal syntax.",
    category: "programming",
    language: "swift"
  },
  {
    id: 293,
    question: "What is a computed property in Swift?",
    options: ["A stored value", "A property with getter/setter", "A constant", "A function"],
    correctAnswer: 1,
    explanation: "Computed properties don't store values but provide getter and optionally setter to retrieve and set values.",
    category: "programming",
    language: "swift"
  },
  {
    id: 294,
    question: "Which access control level is most restrictive in Swift?",
    options: ["public", "internal", "fileprivate", "private"],
    correctAnswer: 3,
    explanation: "'private' is the most restrictive, limiting access to the enclosing declaration.",
    category: "programming",
    language: "swift"
  },
  {
    id: 295,
    question: "What is the purpose of 'defer' in Swift?",
    options: ["Delay execution", "Execute code when leaving scope", "Handle errors", "Create closures"],
    correctAnswer: 1,
    explanation: "defer executes code just before leaving the current scope, useful for cleanup operations.",
    category: "programming",
    language: "swift"
  },
  {
    id: 296,
    question: "How do you handle errors in Swift?",
    options: ["try-catch", "do-catch", "if-else", "guard-else"],
    correctAnswer: 1,
    explanation: "Swift uses do-catch blocks with try statements for error handling.",
    category: "programming",
    language: "swift"
  },
  {
    id: 297,
    question: "What is a tuple in Swift?",
    options: ["An array", "A group of multiple values", "A dictionary", "A set"],
    correctAnswer: 1,
    explanation: "Tuples group multiple values into a single compound value, like (String, Int).",
    category: "programming",
    language: "swift"
  },
  {
    id: 298,
    question: "Which keyword is used to define an enumeration in Swift?",
    options: ["enum", "enumeration", "type", "case"],
    correctAnswer: 0,
    explanation: "The 'enum' keyword is used to define enumerations in Swift.",
    category: "programming",
    language: "swift"
  },
  {
    id: 299,
    question: "What is the nil-coalescing operator in Swift?",
    options: ["?", "!", "??", "?:"],
    correctAnswer: 2,
    explanation: "The ?? operator provides a default value when an optional is nil: optionalValue ?? defaultValue.",
    category: "programming",
    language: "swift"
  },
  {
    id: 300,
    question: "How do you create a dictionary in Swift?",
    options: ["Dictionary<String, Int>()", "[String: Int]()", "var dict: [String: Int] = [:]", "All of the above"],
    correctAnswer: 3,
    explanation: "Swift provides multiple ways to create dictionaries using generic syntax and literal notation.",
    category: "programming",
    language: "swift"
  }
]

const categoryTitles: { [key: string]: string } = {
  "general": "General Aptitude",
  "verbal": "Verbal and Reasoning",
  "verbal-reasoning": "Verbal and Reasoning",
  "current-affairs": "Current Affairs & GK",
  "programming": "Programming",
  "technical-mcqs": "Technical MCQs",
  "interview": "Interview"
}

export default function CategoryTestPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes
  const [testStarted, setTestStarted] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [showLanguageSelection, setShowLanguageSelection] = useState(false)
  
  // Define time limit in minutes for display
  const timeLimit = 20

  // Function to get questions by category
  const getQuestionsByCategory = (categoryId: string): Question[] => {
    if (categoryId === 'programming' && selectedLanguage) {
      // For programming category with selected language, filter by language and limit to 20
      return questionBank.filter(q => q.category === categoryId && q.language === selectedLanguage).slice(0, 20)
    }
    return questionBank.filter(q => q.category === categoryId)
  }

  // Filter questions based on category and selected language for programming
  const categoryQuestions = useMemo(() => {
    return getQuestionsByCategory(categoryId)
  }, [categoryId, selectedLanguage])
  
  const categoryTitle = categoryTitles[categoryId] || "Aptitude Test"

  // Check if this is programming category
  const isProgrammingCategory = categoryId === "programming"
  
  // Programming languages
  const programmingLanguages = [
    { id: "c", name: "C Programming", icon: "C" },
    { id: "cpp", name: "C++ Programming", icon: "C++" },
    { id: "java", name: "Java Programming", icon: "Java" },
    { id: "python", name: "Python Programming", icon: "Python" },
    { id: "javascript", name: "JavaScript", icon: "JS" },
    { id: "php", name: "PHP Programming", icon: "PHP" },
    { id: "ruby", name: "Ruby Programming", icon: "Ruby" },
    { id: "go", name: "Go Programming", icon: "Go" },
    { id: "rust", name: "Rust Programming", icon: "Rust" },
    { id: "swift", name: "Swift Programming", icon: "Swift" }
  ]

  useEffect(() => {
    setSelectedAnswers(new Array(categoryQuestions.length).fill(-1))
  }, [categoryQuestions.length])

  useEffect(() => {
    if (testStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitTest()
    }
  }, [timeLeft, testStarted, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartTest = () => {
    setTestStarted(true)
  }

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId)
    setShowLanguageSelection(false)
    setCurrentQuestion(0) // Reset to first question when language changes
    setSelectedAnswers([]) // Clear previous answers
    setTestStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < categoryQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitTest = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === categoryQuestions[index].correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const handleRetakeTest = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(categoryQuestions.length).fill(-1))
    setShowResults(false)
    setTimeLeft(1200)
    setTestStarted(false)
  }

  const progress = categoryQuestions.length > 0 ? ((currentQuestion + 1) / categoryQuestions.length) * 100 : 0

  if (categoryQuestions.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">{categoryTitle} Test</h1>
            <p className="text-muted-foreground">Questions for this category are coming soon!</p>
            <Button onClick={() => router.push('/aptitude')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Aptitude
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Language selection screen for programming category
  if (showLanguageSelection) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Programming Test</h1>
            <p className="text-muted-foreground">Choose a programming language to start your test</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
            {programmingLanguages.map((language) => (
              <Card 
                key={language.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleLanguageSelect(language.id)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {language.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{language.name}</h3>
                    <p className="text-sm text-muted-foreground">20 questions • 20 minutes</p>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Select {language.icon}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={() => router.push('/aptitude')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show language selection for programming category first
  if (isProgrammingCategory && !selectedLanguage) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Programming Test</h1>
            <p className="text-muted-foreground">Choose your programming language to start the test</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {programmingLanguages.map((language) => (
              <Card 
                key={language.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                onClick={() => handleLanguageSelect(language.id)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {language.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{language.name}</h3>
                    <p className="text-sm text-muted-foreground">20 questions • 20 minutes</p>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Select {language.icon}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={() => router.push('/aptitude')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!testStarted) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">{categoryTitle} Test</h1>
            <p className="text-muted-foreground">Test your knowledge with our curated questions</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600">Ready to Start?</CardTitle>
              <CardDescription>
                This test contains {getQuestionsByCategory(categoryId).length} questions and you have {timeLimit} minutes to complete it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Time limit: {timeLimit} minutes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>{getQuestionsByCategory(categoryId).length} multiple choice questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowRight className="h-5 w-5 text-purple-600" />
                  <span>Navigate between questions freely</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={() => router.push('/aptitude')}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleStartTest}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / categoryQuestions.length) * 100)
    
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">{categoryTitle} Test Results</h1>
            <p className="text-muted-foreground">Here's how you performed</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-blue-600">
                {score}/{categoryQuestions.length}
              </CardTitle>
              <CardDescription className="text-lg">
                {percentage}% Score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {categoryQuestions.map((question, index) => {
                  const userAnswer = selectedAnswers[index]
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{question.question}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Your answer:</span>{" "}
                              <span className={userAnswer === -1 ? "text-gray-500" : isCorrect ? "text-green-600" : "text-red-600"}>
                                {userAnswer === -1 ? "Not answered" : question.options[userAnswer]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm">
                                <span className="font-medium">Correct answer:</span>{" "}
                                <span className="text-green-600">{question.options[question.correctAnswer]}</span>
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={handleRetakeTest}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Test
                </Button>
                <Button 
                  onClick={() => router.push('/aptitude')}
                  className="flex-1"
                >
                  Back to Aptitude
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const question = categoryQuestions[currentQuestion]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 -m-6 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {categoryTitle} Test
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Question {currentQuestion + 1} of {categoryQuestions.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedAnswers.filter(a => a !== -1).length}
                  </div>
                  <div className="text-sm text-gray-500">Answered</div>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-xl font-mono font-bold text-blue-600">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Question Panel */}
            <div className="lg:col-span-3">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                  <CardTitle className="text-lg md:text-xl leading-relaxed text-gray-900 dark:text-white">
                    Q{currentQuestion + 1}. {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`group p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedAnswers[currentQuestion] === index
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
                            : "border-gray-200 dark:border-gray-600 hover:border-green-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[currentQuestion] === index
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300 dark:border-gray-500 group-hover:border-green-300"
                          }`}>
                            {selectedAnswers[currentQuestion] === index && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                              selectedAnswers[currentQuestion] === index
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-green-100 dark:group-hover:bg-green-800"
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                              {option}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Navigation */}
                  <div className="flex justify-between items-center pt-6 border-t mt-6">
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                      variant="outline"
                      className="px-4"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    <div className="flex space-x-3">
                      {currentQuestion === categoryQuestions.length - 1 ? (
                        <Button
                          onClick={handleSubmitTest}
                          className="bg-green-600 hover:bg-green-700 px-6"
                        >
                          Submit Test
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNextQuestion}
                          className="px-6"
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question Navigation Panel */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 sticky top-6">
                <CardHeader className="bg-gray-50 dark:bg-gray-700">
                  <CardTitle className="text-lg">Question Navigator</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {categoryQuestions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`w-12 h-12 rounded-lg font-bold transition-all duration-200 ${
                          index === currentQuestion
                            ? "bg-blue-500 text-white shadow-lg scale-105"
                            : selectedAnswers[index] !== -1
                            ? "bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded"></div>
                      <span>Not Answered</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
