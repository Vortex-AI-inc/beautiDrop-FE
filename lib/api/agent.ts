const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export interface AgentAction {
    action_type: string
    success: boolean
    details: any
}

export interface SendMessageResponse {
    response: string
    session_id: string
    message_id: string
    actions_taken: AgentAction[]
    is_authenticated: boolean
    user_role: string
    tokens_used: {
        prompt: number
        completion: number
    }
}

export async function sendMessageToAgent(
    message: string,
    sessionId?: string | null,
    token?: string | null
): Promise<SendMessageResponse> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const body: any = { message }
        if (sessionId) {
            body.session_id = sessionId
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/agent/chat/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.detail || errorData.message || `Failed to send message: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        throw error
    }
}

export async function endChatSession(sessionId: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/agent/sessions/${sessionId}/end/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to end session: ${response.statusText}`)
        }
    } catch (error) {
        throw error
    }
}
