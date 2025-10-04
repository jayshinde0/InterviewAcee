import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, language, input, problemId } = await request.json()
    
    console.log('=== DEBUG JUDGE REQUEST ===')
    console.log('Problem ID:', problemId)
    console.log('Language:', language)
    console.log('Input:', input)
    console.log('Code:', code)
    console.log('========================')
    
    // Simple test for Two Sum problem
    if (problemId === '2' || problemId === 2) {
      // Test case: nums = [2,7,11,15], target = 9
      // Expected output: [0,1]
      
      if (language === 'cpp') {
        // Simple C++ execution test
        const testCode = `
#include <iostream>
#include <vector>
using namespace std;

${code}

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = sol.twoSum(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}
`
        
        return NextResponse.json({
          debug: true,
          message: 'Debug mode - showing expected vs actual',
          expected: '[0,1]',
          testCode,
          input: 'nums = [2,7,11,15], target = 9',
          status: 'Debug'
        })
      }
    }
    
    return NextResponse.json({
      debug: true,
      message: 'Debug mode active',
      receivedData: { code, language, input, problemId }
    })
    
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}