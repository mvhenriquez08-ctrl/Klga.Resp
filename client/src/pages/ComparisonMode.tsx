import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ECGChartSync } from '@/components/ecg/ECGChartSync';
import { ComparisonTable } from '@/components/ecg/ComparisonTable';
import { arrhythmias, categories, getArrhythmiaById } from '@/lib/arrhythmiaData';
import { Play, Pause, RotateCcw, Heart, ArrowLeftRight } from 'lucide-react';

/**
 * Modo Comparativo de Arritmias
 * 
 * Permite visualizar dos arritmias lado a lado con:
 * - Gráficas ECG sincronizadas
 * - Tabla comparativa de parámetros
 * - Información clínica de ambas arritmias
 */

export default function ComparisonMode() {
  const [leftArrhythmiaId, setLeftArrhythmiaId] = useState('normal');
  const [rightArrhythmiaId, setRightArrhythmiaId] = useState('afib');
  const [isPlaying, setIsPlaying] = useState(true);
  const [sharedTime, setSharedTime] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Normal');

  const leftArrhythmia = getArrhythmiaById(leftArrhythmiaId);
  const rightArrhythmia = getArrhythmiaById(rightArrhythmiaId);

  if (!leftArrhythmia || !rightArrhythmia) {
    return <div>Error: Arritmia no encontrada</div>;
  }

  const handleSwapArrhythmias = () => {
    const temp = leftArrhythmiaId;
    setLeftArrhythmiaId(rightArrhythmiaId);
    setRightArrhythmiaId(temp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <ArrowLeftRight className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Modo Comparativo</h1>
          </div>
          <p className="text-gray-600">Compara dos arritmias cardíacas lado a lado</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Controles Principales */}
        <Card className="border-blue-200 shadow-md mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50">
            <CardTitle className="text-lg">Controles</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Reproducir
                  </>
                )}
              </Button>
              <Button
                onClick={() => setSharedTime(0)}
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
              <Button
                onClick={handleSwapArrhythmias}
                variant="outline"
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Intercambiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gráficas ECG Sincronizadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="h-96">
            <ECGChartSync
              arrhythmia={leftArrhythmia}
              isPlaying={isPlaying}
              sharedTime={sharedTime}
              onTimeUpdate={(time) => setSharedTime(time)}
              title="Arritmia Izquierda"
            />
          </div>
          <div className="h-96">
            <ECGChartSync
              arrhythmia={rightArrhythmia}
              isPlaying={isPlaying}
              sharedTime={sharedTime}
              title="Arritmia Derecha"
            />
          </div>
        </div>

        {/* Tabla Comparativa */}
        <div className="mb-8">
          <ComparisonTable
            leftArrhythmia={leftArrhythmia}
            rightArrhythmia={rightArrhythmia}
          />
        </div>

        {/* Información Clínica Lado a Lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Información Izquierda */}
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-lg">{leftArrhythmia.name}</CardTitle>
              <CardDescription>{leftArrhythmia.category}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{leftArrhythmia.clinicalInfo}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Características ECG</h3>
                <ul className="space-y-1">
                  {leftArrhythmia.characteristics.slice(0, 4).map((char, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {leftArrhythmia.treatment.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tratamiento</h3>
                  <ul className="space-y-1">
                    {leftArrhythmia.treatment.slice(0, 2).map((treat, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span>{treat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información Derecha */}
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-lg">{rightArrhythmia.name}</CardTitle>
              <CardDescription>{rightArrhythmia.category}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{rightArrhythmia.clinicalInfo}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Características ECG</h3>
                <ul className="space-y-1">
                  {rightArrhythmia.characteristics.slice(0, 4).map((char, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {rightArrhythmia.treatment.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tratamiento</h3>
                  <ul className="space-y-1">
                    {rightArrhythmia.treatment.slice(0, 2).map((treat, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span>{treat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selectores de Arritmias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selector Izquierdo */}
          <Card className="border-blue-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Seleccionar Arritmia Izquierda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category}>
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                      className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg font-semibold text-blue-900 transition-colors"
                    >
                      {category}
                    </button>
                    {expandedCategory === category && (
                      <div className="mt-2 space-y-2 ml-2">
                        {arrhythmias
                          .filter((arr) => arr.category === category)
                          .map((arr) => (
                            <button
                              key={arr.id}
                              onClick={() => setLeftArrhythmiaId(arr.id)}
                              className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                                leftArrhythmiaId === arr.id
                                  ? 'bg-blue-600 text-white font-semibold'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {arr.name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selector Derecho */}
          <Card className="border-blue-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Seleccionar Arritmia Derecha</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category}>
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                      className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg font-semibold text-blue-900 transition-colors"
                    >
                      {category}
                    </button>
                    {expandedCategory === category && (
                      <div className="mt-2 space-y-2 ml-2">
                        {arrhythmias
                          .filter((arr) => arr.category === category)
                          .map((arr) => (
                            <button
                              key={arr.id}
                              onClick={() => setRightArrhythmiaId(arr.id)}
                              className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                                rightArrhythmiaId === arr.id
                                  ? 'bg-blue-600 text-white font-semibold'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {arr.name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
