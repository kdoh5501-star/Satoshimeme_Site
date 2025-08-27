"use client";

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TokenomicsData {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
  icon: string;
  descriptions: string[];
}

interface TokenomicsChartProps {
  data: TokenomicsData[];
}

export const TokenomicsChart: React.FC<TokenomicsChartProps> = ({ data }) => {
  const [hoveredItem, setHoveredItem] = React.useState<TokenomicsData | null>(null);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.percentage),
        backgroundColor: data.map(item => item.color),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '45%',
    rotation: -45, // Rotate to match exact image positioning
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: false, // We'll create a custom legend
      },
      tooltip: {
        enabled: false, // Disable default tooltips
      },
    },
    onHover: (event, elements) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        setHoveredItem(data[index]);
      } else {
        setHoveredItem(null);
      }
    },
    elements: {
      arc: {
        borderJoinStyle: 'round',
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      delay: (context) => context.dataIndex * 100, // Staggered animation
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center">
      {/* Info Panel - Left Side (Transparent) */}
      <div className="w-full lg:w-80 h-80 bg-transparent border-2 border-transparent p-6 flex flex-col justify-center">
        {hoveredItem ? (
          <div className="text-center space-y-4 animate-[fadeInSlideUp_0.3s_ease-out]">
            {/* Icon */}
            <div className="mb-2 flex justify-center">
              {hoveredItem.icon.startsWith('/') ? (
                <img
                  src={hoveredItem.icon}
                  alt={hoveredItem.name}
                  className="w-32 h-32 object-contain"
                />
              ) : (
                <div className="text-4xl">{hoveredItem.icon}</div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-amber-900 font-display leading-tight">
              {hoveredItem.name}
            </h3>

            {/* Percentage and Amount */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-amber-800">
                {hoveredItem.percentage}%
              </div>
              <div className="text-lg font-semibold text-amber-700">
                {formatNumber(hoveredItem.amount)} SATOSHI
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2 pt-2">
              <p className="text-sm font-semibold text-amber-800 mb-2">Usage:</p>
              {hoveredItem.descriptions.map((desc, index) => (
                <p key={index} className="text-sm text-amber-700 leading-relaxed">
                  • {desc}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="mb-2 flex justify-center">
              <img
                src="/icons/chart-icon.png"
                alt="Token Distribution Chart"
                className="w-32 h-32 object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-amber-900 font-display">
              Token Distribution
            </h3>
            <p className="text-amber-700">
              Hover over chart segments to see details
            </p>
          </div>
        )}
      </div>

      {/* Chart - Center */}
      <div className="relative h-80 md:h-96 w-80 md:w-96 chart-container">
        <Doughnut data={chartData} options={options} />

        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-amber-900 font-display">
              SATOSHI
            </div>
            <div className="text-base md:text-lg text-amber-700">
              Token
            </div>
          </div>
        </div>
      </div>

      {/* Legend - Right Side */}
      <div className="w-full lg:w-80 p-6 flex flex-col justify-start">
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-start space-x-3 transition-all duration-300 cursor-pointer animate-[slideInFromBottom_0.8s_ease-out] ${
                hoveredItem?.id === item.id ? 'scale-105' : ''
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'forwards',
                opacity: 0,
              }}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Color indicator */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: item.color }}
              ></div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-amber-900 font-display leading-tight mb-1">
                  {item.name}
                </h4>
                <p className="text-sm text-amber-700">
                  {item.percentage}% • {formatNumber(item.amount)} SATOSHI
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
