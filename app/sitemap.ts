import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://seller-margin-lab.vercel.app'
  const now = new Date()
  
  return [
    {
      url: baseUrl,
      lastModified: now.toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}

