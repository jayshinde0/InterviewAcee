import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = 'AIzaSyBo55GjHIWqohapAH7wK2KRc2DsH-rShEI'
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    let prompt = ''
    
    switch (type) {
      case 'interview_feedback':
        prompt = generateInterviewFeedbackPrompt(data)
        break
      case 'code_review':
        prompt = generateCodeReviewPrompt(data)
        break
      case 'interview_question':
        prompt = generateInterviewQuestionPrompt(data)
        break
      case 'behavioral_feedback':
        prompt = generateBehavioralFeedbackPrompt(data)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid feedback type' },
          { status: 400 }
        )
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      feedback: text,
      type: type,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate feedback',
        message: error.message
      },
      { status: 500 }
    )
  }
}

function generateInterviewFeedbackPrompt(data: any): string {
  const { question, answer, duration, difficulty, category } = data
  
  return `
As an experienced technical interviewer, provide comprehensive feedback on this interview response:

**Question:** ${question}
**Category:** ${category}
**Difficulty:** ${difficulty}
**Candidate's Answer:** ${answer}
**Time Taken:** ${duration} seconds

Please provide feedback in the following format:

## Overall Assessment
Rate the response (1-10) and provide a brief summary.

## Strengths
- List specific strengths in the response
- Highlight good problem-solving approaches
- Note clear communication points

## Areas for Improvement
- Identify gaps in the solution
- Suggest better approaches or optimizations
- Point out communication issues

## Technical Accuracy
- Evaluate correctness of the solution
- Check time/space complexity analysis
- Verify edge case handling

## Communication Skills
- Assess clarity of explanation
- Note structured thinking
- Evaluate use of technical terminology

## Recommendations
- Specific steps to improve
- Resources for further learning
- Practice suggestions

Keep feedback constructive, specific, and actionable. Focus on both technical and soft skills.
`
}

function generateCodeReviewPrompt(data: any): string {
  const { code, language, problemTitle, testResults } = data
  
  return `
As a senior software engineer, review this code submission:

**Problem:** ${problemTitle}
**Language:** ${language}
**Code:**
\`\`\`${language}
${code}
\`\`\`

**Test Results:** ${testResults ? JSON.stringify(testResults) : 'Not provided'}

Provide a comprehensive code review covering:

## Code Quality (1-10)
Rate and explain the overall code quality.

## Algorithm & Logic
- Correctness of the approach
- Time and space complexity
- Edge case handling

## Code Style & Best Practices
- Naming conventions
- Code organization
- Language-specific best practices

## Potential Issues
- Bugs or logical errors
- Performance bottlenecks
- Security concerns

## Optimization Suggestions
- More efficient algorithms
- Better data structures
- Code simplification opportunities

## Learning Points
- Key concepts demonstrated
- Areas for improvement
- Advanced techniques to explore

Provide specific, actionable feedback with code examples where helpful.
`
}

function generateInterviewQuestionPrompt(data: any): string {
  const { category, difficulty, role, experience } = data
  
  return `
Generate a realistic ${difficulty} level ${category} interview question for a ${role} position requiring ${experience} years of experience.

Provide:

## Question
A well-crafted technical question that tests relevant skills.

## Expected Approach
- Key concepts the candidate should demonstrate
- Optimal solution approach
- Time/space complexity expectations

## Follow-up Questions
2-3 follow-up questions to dive deeper.

## Evaluation Criteria
- What makes a good vs excellent answer
- Common mistakes to watch for
- Bonus points for advanced concepts

## Sample Answer Outline
Brief outline of a strong response.

Make the question realistic, relevant to the role, and appropriately challenging for the experience level.
`
}

function generateBehavioralFeedbackPrompt(data: any): string {
  const { question, answer, competency } = data
  
  return `
As an HR expert, evaluate this behavioral interview response:

**Question:** ${question}
**Competency Being Assessed:** ${competency}
**Candidate's Response:** ${answer}

Provide feedback using the STAR method evaluation:

## STAR Analysis
- **Situation:** How well did they set context?
- **Task:** Was the task/challenge clearly defined?
- **Action:** Were specific actions described?
- **Result:** Were outcomes and impact mentioned?

## Competency Assessment (1-10)
Rate how well the response demonstrates the target competency.

## Strengths
- Specific examples of good storytelling
- Evidence of the desired competency
- Clear communication points

## Areas for Improvement
- Missing STAR elements
- Vague or unclear parts
- Opportunities for stronger examples

## Follow-up Questions
Suggest 2-3 probing questions to get more details.

## Coaching Tips
- How to strengthen the response
- Better examples they could use
- Communication improvements

Focus on helping the candidate tell more compelling, structured stories that clearly demonstrate their capabilities.
`
}
