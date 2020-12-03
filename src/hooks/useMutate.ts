import { useCallback, useState } from 'react'
import client from '../api/client'

export const useMutate = <M, T>(url: string, method?: string) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [result, setResult] = useState(null)

  const mutate = useCallback(async (data: any) => {
    setErrors([])
    setLoading(true)
    console.log('dataToSend', data)
    try {
      switch (method) {
        case 'PUT': {
          const res = await client.put(url, data)
          setResult(res.data)
          break
        }
        case 'PATCH': {
          const res = await client.patch(url, data)
          setResult(res.data)
          break
        }
        case 'DELETE': {
          const res = await client.delete(url, {
            data: data,
          })
          setResult(res.data)
          break
        }
        default: {
          const res = await client.post(url, data)
          setResult(res.data)
        }
      }
    } catch (e) {
      setErrors((error) => error.concat(e))
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, errors, result, mutate }
}
