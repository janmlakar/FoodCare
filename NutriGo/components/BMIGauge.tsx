import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Defs, Marker, Polygon, G, TextPath, Circle } from 'react-native-svg';

interface BMIGaugeProps {
  bmi: number;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi }) => {
  const minValue = 10;
  const maxValue = 40;
  const safeBmi = Math.max(minValue, Math.min(maxValue, bmi)); // Clamp BMI to range
  const angle = ((safeBmi - minValue) / (maxValue - minValue)) * 180 - 90;

  // Calculate needle coordinates
  const x2 = 140 + 75 * Math.cos((angle * Math.PI) / 180);
  const y2 = 140 + 75 * Math.sin((angle * Math.PI) / 180);

  return (
    <View style={styles.container}>
      <Svg height="250" width="300" viewBox="0 0 300 163">
        <G transform="translate(18,18)">
          <Defs>
            <Marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <Polygon points="0 0, 10 3.5, 0 7" />
            </Marker>
            <Path id="curvetxt1" d="M-4 140 A140 140, 0, 0, 1, 284 140" fill="none" />
            <Path id="curvetxt2" d="M33 43.6 A140 140, 0, 0, 1, 280 140" fill="none" />
            <Path id="curvetxt3" d="M95 3 A140 140, 0, 0, 1, 284 140" fill="none" />
            <Path id="curvetxt4" d="M235.4 33 A140 140, 0, 0, 1, 284 140" fill="none" />
          </Defs>
          <Path d="M0 140 A140 140, 0, 0, 1, 6.9 96.7 L140 140 Z" fill="#bc2020" />
          <Path d="M6.9 96.7 A140 140, 0, 0, 1, 12.1 83.1 L140 140 Z" fill="#d38888" />
          <Path d="M12.1 83.1 A140 140, 0, 0, 1, 22.6 63.8 L140 140 Z" fill="#ffe400" />
          <Path d="M22.6 63.8 A140 140, 0, 0, 1, 96.7 6.9 L140 140 Z" fill="#008137" />
          <Path d="M96.7 6.9 A140 140, 0, 0, 1, 169.1 3.1 L140 140 Z" fill="#ffe400" />
          <Path d="M169.1 3.1 A140 140, 0, 0, 1, 233.7 36 L140 140 Z" fill="#d38888" />
          <Path d="M233.7 36 A140 140, 0, 0, 1, 273.1 96.7 L140 140 Z" fill="#bc2020" />
          <Path d="M273.1 96.7 A140 140, 0, 0, 1, 280 140 L140 140 Z" fill="#8a0101" />
          <Path d="M45 140 A90 90, 0, 0, 1, 230 140 Z" fill="#fff" />
          <Circle cx="140" cy="140" r="5" fill="#666" />
          <G style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 2 }}>
            <SvgText x="25" y="111" transform="rotate(-72, 25, 111)">16</SvgText>
            <SvgText x="30" y="96" transform="rotate(-66, 30, 96)">17</SvgText>
            <SvgText x="35" y="83" transform="rotate(-57, 35, 83)">18.5</SvgText>
            <SvgText x="97" y="29" transform="rotate(-18, 97, 29)">25</SvgText>
            <SvgText x="157" y="20" transform="rotate(12, 157, 20)">30</SvgText>
            <SvgText x="214" y="45" transform="rotate(42, 214, 45)">35</SvgText>
            <SvgText x="252" y="95" transform="rotate(72, 252, 95)">40</SvgText>
          </G>
          <G style={{ fontSize: 14 }}>
            <SvgText>
              <TextPath href="#curvetxt1">Underweight</TextPath>
            </SvgText>
            <SvgText>
              <TextPath href="#curvetxt2">Normal</TextPath>
            </SvgText>
            <SvgText>
              <TextPath href="#curvetxt3">Overweight</TextPath>
            </SvgText>
            <SvgText>
              <TextPath href="#curvetxt4">Obesity</TextPath>
            </SvgText>
          </G>
          <Line
            x1="140"
            y1="140"
            x2={x2}
            y2={y2}
            stroke="#666"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
          <SvgText x="67" y="120" fontSize="30" fontWeight="bold" fill="#000">
            BMI = {bmi}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  bmiCategory: {
    fontSize: 18,
  },
});

export default BMIGauge;
