"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePipelineFromPrompt = void 0;
const genai_1 = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Mock response for when no API key is configured
const getMockPipeline = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    const nodes = [];
    const edges = [];
    let stepId = 1;
    // Always start with checkout
    nodes.push({ id: String(stepId), type: 'github_checkout', data: { label: 'Checkout Code from GitHub' } });
    stepId++;
    // Detect npm/node project
    if (lowerPrompt.includes('react') || lowerPrompt.includes('node') || lowerPrompt.includes('next') || lowerPrompt.includes('npm') || lowerPrompt.includes('javascript') || lowerPrompt.includes('typescript')) {
        nodes.push({ id: String(stepId), type: 'npm_install', data: { label: 'Install NPM Dependencies' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'npm_build', data: { label: 'Build Application' } });
        stepId++;
    }
    // Detect python project
    if (lowerPrompt.includes('python') || lowerPrompt.includes('django') || lowerPrompt.includes('flask') || lowerPrompt.includes('fastapi')) {
        nodes.push({ id: String(stepId), type: 'pip_install', data: { label: 'Install Python Dependencies' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'pytest_run', data: { label: 'Run Python Tests' } });
        stepId++;
    }
    // Detect security scanning
    if (lowerPrompt.includes('security') || lowerPrompt.includes('scan') || lowerPrompt.includes('sonarqube') || lowerPrompt.includes('devsecops') || lowerPrompt.includes('secure')) {
        nodes.push({ id: String(stepId), type: 'sonarqube_scan', data: { label: 'SonarQube Code Analysis' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'snyk_scan', data: { label: 'Snyk Dependency Scan' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'trivy_scan', data: { label: 'Trivy Vulnerability Scan' } });
        stepId++;
    }
    // Detect Docker
    if (lowerPrompt.includes('docker') || lowerPrompt.includes('container') || lowerPrompt.includes('deploy') || lowerPrompt.includes('ecs') || lowerPrompt.includes('ec2')) {
        nodes.push({ id: String(stepId), type: 'docker_build', data: { label: 'Build Docker Image' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'docker_push', data: { label: 'Push to Container Registry' } });
        stepId++;
    }
    // Detect AWS deployment
    if (lowerPrompt.includes('aws') || lowerPrompt.includes('ecs')) {
        nodes.push({ id: String(stepId), type: 'aws_ecs_deploy', data: { label: 'Deploy to AWS ECS' } });
        stepId++;
    }
    else if (lowerPrompt.includes('ec2')) {
        nodes.push({ id: String(stepId), type: 'aws_ec2_deploy', data: { label: 'Deploy to AWS EC2' } });
        stepId++;
    }
    else if (lowerPrompt.includes('deploy')) {
        nodes.push({ id: String(stepId), type: 'aws_ecs_deploy', data: { label: 'Deploy to Cloud' } });
        stepId++;
    }
    // If we only have checkout, add a default pipeline
    if (nodes.length === 1) {
        nodes.push({ id: String(stepId), type: 'npm_install', data: { label: 'Install Dependencies' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'npm_build', data: { label: 'Build Application' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'sonarqube_scan', data: { label: 'Security Scan' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'snyk_scan', data: { label: 'Dependency Scan' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'docker_build', data: { label: 'Build Docker Image' } });
        stepId++;
        nodes.push({ id: String(stepId), type: 'aws_ecs_deploy', data: { label: 'Deploy to Cloud' } });
        stepId++;
    }
    // Generate edges connecting all steps sequentially
    for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({
            id: `e${nodes[i].id}-${nodes[i + 1].id}`,
            source: nodes[i].id,
            target: nodes[i + 1].id,
        });
    }
    return { nodes, edges };
};
const generatePipelineFromPrompt = async (prompt) => {
    // If no API key, use mock response
    if (!GEMINI_API_KEY) {
        console.log('No GEMINI_API_KEY found, using mock pipeline generation.');
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return getMockPipeline(prompt);
    }
    try {
        const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const systemInstruction = `
    You are an AI DevOps Engineer for OpsPilot. Your job is to convert natural language requests 
    into a structured CI/CD pipeline JSON format.
    
    The user will provide a prompt like: "Deploy my react app to AWS".
    
    You must output ONLY valid JSON representing a flow of nodes and edges.
    Allowed node types: 'github_checkout', 'npm_install', 'npm_build', 'docker_build', 'docker_push', 'sonarqube_scan', 'snyk_scan', 'trivy_scan', 'aws_ecs_deploy', 'aws_ec2_deploy', 'pip_install', 'pytest_run'.
    
    Return the response in this EXACT format:
    {
      "nodes": [
        { "id": "1", "type": "github_checkout", "data": { "label": "Checkout Code" } },
        { "id": "2", "type": "npm_install", "data": { "label": "Install Dependencies" } }
      ],
      "edges": [
        { "id": "e1-2", "source": "1", "target": "2" }
      ]
    }
    No markdown formatting, just raw JSON.
    `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            }
        });
        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error('No response from AI');
    }
    catch (error) {
        console.error('AI Generation Error:', error);
        console.log('Falling back to mock pipeline generation.');
        return getMockPipeline(prompt);
    }
};
exports.generatePipelineFromPrompt = generatePipelineFromPrompt;
//# sourceMappingURL=aiService.js.map