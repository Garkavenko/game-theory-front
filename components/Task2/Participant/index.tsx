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
import { round } from 'lodash';
import {ArgumentAxis, Chart, LineSeries, Tooltip, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import {EventTracker} from "@devexpress/dx-react-chart";
import Timer from "../Timer";
import Block from "../../common/Block";
import {LineWithCirclePoint} from "../../common/charts/helpers";
import UsersData from "../UsersData";

interface ParticipantProps {
  cost?: number;
  evaluations?: number[];
  results?: number[];
  order: number;
  compact?: boolean;
  children?: React.ReactNode;
  users?: any[];
  canSeeOthers?: boolean;
  centerResults?: number[];
  nextTickAt?: number;
  currentStep?: number;
  lambdas?: number[];
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

function Participant({ cost, lambdas, evaluations, order, results, children, centerResults, canSeeOthers, users, compact, nextTickAt, currentStep }: ParticipantProps) {
  const [evaluationsTarget, setEvaluationsTarget] = useState();
  const [resultsTarget, setResultsTarget] = useState();
  const resultsChart = useMemo(() => results?.map((r, i) => ({ step: i+ 1, value: r })), [results]);
  const evaluationsChart = useMemo(() => evaluations?.map((r, i) => ({ step: i+ 1, value: round(r, 1) })), [evaluations]);
  const theme = useTheme();
  return (
    <Box>
      {children}
      {!canSeeOthers ? (
        <>
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <Block title="Оценки">
                {/* @ts-ignore */}
                <Chart
                  data={evaluationsChart}
                  height={400}
                >
                  <ArgumentAxis />
                  <ValueAxis showTicks />

                  <LineSeries seriesComponent={LineWithCirclePoint} valueField="value" argumentField="step" />
                  <EventTracker />
                  {/* @ts-ignore */}
                  <Tooltip targetItem={evaluationsTarget} onTargetItemChange={setEvaluationsTarget} />
                </Chart>
              </Block>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Block title="Значения">
                <TableContainer sx={{ height: 400, width: '100%' }}>
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
                          <StyledTableCell align="right">{round(results?.[(evaluations || []).length - i - 1] || 0, 1) || '-'}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Block>
            </Box>
          </Box>
        </>
      ) : (
        <UsersData users={users || []} centerResults={centerResults || []} lambdas={lambdas} />
      )}
    </Box>
  )
}

export default Participant;
