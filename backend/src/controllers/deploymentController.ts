import { Request, Response } from 'express';
import Pipeline from '../models/Pipeline';
import Report from '../models/Report';

export const renderLiveDeployment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pipeline = await Pipeline.findById(id);

    if (!pipeline) {
      res.status(404).send('<h1>404 - Pipeline Not Found</h1>');
      return;
    }

    if (pipeline.status !== 'success') {
      res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h1>Deployment Not Ready</h1>
          <p>This pipeline is currently in status: <strong>${pipeline.status}</strong></p>
          <p>Please wait for the pipeline to succeed before viewing the deployment.</p>
        </div>
      `);
      return;
    }

    // Check if there was a deployment report generated to grab realistic metrics
    const deploymentReport = await Report.findOne({ 
      pipelineId: pipeline._id, 
      reportType: 'deployment' 
    });

    const repo = (pipeline as any).githubRepo || 'Unknown Repository';
    const branch = (pipeline as any).githubBranch || 'main';
    const provider = deploymentReport?.metrics?.provider || 'AWS Cloud';
    const version = deploymentReport?.metrics?.currentVersion || 'v1.0.0';

    // Generate a sleek, modern HTML page simulating the deployed app
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Deployment - ${pipeline.name}</title>
        <style>
          :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #3b82f6;
            --success: #10b981;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            background-color: var(--card-bg);
            border: 1px solid #334155;
            border-radius: 16px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
          }
          h1 {
            margin-top: 0;
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(90deg, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p {
            color: var(--text-muted);
            line-height: 1.6;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background-color: rgba(16, 185, 129, 0.1);
            color: var(--success);
            padding: 6px 12px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 24px;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }
          .status-dot {
            width: 8px;
            height: 8px;
            background-color: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--success);
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 32px;
            text-align: left;
          }
          .detail-box {
            background-color: rgba(15, 23, 42, 0.5);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #334155;
          }
          .detail-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            margin-bottom: 4px;
            display: block;
          }
          .detail-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-main);
            word-break: break-all;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: var(--text-muted);
          }
          .powered-by {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 8px;
          }
          .ops-logo {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="status-badge">
            <div class="status-dot"></div>
            System Online
          </div>
          
          <h1>Welcome to Your Deployed App</h1>
          <p>Congratulations! Your application has been successfully built, secured, and deployed by the OpsPilot DevSecOps pipeline.</p>
          
          <div class="details-grid">
            <div class="detail-box">
              <span class="detail-label">Pipeline Name</span>
              <span class="detail-value">${pipeline.name}</span>
            </div>
            <div class="detail-box">
              <span class="detail-label">Source Repository</span>
              <span class="detail-value">${repo}</span>
            </div>
            <div class="detail-box">
              <span class="detail-label">Branch</span>
              <span class="detail-value">${branch}</span>
            </div>
            <div class="detail-box">
              <span class="detail-label">Provider Infrastructure</span>
              <span class="detail-value">${provider}</span>
            </div>
          </div>
          
          <div class="footer">
            <div>Deployment Version: ${version} • Generated live by OpsPilot Engine</div>
            <div class="powered-by">
              Powered by <span class="ops-logo">OpsPilot</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('<h1>Server Error Generating Deployment Preview</h1>');
  }
};
