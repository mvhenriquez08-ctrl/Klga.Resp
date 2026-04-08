import React from "react";
import { nivTopics, type NIVTopic } from "@/data/ventilation";

export function NIVSection() {
  return (
    <div id="vni" className="space-y-8 scroll-mt-24">
      <h2 className="text-3xl font-bold text-cyan-300 border-b-2 border-cyan-700 pb-2">
        Ventilación No Invasiva (VNI)
      </h2>
      {nivTopics.map((topic: NIVTopic) => (
        <div
          key={topic.id}
          className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700 transition-all hover:border-cyan-600/50"
        >
          <h3 className="text-2xl font-semibold text-cyan-400 mb-3">
            {topic.title}
          </h3>
          <p className="text-gray-400 italic mb-4">{topic.summary}</p>

          {topic.image && (
            <div className="my-4 flex justify-center bg-gray-900/50 p-4 rounded-lg">
              <img
                src={topic.image}
                alt={topic.title}
                className="rounded-lg max-w-md w-full shadow-md object-contain"
              />
            </div>
          )}

          <div className="space-y-3 text-gray-300 prose prose-invert prose-p:my-1">
            {topic.content.map((paragraph: string, index: number) => (
              <p
                key={index}
                dangerouslySetInnerHTML={{
                  __html: paragraph.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="text-cyan-400/90">$1</strong>'
                  ),
                }}
              />
            ))}
          </div>

          {topic.keyPoints && topic.keyPoints.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-cyan-500 mb-3">
                Puntos Clave:
              </h4>
              <ul className="space-y-2 list-inside">
                {topic.keyPoints.map((point: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
