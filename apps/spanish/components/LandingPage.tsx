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
            La IA Empática
          </h1>
          <h2 className="text-2xl text-gray-600 mb-8">
            Inteligencia Artificial con un Toque de Análisis Emocional
          </h2>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            Experimenta terapia IA personalizada que entiende y responde a tus emociones en tiempo real. 
            Nuestra IA empática proporciona conversaciones de apoyo adaptadas a tu estado emocional.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-4 mb-16">
            {!isAuthenticated && (
              <>
                <Button
                  onClick={() => router.push('/?trial=true')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  🎯 Iniciar Prueba Gratuita de 5 Minutos
                </Button>
                <p className="text-sm text-gray-500">No se requiere registro • Experimenta terapia IA al instante</p>
              </>
            )}
            
            <div className="pt-4">
              <Link href="/subscription">
                <Button variant="outline" className="px-6 py-3">
                  {isAuthenticated ? 'Actualizar Plan' : 'Registrarse para Acceso Completo'}
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
              <h3 className="text-xl font-semibold mb-2">Detección de Emociones</h3>
              <p className="text-gray-600">Análisis en tiempo real de tu estado emocional a través de patrones de voz y conversación.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Respuestas Personalizadas</h3>
              <p className="text-gray-600">La IA adapta su enfoque terapéutico basado en tus necesidades emocionales únicas y patrones.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguro y Privado</h3>
              <p className="text-gray-600">Tus conversaciones son seguras y confidenciales, proporcionando un espacio seguro para la expresión emocional.</p>
            </div>
          </div>

          {/* Trial Benefits - Only show for non-authenticated users */}
          {!isAuthenticated && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
              <h3 className="text-2xl font-bold mb-6">Lo que Experimentarás en tu Prueba</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Terapia Basada en Voz</h4>
                      <p className="text-gray-600 text-sm">Conversación natural con nuestro terapeuta IA empático</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Análisis de Emociones en Tiempo Real</h4>
                      <p className="text-gray-600 text-sm">Ve cómo la IA detecta y responde a tus emociones</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Elige tu Guía Terapéutica</h4>
                      <p className="text-gray-600 text-sm">Tranquila, compasiva, clara o alegre - voces que te encuentran donde estás</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Respuestas Personalizadas</h4>
                      <p className="text-gray-600 text-sm">Experimenta cómo la IA se adapta a tu estado emocional</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Sin Compromiso</h4>
                      <p className="text-gray-600 text-sm">Prueba antes de decidir - no se requiere cuenta</p>
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
                  Inicia tu Prueba Gratuita Ahora
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Listo en segundos • No se requiere tarjeta de crédito
                </p>
              </>
            ) : (
              <Button
                onClick={() => router.push('/chat')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Iniciar tu Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 