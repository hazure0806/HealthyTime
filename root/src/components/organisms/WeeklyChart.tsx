import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

// 型定義
interface DataItem {
  date: string;
  totalTime: number;
}

interface WeeklyChartProps {
  data: DataItem[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth * (data.length / 6);

  const chartData = {
    labels: data.map(item => `${new Date(item.date).getMonth() + 1}/${new Date(item.date).getDate()}`),
    datasets: [
      {
        data: data.map(item => item.totalTime),
      },
    ],
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <BarChart
        data={chartData}
        width={chartWidth}
        height={220}
        yAxisSuffix="分"
        yAxisLabel=""
        fromZero
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(32, 178, 170, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: "#e0e0e0",
            strokeWidth: 1
          },
          propsForLabels: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginHorizontal: 16,
        }}
        showValuesOnTopOfBars
        withInnerLines={false}
      />
    </ScrollView>
  );
};

export default WeeklyChart;
