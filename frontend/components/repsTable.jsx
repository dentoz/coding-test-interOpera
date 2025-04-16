import {
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  Skeleton,
  TableBody,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useState } from "react";
import { isEmpty } from "lodash";

const TextSkeleton = () => <Skeleton variant="text" />;

const Row = ({ data, loading }) => {
  const [open, setOpen] = useState(false);
  const longestLength = Math.max(
    data.skills.length,
    data.deals.length,
    data.clients.length
  );

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {!loading && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
          {loading ? <TextSkeleton /> : data.name}
        </TableCell>
        <TableCell align="right">
          {loading ? <TextSkeleton /> : data.role}
        </TableCell>
        <TableCell align="right">
          {loading ? <TextSkeleton /> : data.region}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Skills</TableCell>
                    <TableCell>Deals</TableCell>
                    <TableCell>Clients</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: longestLength }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {data.skills[index] || ""}
                      </TableCell>

                      {!isEmpty(data.deals[index]) ? (
                      <TableCell component="th" scope="row">
                        {`${data.deals[index]?.client || ""} | ${
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(data.deals[index]?.value) || ""
                        } | ${data.deals[index]?.status || ""}`}
                      </TableCell>) : <TableCell />}


                      {!isEmpty(data.clients[index]) ? (
                        <TableCell component="th" scope="row">
                          {`${data.clients[index]?.name || ""} | ${
                            data.clients[index]?.industry || ""
                          } | ${data.clients[index]?.contact || ""}`}
                        </TableCell>
                      ) : <TableCell />}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const RepsTable = ({ loading, reps }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>{loading ? <TextSkeleton /> : "Name"}</TableCell>
            <TableCell align="right">
              {loading ? <TextSkeleton /> : "Role"}
            </TableCell>
            <TableCell align="right">
              {loading ? <TextSkeleton /> : "Region"}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reps.map((rep) => (
            <Row key={rep.name} data={rep} loading={loading} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
