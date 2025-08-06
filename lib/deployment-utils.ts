// Utility functions để check deployment status
export async function checkDeploymentStatus(deploymentId: string) {
  try {
    const response = await fetch(`https://api.vercel.com/v6/deployments/${deploymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
      },
    })
    
    const deployment = await response.json()
    return {
      status: deployment.state,
      url: deployment.url,
      createdAt: deployment.createdAt,
    }
  } catch (error) {
    console.error('Error checking deployment:', error)
    return null
  }
}

export async function triggerDeployment(projectId: string) {
  try {
    const response = await fetch(`https://api.vercel.com/v1/integrations/deploy/${projectId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error triggering deployment:', error)
    return null
  }
}
