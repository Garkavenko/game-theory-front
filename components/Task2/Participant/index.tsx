import React, {useMemo, useState} from 'react';
import {Box, Divider, styled, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow} from "@mui/material";
import {ArgumentAxis, Chart, LineSeries, Tooltip, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import {EventTracker} from "@devexpress/dx-react-chart";

interface ParticipantProps {
  cost?: number;
  evaluations?: number[];
  results?: number[];
  order: number;
  compact?: boolean;
  children?: React.ReactNode;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Participant({ cost, evaluations, order, results, children }: ParticipantProps) {
  const [evaluationsTarget, setEvaluationsTarget] = useState();
  const [resultsTarget, setResultsTarget] = useState();
  const resultsChart = useMemo(() => results?.map((r, i) => ({ step: i+ 1, value: r })), [results]);
  const evaluationsChart = useMemo(() => evaluations?.map((r, i) => ({ step: i+ 1, value: r })), [evaluations]);
  return (
    <Box>
      <h3>Участник #{order}</h3>
      <h4>Значение затрат: {cost}</h4>
      <h4>Текущая оценка: {evaluations?.[(evaluations?.length) - 1] || '-'}</h4>
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        {children}
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Box sx={{ flex: 1 }}>
          <h3>
            Оценки
          </h3>
          <Chart
            data={evaluationsChart}
            height={300}
          >
            <ArgumentAxis />
            <ValueAxis showTicks />

            <LineSeries valueField="value" argumentField="step" />
            <EventTracker />
            <Tooltip targetItem={evaluationsTarget} onTargetItemChange={setEvaluationsTarget} />
          </Chart>
        </Box>
        <Box sx={{ flex: 1 }}>
          <h3>
            Функция цели
          </h3>
          <Chart
            data={resultsChart}
            height={300}
          >
            <ArgumentAxis />
            <ValueAxis showTicks />

            <LineSeries valueField="value" argumentField="step" />
            <EventTracker />
            <Tooltip targetItem={resultsTarget} onTargetItemChange={setResultsTarget} />
          </Chart>
        </Box>
      </Box>
      <h4>Значения</h4>
      <Box sx={{ height: 400, width: 400, overflow: 'auto' }}>
          <Table aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Шаг</StyledTableCell>
                <StyledTableCell align="right">Оценка</StyledTableCell>
                <StyledTableCell align="right">Значение цели</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {([...(evaluations || [])].reverse())?.map((e, i) => (
                <StyledTableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    {(evaluations || []).length - i}
                  </StyledTableCell>
                  <StyledTableCell align="right">{e}</StyledTableCell>
                  <StyledTableCell align="right">{results?.[(evaluations || []).length - i - 1] || '-'}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
      </Box>
    </Box>
  )
}

export default Participant;
