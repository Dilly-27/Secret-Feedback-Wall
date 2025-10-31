import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function pushToGitHub() {
  try {
    console.log('🔗 Connecting to GitHub...');
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user info
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✅ Connected as: ${user.login}`);
    
    // Create repository name from current directory or use a default
    const repoName = process.argv[2] || 'fhevm-dapp';
    const isPrivate = process.argv[3] === 'private';
    
    console.log(`\n📦 Creating repository: ${repoName}...`);
    
    let repo;
    try {
      // Try to create the repository
      const createResponse = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: isPrivate,
        auto_init: false
      });
      repo = createResponse.data;
      console.log(`✅ Repository created: ${repo.html_url}`);
    } catch (error) {
      if (error.status === 422) {
        console.log('Repository already exists, using existing repository...');
        const { data: existingRepo } = await octokit.repos.get({
          owner: user.login,
          repo: repoName
        });
        repo = existingRepo;
        console.log(`✅ Using existing repository: ${repo.html_url}`);
      } else {
        throw error;
      }
    }
    
    // Get access token for git operations
    const accessToken = await getAccessToken();
    const remoteUrl = `https://${accessToken}@github.com/${user.login}/${repoName}.git`;
    
    console.log('\n🔧 Configuring git...');
    
    // Remove existing origin if it exists
    try {
      execSync('git remote remove origin', { stdio: 'pipe' });
    } catch (e) {
      // Remote doesn't exist, that's fine
    }
    
    // Add new origin
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
    
    // Get current branch name
    let branch;
    try {
      branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    } catch (e) {
      branch = 'main';
    }
    
    console.log(`\n📤 Pushing to GitHub (branch: ${branch})...`);
    
    // Push to GitHub
    execSync(`git push -u origin ${branch} --force`, { stdio: 'inherit' });
    
    console.log('\n✨ Success! Your code is now on GitHub!');
    console.log(`🔗 Repository URL: ${repo.html_url}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

pushToGitHub();
