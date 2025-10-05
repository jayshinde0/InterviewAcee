import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, language, problemId, testCases } = await request.json()
    
    // For now, let's just validate the code structure and return a mock result
    let result = {
      status: 'Accepted',
      stdout: '',
      stderr: '',
      testResults: [] as Array<{ passed: boolean; input: string; expected: string; actual: string }>
    }
    
    // Simple validation for Two Sum problem
    if (problemId === '2' || problemId === 2) {
      if (code.includes('twoSum') && code.includes('vector<int>')) {
        result.status = 'Accepted'
        result.stdout = '[0,1]'
        result.testResults = [
          { passed: true, input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]' }
        ]
      } else {
        result.status = 'Wrong Answer'
        result.stderr = 'Function twoSum not found or incorrect signature'
        result.testResults = [
          { passed: false, input: '[2,7,11,15], 9', expected: '[0,1]', actual: 'No output' }
        ]
      }
    }
    
    // Simple validation for Contains Duplicate problem
    if (problemId === '3' || problemId === 3) {
      if (code.includes('containsDuplicate') && code.includes('bool')) {
        result.status = 'Accepted'
        result.stdout = 'true'
        result.testResults = [
          { passed: true, input: '[1,2,3,1]', expected: 'true', actual: 'true' }
        ]
      } else {
        result.status = 'Wrong Answer'
        result.stderr = 'Function containsDuplicate not found or incorrect signature'
      }
    }
    
    // Simple validation for Move Zeroes problem
    if (problemId === '4' || problemId === 4) {
      if (code.includes('moveZeroes') && code.includes('void')) {
        result.status = 'Accepted'
        result.stdout = '[1,3,12,0,0]'
        result.testResults = [
          { passed: true, input: '[0,1,0,3,12]', expected: '[1,3,12,0,0]', actual: '[1,3,12,0,0]' }
        ]
      } else {
        result.status = 'Wrong Answer'
        result.stderr = 'Function moveZeroes not found or incorrect signature'
      }
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    return NextResponse.json({
      status: 'Error',
      stderr: error instanceof Error ? error.message : 'Unknown error',
      testResults: []
    }, { status: 500 })
  }
}