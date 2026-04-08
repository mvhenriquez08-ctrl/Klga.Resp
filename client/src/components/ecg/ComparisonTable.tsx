import React from 'react';
import { ArrhythmiaData } from '@/lib/arrhythmiaData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonTableProps {
  leftArrhythmia: ArrhythmiaData;
  rightArrhythmia: ArrhythmiaData;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  leftArrhythmia,
  rightArrhythmia,
}) => {
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

  const getParameterDifference = (left: number, right: number): string => {
    if (left === right) return '=';
    return left > right ? '↑' : '↓';
  };

  const comparisonRows = [
    {
      label: 'Nombre',
      left: leftArrhythmia.name,
      right: rightArrhythmia.name,
      type: 'text'
    },
    {
      label: 'Categoría',
      left: leftArrhythmia.category,
      right: rightArrhythmia.category,
      type: 'text'
    },
    {
      label: 'Severidad',
      left: getSeverityLabel(leftArrhythmia.severity),
      right: getSeverityLabel(rightArrhythmia.severity),
      type: 'badge'
    },
    {
      label: 'Frecuencia Cardíaca',
      left: `${leftArrhythmia.heartRate} bpm`,
      right: `${rightArrhythmia.heartRate} bpm`,
      type: 'number',
      leftValue: leftArrhythmia.heartRate,
      rightValue: rightArrhythmia.heartRate
    },
    {
      label: 'Ritmo',
      left: leftArrhythmia.rhythm,
      right: rightArrhythmia.rhythm,
      type: 'text'
    },
    {
      label: 'Intervalo PR',
      left: `${leftArrhythmia.ecgParameters.prInterval} ms`,
      right: `${rightArrhythmia.ecgParameters.prInterval} ms`,
      type: 'number',
      leftValue: leftArrhythmia.ecgParameters.prInterval,
      rightValue: rightArrhythmia.ecgParameters.prInterval
    },
    {
      label: 'Ancho QRS',
      left: `${leftArrhythmia.ecgParameters.qrsWidth} ms`,
      right: `${rightArrhythmia.ecgParameters.qrsWidth} ms`,
      type: 'number',
      leftValue: leftArrhythmia.ecgParameters.qrsWidth,
      rightValue: rightArrhythmia.ecgParameters.qrsWidth
    },
    {
      label: 'Intervalo QT',
      left: `${leftArrhythmia.ecgParameters.qtInterval} ms`,
      right: `${rightArrhythmia.ecgParameters.qtInterval} ms`,
      type: 'number',
      leftValue: leftArrhythmia.ecgParameters.qtInterval,
      rightValue: rightArrhythmia.ecgParameters.qtInterval
    },
    {
      label: 'Segmento ST',
      left: leftArrhythmia.ecgParameters.stSegment,
      right: rightArrhythmia.ecgParameters.stSegment,
      type: 'text'
    }
  ];

  return (
    <Card className="border-blue-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Comparación de Parámetros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-blue-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Parámetro</th>
                <th className="text-center py-3 px-4 font-semibold text-blue-900 bg-blue-50">
                  {leftArrhythmia.name}
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Diferencia</th>
                <th className="text-center py-3 px-4 font-semibold text-blue-900 bg-blue-50">
                  {rightArrhythmia.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="py-3 px-4 font-medium text-gray-700">{row.label}</td>
                  <td className="py-3 px-4 text-center">
                    {row.type === 'badge' ? (
                      <Badge className={`${getSeverityColor(leftArrhythmia.severity)}`}>
                        {row.left}
                      </Badge>
                    ) : (
                      <span className="font-mono">{row.left}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.type === 'number' && (
                      <span className="font-bold text-lg text-blue-600">
                        {getParameterDifference(row.leftValue || 0, row.rightValue || 0)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.type === 'badge' ? (
                      <Badge className={`${getSeverityColor(rightArrhythmia.severity)}`}>
                        {row.right}
                      </Badge>
                    ) : (
                      <span className="font-mono">{row.right}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
