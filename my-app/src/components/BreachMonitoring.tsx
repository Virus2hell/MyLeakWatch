import { useState } from "react"

type NotificationFrequency = "daily" | "weekly" | "monthly"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

const BreachMonitoring = () => {
  const [email, setEmail] = useState("")
  const [enabled, setEnabled] = useState(true)
  const [frequency, setFrequency] =
    useState<NotificationFrequency>("daily")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/monitor-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          enabled,
          frequency,
          // later: userEmail from auth
          userEmail: email,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong")
      }

      setMessage("✅ Email successfully added to breach monitoring")
      setEmail("")
    } catch (err: any) {
      setError(err.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#12172a] rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Email Breach Monitoring
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          Get notified if your email appears in known data breaches.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#0b0f1a] text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Enable */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Enable Monitoring</p>
              <p className="text-xs text-gray-500">
                Automated breach checks
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                enabled ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full transition ${
                  enabled ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Notification Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as NotificationFrequency)
              }
              className="w-full px-4 py-2 rounded-md bg-[#0b0f1a] text-white border border-gray-700"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !enabled}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Start Monitoring"}
          </button>

          {/* Messages */}
          {message && (
            <div className="text-sm text-green-400 text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-400 text-center">
              {error}
            </div>
          )}
        </form>

        <div className="mt-6 text-xs text-gray-500 bg-[#0b0f1a] p-3 rounded-md">
          🔐 We never store passwords  
          ⚠️ You’ll only be notified for new breaches
        </div>
      </div>
    </div>
  )
}

export default BreachMonitoring
