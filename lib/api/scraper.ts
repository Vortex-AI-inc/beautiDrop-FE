const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export interface ScrapeJob {
    id: string
    url: string
    status: 'pending' | 'processing' | 'scraping' | 'parsing' | 'completed' | 'failed' | 'confirmed'
    created_at: string
    updated_at: string
    result?: any
    error?: string
    extracted_data?: any
}

export async function submitScrapeJob(url: string, token: string): Promise<ScrapeJob> {
    const response = await fetch(`${API_BASE_URL}/api/v1/scraper/submit/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
    })

    if (!response.ok) {
        throw new Error('Failed to submit scrape job')
    }

    return response.json()
}

export async function getScrapeJob(id: string, token: string): Promise<ScrapeJob> {
    const response = await fetch(`${API_BASE_URL}/api/v1/scraper/${id}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to get scrape job status')
    }

    return response.json()
}

export async function confirmScrapeJob(id: string, token: string, useExtracted: boolean = true, overrides?: any): Promise<any> {
    const body: any = { use_extracted: useExtracted }
    if (overrides) {
        Object.assign(body, overrides)
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/scraper/${id}/confirm/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) {
        throw new Error('Failed to confirm and create shop')
    }

    return response.json()
}

export async function listScrapeJobs(token: string): Promise<ScrapeJob[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/scraper/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to list scrape jobs')
    }

    const data = await response.json()

    return Array.isArray(data) ? data : (data.results || [])
}

export async function deleteScrapeJob(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/scraper/${id}/cancel/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to delete scrape job')
    }
}
