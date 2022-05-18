import {symbol, symbolCircle} from "d3-shape";
import React from "react";
import {LineSeries, ScatterSeries} from "@devexpress/dx-react-chart-material-ui";


export const colors = [
  '#42A5F5',
  '#FF7043',
  '#9CCC65',
  '#FFCA28',
  '#26A69A',
  '#EC407A',
  '#BF0603',
  '#5398BE',
  '#F7C1BB',
  '#885A5A',
  '#607196',
  '#BABFD1',
  '#D741A7',
  '#3A1772',
  '#F2CD5D',
  '#353A47',
  '#84B082',
  '#DC136C',
  '#72B01D',
  '#3F7D20',
  '#FFC759',
  '#FF7B9C',
  '#DEA54B',
  '#F2A359',
  '#240B36',
  '#2D728F',
];

export const Point = (type: any, styles: any) => {
  const Component = (props: any) => {
    const {
      arg, val, color,
    } = props;
    return (
      <path
        fill={color}
        transform={`translate(${arg} ${val})`}
        d={symbol().size(() => 50).type(type)() || undefined}
        style={styles}
      />
    );
  };
  Component.displayName = 'PointResult';
  return Component;
}

export const CirclePoint = Point(symbolCircle, {
  stroke: 'white',
  strokeWidth: '1px',
});

export const LineWithCirclePoint = (props: any) => (
  <React.Fragment>
    <LineSeries.Path {...props} />
    <ScatterSeries.Path {...props} pointComponent={CirclePoint} />
  </React.Fragment>
);

LineWithCirclePoint.displayName = 'LineWithCirclePoint';
