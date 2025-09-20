"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LandingPageProps {
  isAuthenticated: boolean;
}

export default function LandingPage({ isAuthenticated }: LandingPageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The Empathetic AI
          </h1>
          <h2 className="text-2xl text-gray-600 mb-8">
            Heartificial Intelligence with a Dash of Emotional Analysis
          </h2>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            Experience personalized AI therapy that understands and responds to your emotions in real-time. 
            Our empathic AI provides supportive conversations tailored to your emotional state.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-4 mb-16">
            {!isAuthenticated && (
              <>
                <Button
                  onClick={() => router.push('/?trial=true')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  🎯 Start Free 5-Minute Trial
                </Button>
                <p className="text-sm text-gray-500">No signup required • Experience AI therapy instantly</p>
              </>
            )}
            
            <div className="pt-4">
              <Link href="/subscription">
                <Button variant="outline" className="px-6 py-3">
                  {isAuthenticated ? 'Upgrade Plan' : 'Sign Up for Full Access'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emotion Detection</h3>
              <p className="text-gray-600">Real-time analysis of your emotional state through voice and conversation patterns.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Responses</h3>
              <p className="text-gray-600">AI adapts its therapeutic approach based on your unique emotional needs and patterns.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Private</h3>
              <p className="text-gray-600">Your conversations are secure and confidential, providing a safe space for emotional expression.</p>
            </div>
          </div>

          {/* Trial Benefits - Only show for non-authenticated users */}
          {!isAuthenticated && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
              <h3 className="text-2xl font-bold mb-6">What You'll Experience in Your Trial</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Voice-Based Therapy</h4>
                      <p className="text-gray-600 text-sm">Natural conversation with our empathic AI therapist</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Real-Time Emotion Analysis</h4>
                      <p className="text-gray-600 text-sm">See how AI detects and responds to your emotions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Choose Your Therapeutic Guide</h4>
                      <p className="text-gray-600 text-sm">Calm, compassionate, clear, or cheerful - voices that meet you where you are</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Personalized Responses</h4>
                      <p className="text-gray-600 text-sm">Experience how AI adapts to your emotional state</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">No Commitment</h4>
                      <p className="text-gray-600 text-sm">Try before you decide - no account required</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Final CTA */}
          <div className="text-center">
            {!isAuthenticated ? (
              <>
                <Button
                  onClick={() => router.push('/?trial=true')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Start Your Free Trial Now
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Ready in seconds • No credit card required
                </p>
              </>
            ) : (
              <Button
                onClick={() => router.push('/chat')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Start Your Session
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 