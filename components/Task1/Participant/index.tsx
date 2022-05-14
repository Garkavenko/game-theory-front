import React, {useMemo, useState} from 'react';
import {
  Box, Button,
  Divider,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses, TableContainer,
  TableHead,
  TableRow,
  Typography, useTheme
} from "@mui/material";
import {ArgumentAxis, Chart, LineSeries, Tooltip, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import {EventTracker} from "@devexpress/dx-react-chart";
import Timer from "../Timer";
import Block from "../../common/Block";

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
  const theme = useTheme();
  return (
    <Box>
      <Block title={`Участник #${order}`} titleColor={theme.palette.primary.dark}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ marginRight: 1, borderWidth: 1, borderStyle: 'solid', borderColor: '#91d5ff', backgroundColor: '#e6f7ff', borderRadius: 1, padding: 0.5 }}>
            <Typography sx={{ color: '#096dd9' }}>Значение затрат: <b>{cost}</b></Typography>
          </Box>
          <Box sx={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#87e8de', backgroundColor: '#e6fffb', borderRadius: 1, padding: 0.5 }}>
            <Typography sx={{ color: '#08979c' }}>Текущая оценка: <b>{evaluations?.[(evaluations?.length) - 1] || '-'}</b></Typography>
          </Box>
        </Box>
      </Block>
      {children}
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Box sx={{ flex: 1 }}>
          <Block title="Оценки">
            {/* @ts-ignore */}
            <Chart
              data={evaluationsChart}
              height={300}
            >
              <ArgumentAxis />
              <ValueAxis showTicks />

              <LineSeries valueField="value" argumentField="step" />
              <EventTracker />
              {/* @ts-ignore */}
              <Tooltip targetItem={evaluationsTarget} onTargetItemChange={setEvaluationsTarget} />
            </Chart>
          </Block>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Block title="Функция цели">
            {/* @ts-ignore */}
            <Chart
              data={resultsChart}
              height={300}
            >
              <ArgumentAxis />
              <ValueAxis showTicks />

              <LineSeries valueField="value" argumentField="step" />
              <EventTracker />
              {/* @ts-ignore */}
              <Tooltip targetItem={resultsTarget} onTargetItemChange={setResultsTarget} />
            </Chart>
          </Block>
        </Box>
      </Box>
      <Block title="Значения">
        <TableContainer sx={{ maxHeight: 440, width: 500 }}>
          <Table stickyHeader aria-label="simple table">
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
        </TableContainer>
      </Block>
    </Box>
  )
}

export default Participant;
