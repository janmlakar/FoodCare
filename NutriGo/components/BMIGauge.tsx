import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Rect, Polygon } from 'react-native-svg';

interface BMIGaugeProps {
  bmi: number;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi = 0 }) => {
  const minValue = 10;
  const maxValue = 40;
  const safeBmi = Math.max(minValue, Math.min(maxValue, bmi)); // Clamp BMI to range

  // Define the segments and their corresponding colors
  const segments = [
    { min: 10, max: 16, color: '#bc2020' },
    { min: 16, max: 17, color: '#d38888' },
    { min: 17, max: 18.5, color: '#ffe400' },
    { min: 18.5, max: 25, color: '#008137' },
    { min: 25, max: 30, color: '#ffe400' },
    { min: 30, max: 40, color: '#d38888' },
  ];

  // Calculate the position for the needle
  const progress = (safeBmi - minValue) / (maxValue - minValue);
  const needlePosition = progress * 300; // Scale to width of the gauge

  // Find the segment that contains the BMI value
  const segment = segments.find(seg => safeBmi >= seg.min && safeBmi <= seg.max) || segments[0];

  // Debugging logs
  console.log('safeBmi:', safeBmi);
  console.log('progress:', progress);
  console.log('segment:', segment);
  console.log('needlePosition:', needlePosition);

  return (
    <View style={styles.container}>
      <Text style={styles.bmiText}>Your BMI is considered {bmi >= 18.5 && bmi < 25 ? 'normal' : bmi < 18.5 ? 'underweight' : 'overweight'} ({bmi})</Text>
      <Svg height="50" width="320">
        {segments.map((seg, index) => (
          <Rect
            key={index}
            x={(seg.min - minValue) / (maxValue - minValue) * 300}
            y="20"
            width={(seg.max - seg.min) / (maxValue - minValue) * 300}
            height="10"
            fill={seg.color}
          />
        ))}
        <Polygon
          points={`${needlePosition + 10},10 ${needlePosition - 10},10 ${needlePosition},0`}
          fill="orange"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  bmiText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  label: {
    fontSize: 12,
  },
});

export default BMIGauge;
