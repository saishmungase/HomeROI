"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const BACKEND_URL = "https://hroi.onrender.com"

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const pendingCallbackRef = useRef<((data: any) => void) | null>(null)

  useEffect(() => {
    let ws: WebSocket | null = null;
    
    const connect = () => {
      try {
        const wsUrl = BACKEND_URL
        ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
          console.log("[v0] WebSocket connected")
          setIsConnected(true)
        }

        ws.onmessage = (event) => {
          console.log("[v0] WebSocket message received:", event.data)
          try {
            const data = JSON.parse(event.data)
            if (pendingCallbackRef.current && ws === wsRef.current) {
              const callback = pendingCallbackRef.current
              pendingCallbackRef.current = null
              callback(data)
            }
          } catch (error) {
            console.error("[v0] Failed to parse WebSocket message:", error)
          }
        }

        ws.onerror = (error) => {
          console.error("[v0] WebSocket error:", error)
          setIsConnected(false)
        }

        ws.onclose = () => {
          console.log("[v0] WebSocket disconnected")
          setIsConnected(false)
          pendingCallbackRef.current = null
        }
      } catch (error) {
        console.error("[v0] Failed to create WebSocket:", error)
      }
    }

    connect()

    return () => {
      if (ws) {
        pendingCallbackRef.current = null
        ws.close()
        wsRef.current = null
      }
    }
  }, [])

  const sendRequest = useCallback((request: any, onResponse?: (data: any) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not connected"))
        return
      }

      try {
        let resolved = false
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true
            pendingCallbackRef.current = null
            reject(new Error("Request timeout"))
          }
        }, 30000)

        pendingCallbackRef.current = (data: any) => {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            console.log("[v0] Request response received:", data)
            if (onResponse) {
              onResponse(data)
            }
            resolve(data)
          }
        }

        wsRef.current.send(JSON.stringify(request))
        console.log("[v0] WebSocket request sent:", request)
      } catch (error) {
        reject(error)
      }
    })
  }, [])

  return { sendRequest, isConnected }
}
