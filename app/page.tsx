'use client'

import { useState } from 'react'
import { Clock, MapPin, Sparkles, Construction, CloudRain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const [origin, setOrigin] = useState('100 N Academy St, Cary, NC 27513')
  const [destination, setDestination] = useState('2 Hannover Sq, Raleigh, NC 27601')
  const [arrivalTime, setArrivalTime] = useState('09:00')
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<any>(null)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const today = new Date()
      const arrivalDateTime = new Date(today.toDateString() + ' ' + arrivalTime)
      
      const response = await fetch('https://workflowly.online/webhook/arriveby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          arrivalTime: arrivalDateTime.toISOString(),
          bufferMinutes: 15
        })
      })

      const data = await response.json()
      setRecommendation(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-2">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ArriveBy
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Commute Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Plan Your Commute
            </CardTitle>
            <CardDescription>
              Tell us where and when you need to arrive - we'll handle the rest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting From
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter starting address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Going To
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter destination address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Arrive By
              </label>
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Get AI Recommendation
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {recommendation && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Recommendation */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-6 h-6" />
                  Your Personalized Departure Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold mb-2">
                  {recommendation.recommendation?.departureTime || 'N/A'}
                </div>
                <p className="text-blue-100 text-lg mt-4">
                  {recommendation.recommendation?.message || 'Leave soon to arrive on time'}
                </p>
              </CardContent>
            </Card>

            {/* Route Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Distance</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {recommendation.details?.route?.distance || 'N/A'}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Travel Time</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {recommendation.details?.route?.duration || 'N/A'}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Buffer Time</div>
                  <div className="text-2xl font-bold text-gray-900">15 min</div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            {recommendation.aiAnalysis && (
              <Card className="shadow-lg border-l-4 border-indigo-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {recommendation.aiAnalysis}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Conditions */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Weather */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CloudRain className="w-5 h-5 text-blue-600" />
                    Weather Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature</span>
                      <span className="font-semibold">{recommendation.details?.weather?.temperature || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conditions</span>
                      <span className="font-semibold">{recommendation.details?.weather?.conditions || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precipitation</span>
                      <span className="font-semibold">{recommendation.details?.weather?.precipChance || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Traffic */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Construction className="w-5 h-5 text-orange-600" />
                    Traffic & Construction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Incidents</span>
                      <span className="font-semibold">{recommendation.details?.traffic?.incidents || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Construction Zones</span>
                      <span className="font-semibold">{recommendation.details?.traffic?.construction || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Details</span>
                      <span className="font-semibold text-green-600">
                        {recommendation.details?.traffic?.constructionDetails || 'No issues reported'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>Powered by AI • Real-time Traffic • Live Weather</p>
        </div>
      </footer>
    </div>
  )
}
