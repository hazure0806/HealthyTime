import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface DayChartProps {
  data: { time: string; totalTime: number }[];
}

const DayChart: React.FC<DayChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.time),
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
        width={Math.max(Dimensions.get('window').width, 100 * data.length)}
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
            strokeDasharray: '', // 破線を実線に
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
          marginHorizontal: 16, // 左右に余白を追加
        }}
        showValuesOnTopOfBars
        withInnerLines={false}
      />
    </ScrollView>
  );
};

export default DayChart;
