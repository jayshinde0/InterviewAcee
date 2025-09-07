import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

// Local Judge0 Configuration (fallback to local execution if Judge0 unavailable)
const JUDGE0_URL = 'http://localhost:2358'

// Language IDs for Judge0
const LANGUAGE_IDS = {
  cpp: 54,        // C++ (GCC 9.2.0)
  java: 62,       // Java (OpenJDK 13.0.1)
  python: 71,     // Python (3.8.1)
  javascript: 63, // JavaScript (Node.js 12.14.0)
  c: 50,          // C (GCC 9.2.0)
  csharp: 51,     // C# (Mono 6.6.0.161)
  go: 60,         // Go (1.13.5)
  rust: 73,       // Rust (1.40.0)
  php: 68,        // PHP (7.4.1)
  ruby: 72,       // Ruby (2.7.0)
  kotlin: 78,     // Kotlin (1.3.70)
  swift: 83,      // Swift (5.2.3)
  typescript: 74  // TypeScript (3.7.4)
}

// Fallback local execution function
async function executeCodeLocally(code: string, language: string, input: string) {
  const tempDir = path.join(process.cwd(), 'temp')
  
  try {
    await fs.mkdir(tempDir, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }

  const timestamp = Date.now()
  let filename: string
  let command: string

  switch (language) {
    case 'python':
      filename = `code_${timestamp}.py`
      const pythonFile = path.join(tempDir, filename)
      await fs.writeFile(pythonFile, code)
      command = `python "${pythonFile}"`
      break
      
    case 'javascript':
      filename = `code_${timestamp}.js`
      const jsFile = path.join(tempDir, filename)
      await fs.writeFile(jsFile, code)
      command = `node "${jsFile}"`
      break
      
    case 'cpp':
      filename = `code_${timestamp}.cpp`
      const cppFile = path.join(tempDir, filename)
      const exeFile = path.join(tempDir, `code_${timestamp}.exe`)
      await fs.writeFile(cppFile, code)
      command = `g++ "${cppFile}" -o "${exeFile}" && "${exeFile}"`
      break
      
    case 'java':
      filename = `Main.java`
      const javaFile = path.join(tempDir, filename)
      await fs.writeFile(javaFile, code)
      command = `javac "${javaFile}" && java -cp "${tempDir}" Main`
      break
      
    case 'c':
      filename = `code_${timestamp}.c`
      const cFile = path.join(tempDir, filename)
      const cExeFile = path.join(tempDir, `code_${timestamp}.exe`)
      await fs.writeFile(cFile, code)
      command = `gcc "${cFile}" -o "${cExeFile}" && "${cExeFile}"`
      break
      
    default:
      throw new Error(`Unsupported language: ${language}`)
  }

  const startTime = Date.now()
  const { stdout, stderr } = await execAsync(command, {
    timeout: 10000, // 10 second timeout
    cwd: tempDir
  })
  const executionTime = Date.now() - startTime

  // Cleanup
  try {
    await fs.unlink(path.join(tempDir, filename))
    if (language === 'cpp' || language === 'c') {
      await fs.unlink(path.join(tempDir, `code_${timestamp}.exe`))
    }
    if (language === 'java') {
      await fs.unlink(path.join(tempDir, 'Main.class'))
    }
  } catch (error) {
    // Ignore cleanup errors
  }

  return {
    stdout: stdout || '',
    stderr: stderr || '',
    time: executionTime / 1000, // Convert to seconds
    status: { description: stderr ? 'Runtime Error' : 'Accepted' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, input } = await request.json()

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      )
    }

    // Try Judge0 first, fallback to local execution
    try {
      const languageId = LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS]
      if (!languageId) {
        throw new Error('Unsupported language for Judge0')
      }

      // Language-specific code preprocessing
      let fullCode = code
      
      // C++ preprocessing
      if (language === 'cpp' && code.includes('class Solution')) {
        fullCode = `
#include <iostream>
#include <vector>
#include <unordered_map>
#include <sstream>
#include <algorithm>
#include <string>
using namespace std;

${code}

int main() {
    Solution sol;
    string line;
    
    // Read nums array from input
    getline(cin, line);
    vector<int> nums;
    stringstream ss(line);
    string token;
    while (getline(ss, token, ',')) {
        nums.push_back(stoi(token));
    }
    
    // Read target from input
    getline(cin, line);
    int target = stoi(line);
    
    // Execute solution
    vector<int> result = sol.twoSum(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    
    return 0;
}
`
      }
      
      // Java preprocessing
      if (language === 'java' && code.includes('class Solution')) {
        fullCode = `
import java.util.*;
import java.io.*;

${code}

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        Solution sol = new Solution();
        
        // Read input and execute solution
        String[] numsStr = br.readLine().split(",");
        int[] nums = new int[numsStr.length];
        for (int i = 0; i < numsStr.length; i++) {
            nums[i] = Integer.parseInt(numsStr[i].trim());
        }
        
        int target = Integer.parseInt(br.readLine().trim());
        int[] result = sol.twoSum(nums, target);
        
        System.out.println("[" + result[0] + "," + result[1] + "]");
    }
}
`
      }
      
      // Python preprocessing
      if (language === 'python' && code.includes('class Solution')) {
        fullCode = `
${code}

if __name__ == "__main__":
    sol = Solution()
    
    # Read input
    nums_str = input().strip()
    nums = list(map(int, nums_str.split(',')))
    
    target = int(input().strip())
    
    # Execute solution
    result = sol.twoSum(nums, target)
    print(f"[{result[0]},{result[1]}]")
`
      }

      // Create submission using local Judge0
      const submissionResponse = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_code: fullCode,
          language_id: languageId,
          stdin: input || '',
          cpu_time_limit: 2,
          memory_limit: 128000,
          wall_time_limit: 5
        })
      })

      if (!submissionResponse.ok) {
        const errorText = await submissionResponse.text()
        console.error('Submission failed:', submissionResponse.status, errorText)
        throw new Error(`Failed to create submission: ${submissionResponse.status} ${errorText}`)
      }

      const submission = await submissionResponse.json()
      const token = submission.token

      if (!token) {
        console.error('No token received:', submission)
        throw new Error('No token received from Judge0')
      }

      // Poll for result with better error handling
      let result
      let attempts = 0
      const maxAttempts = 10

      do {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        
        try {
          const resultResponse = await fetch(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false&fields=*`, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          if (!resultResponse.ok) {
            console.error('Judge0 result response not ok:', resultResponse.status, resultResponse.statusText)
            throw new Error(`Judge0 API error: ${resultResponse.status} ${resultResponse.statusText}`)
          }
          
          result = await resultResponse.json()
          attempts++
        } catch (fetchError: any) {
          console.error('Judge0 fetch error:', fetchError)
          if (attempts >= maxAttempts - 1) {
            throw new Error(`Judge0 API unavailable: ${fetchError.message}`)
          }
          attempts++
          continue
        }
      } while (result && result.status && result.status.id <= 2 && attempts < maxAttempts) // Status 1=In Queue, 2=Processing

      if (!result || !result.status) {
        throw new Error('Invalid result from Judge0')
      }

      return NextResponse.json({
        status: result.status.description || 'Unknown',
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        compile_output: result.compile_output || '',
        time: result.time || null,
        memory: result.memory || null,
        exit_code: result.exit_code || null,
        token: result.token || token
      })

    } catch (judge0Error: any) {
      console.log('Judge0 failed, falling back to local execution:', judge0Error.message)
      
      // Fallback to local execution
      try {
        const localResult = await executeCodeLocally(code, language, input || '')
        return NextResponse.json(localResult)
      } catch (error: any) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
          { 
            error: true,
            message: `Execution failed: ${error.message}`,
            stdout: '',
            stderr: `Unexpected error: ${error.message}`,
            status: { description: 'Error' }
          },
          { status: 500 }
        )
      }
    }
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { 
        error: true,
        message: `Execution failed: ${error.message}`,
        stdout: '',
        stderr: `Unexpected error: ${error.message}`,
        status: { description: 'Error' }
      },
      { status: 500 }
    )
  }
}
