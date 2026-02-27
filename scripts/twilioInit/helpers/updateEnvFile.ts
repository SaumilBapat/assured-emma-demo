import fs from 'fs-extra';
import path from 'path';

export async function updateEnvFile(key: string, value: string): Promise<void> {
  const envPath = path.join(process.cwd(), '.env');
  
  try {
    // Read existing .env file
    let envContent = '';
    if (await fs.pathExists(envPath)) {
      envContent = await fs.readFile(envPath, 'utf-8');
    }

    // Split content into lines
    const lines = envContent.split('\n');
    
    // Check if key already exists
    const keyIndex = lines.findIndex(line => line.startsWith(`${key}=`));
    
    if (keyIndex !== -1) {
      // Update existing key
      lines[keyIndex] = `${key}=${value}`;
    } else {
      // Add new key
      lines.push(`${key}=${value}`);
    }
    
    // Write back to file
    await fs.writeFile(envPath, lines.join('\n'));
  } catch (error) {
    console.error('Error updating .env file:', error);
    throw error;
  }
}
