import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ECGChart } from '@/components/ecg/ECGChart';
import { arrhythmias, categories, getArrhythmiaById } from '@/lib/arrhythmiaData';
import { Play, Pause, RotateCcw, Heart, ArrowLeftRight, BookOpen } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * Módulo de Arritmias Cardíacas - Versión Mejorada
 * 
 * Diseño: Interfaz clínica elegante con enfoque en visualización de ECG
 * - Paleta: Azul médico profesional con acentos rojos (ECG)
 * - Layout: Panel de control izquierdo + visualización ECG principal derecha
 */

export default function ArrhythmiasLibrary() {
  const [, setLocation] = useLocation();
  const [selectedArrhythmiaId, setSelectedArrhythmiaId] = useState('normal');
  const [isPlaying, setIsPlaying] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Normal');

  const selectedArrhythmia = getArrhythmiaById(selectedArrhythmiaId);

  if (!selectedArrhythmia) {
    return <div>Error: Arritmia no encontrada</div>;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'Leve';
      case 'moderate':
        return 'Moderada';
      case 'severe':
        return 'Severa';
      default:
        return 'Desconocida';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-xl">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Biblioteca de Arritmias</h1>
                <p className="text-gray-500 text-sm">Visualización interactiva de patrones ECG con precisión clínica</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setLocation('/arritmias/comparativo')}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Modo Comparativo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de Control Izquierdo */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información de la Arritmia Seleccionada */}
            <Card className="border-blue-100 shadow-sm overflow-hidden">
              <div className="h-2 bg-blue-600 w-full" />
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-xl font-bold text-gray-900">{selectedArrhythmia.name}</CardTitle>
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-blue-600">{selectedArrhythmia.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className={`${getSeverityColor(selectedArrhythmia.severity)} border-none px-3 py-1`}>
                    Severidad: {getSeverityLabel(selectedArrhythmia.severity)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
                    <p className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-1">FC Promedio</p>
                    <p className="font-bold text-lg text-blue-900">{selectedArrhythmia.heartRate} <span className="text-xs font-normal">bpm</span></p>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
                    <p className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-1">Regularidad</p>
                    <p className="font-bold text-lg text-blue-900">{selectedArrhythmia.rhythm}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parámetros ECG */}
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50 mb-2">
                <CardTitle className="text-sm font-bold text-gray-700">Parámetros Técnicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Intervalo PR:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">{selectedArrhythmia.ecgParameters.prInterval} ms</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Ancho QRS:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">{selectedArrhythmia.ecgParameters.qrsWidth} ms</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Intervalo QT:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">{selectedArrhythmia.ecgParameters.qtInterval} ms</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Segmento ST:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs leading-none text-center min-w-[60px]">{selectedArrhythmia.ecgParameters.stSegment}</span>
                </div>
              </CardContent>
            </Card>

            {/* Selector de Arritmias */}
            <Card className="border-blue-100 shadow-sm max-h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-gray-700">Explorar Arritmias</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto pt-0 pr-2">
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="space-y-1">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                        className={`w-full text-left px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-between ${
                          expandedCategory === category 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                        <span className="text-[10px] opacity-70">
                          {expandedCategory === category ? '▼' : '▶'}
                        </span>
                      </button>
                      {expandedCategory === category && (
                        <div className="mt-1 space-y-1 pl-2">
                          {arrhythmias
                            .filter((arr) => arr.category === category)
                            .map((arr) => (
                              <button
                                key={arr.id}
                                onClick={() => setSelectedArrhythmiaId(arr.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-xs ${
                                  selectedArrhythmiaId === arr.id
                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-bold'
                                    : 'text-gray-500 hover:bg-gray-100'
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

          {/* Panel Principal Derecho */}
          <div className="lg:col-span-3 space-y-8">
            {/* Gráfica ECG */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden rounded-3xl">
              <CardHeader className="bg-white border-b border-gray-50 pb-4 pt-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Monitor Holter (25 mm/s)</CardTitle>
                  <CardDescription className="text-blue-500 font-medium">Calibración: 10 mm/mV (0.1 mV por mm)</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        size="sm"
                        className={`${isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} border-none shadow-none font-bold`}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                        {isPlaying ? 'PAUSAR' : 'REANUDAR'}
                    </Button>
                    <Button
                        onClick={() => {}}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[450px] bg-white border-b border-gray-100">
                  <ECGChart arrhythmia={selectedArrhythmia} isPlaying={isPlaying} />
                </div>
                <div className="bg-slate-900 p-4 flex justify-around items-center">
                    <div className="text-center">
                        <p className="text-slate-500 text-[10px] font-bold tracking-widest mb-1 uppercase">Frecuencia</p>
                        <p className="text-green-400 font-mono text-2xl font-bold">{selectedArrhythmiaId === 'asystole' || selectedArrhythmiaId === 'vfib' ? '---' : selectedArrhythmia.heartRate}<span className="text-xs text-slate-400 ml-1">BPM</span></p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-800" />
                    <div className="text-center">
                        <p className="text-slate-500 text-[10px] font-bold tracking-widest mb-1 uppercase">Status</p>
                        <p className={`font-mono text-lg font-bold ${selectedArrhythmia.severity === 'severe' ? 'text-red-500' : 'text-blue-400'}`}>
                            {selectedArrhythmia.severity === 'severe' ? 'CRITICAL' : 'STABLE'}
                        </p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-800" />
                    <div className="text-center">
                        <p className="text-slate-500 text-[10px] font-bold tracking-widest mb-1 uppercase">O2 Sat</p>
                        <p className="text-cyan-400 font-mono text-2xl font-bold">98<span className="text-xs text-slate-400 ml-1">%</span></p>
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* Información Clínica Expandida */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                             <BookOpen className="w-5 h-5 text-blue-600" />
                             Criterios Diagnósticos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3">
                            {selectedArrhythmia.characteristics.map((char, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">
                                    {idx + 1}
                                </span>
                                <span>{char}</span>
                            </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                             <Heart className="w-5 h-5 text-red-600" />
                             Contexto y Manejo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <h3 className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-tight">Descripción Clínica</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{selectedArrhythmia.clinicalInfo}</p>
                        </div>

                        {selectedArrhythmia.treatment.length > 0 && (
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-tight">Abordaje Terapéutico</h3>
                            <ul className="space-y-2">
                            {selectedArrhythmia.treatment.map((treat, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-center gap-3 bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>{treat}</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                        )}
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

