import React from "react";

// material-ui
import { useTheme } from "@emotion/react";
import {
  Box,
  Grid,
  Typography,
  TableContainer,
  TableBody,
  TableCell,
  Table,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton,
  useMediaQuery,
} from "@material-ui/core";
import { IconInfoCircle } from "@tabler/icons";

// local imports
import HtmlTip from "ui-component/extended/HtmlTip";
import HtmlTipButton from "ui-component/extended/HtmlTipButton";

// ==============================================================
/* PROPS MAP
adviceid = number
billto: {
  firstname: "",
  lastname: "",
  city: "",
  state: "",
  email: "",
},
billfrom: {
  firstname: "",
  lastname: "",
  city: "",
  state: "",
  email: "",
},
lineitems: [
  {
    description: "",
    amount: "",
  },
],
subtotal: "",
createdate = timestamp
canceldate = timestamp
completedate = timestamp
refunddate = timestamp
*/

const InvoiceTemplate = ({
  adviceid,
  billto,
  billfrom,
  lineitems,
  subtotal,
  createdate,
  canceldate,
  completedate,
  refunddate,
}) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Grid container spacing={2} sx={{ display: "flex" }}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            overflowWrap: "break-word",
          }}
        >
          <Box className="detailsbox" sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              Bill To:
            </Typography>
            <Typography variant="body1">
              Name:{" "}
              {billto.firstname && billto.lastname
                ? billto.firstname + " " + billto.lastname
                : "Not Found"}
            </Typography>
            <Typography variant="body1">
              Location:{" "}
              {billto.city && billto.state
                ? billto.city + ", " + String(billto.state).toUpperCase()
                : billto.city && !billto.state
                ? billto.city
                : billto.state && !billto.city
                ? String(billto.state).toUpperCase()
                : "Not Found"}
            </Typography>
            {/* {billto.email && (
              <Typography variant="body1">Email: {billto.email}</Typography>
            )} */}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            overflowWrap: "break-word",
          }}
        >
          <Box className="detailsbox" sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              Bill From:
            </Typography>
            <Typography variant="body1">
              Name: {billfrom.firstname} {billfrom.lastname}
            </Typography>
            {(billfrom.city || billfrom.state) && (
              <Typography variant="body1">
                Location:{" "}
                {billfrom.city && billfrom.state
                  ? billfrom.city + ", " + String(billfrom.state).toUpperCase()
                  : billfrom.city && !billfrom.state
                  ? billfrom.city
                  : billfrom.state && !billfrom.city
                  ? String(billfrom.state).toUpperCase()
                  : "Not Found"}
              </Typography>
            )}
            {/* {billfrom.email && (
              <Typography variant="body1">Email: {billfrom.email}</Typography>
            )} */}
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ borderColor: theme.palette.grey[300], mt: 1 }} />
      <Box sx={{ mt: 2, mb: 2 }}>
        {createdate ? (
          <Typography variant="body1">Date Created: {createdate}</Typography>
        ) : (
          <Typography variant="body1">
            Date Created: {new Date().toLocaleDateString()}
          </Typography>
        )}
        {canceldate && (
          <Typography variant="body1">Date Cancelled: {canceldate}</Typography>
        )}
        {completedate && (
          <Typography variant="body1">
            Date Completed: {completedate}
          </Typography>
        )}
        {refunddate && (
          <Typography variant="body1">Date Refunded: {refunddate}</Typography>
        )}
      </Box>
      <Divider sx={{ borderColor: theme.palette.grey[300], mt: 1, mb: 1 }} />
      <TableContainer component={Paper} sx={{ borderRadius: "0px", mb: 3 }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
              <TableCell sx={{ fontWeight: "bold" }}>
                Line Item Description
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Amount (USD)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lineitems.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.description}
                </TableCell>
                <TableCell align="right">
                  {" "}
                  ${parseFloat(row.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ borderColor: theme.palette.grey[300], mt: 1, mb: 0 }} />
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "0px",
          mb: 3,
        }}
      >
        <Table size="small" aria-label="a dense table">
          <TableBody>
            <TableRow
              key={0}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell
                sx={{
                  display: "flex",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  alignItems: "center",
                }}
                component="th"
                scope="row"
              >
                Subtotal
                {!matchDownSM ? (
                  <HtmlTip
                    body={
                      <Typography>
                        The amount listed here represents the payment value
                        before fees are added. Please review our{" "}
                        <a
                          href="https://rally.markets/policy/terms-of-service"
                          target={"_blank"}
                        >
                          pricing policy
                        </a>{" "}
                        to learn more.
                      </Typography>
                    }
                  >
                    <IconButton size="small">
                      <IconInfoCircle />
                    </IconButton>
                  </HtmlTip>
                ) : (
                  <HtmlTipButton
                    body={
                      <Typography>
                        The amount listed here represents the payment value
                        before fees are added. Please review our{" "}
                        <a
                          href="https://rally.markets/policy/terms-of-service"
                          target={"_blank"}
                        >
                          pricing policy
                        </a>{" "}
                        to learn more.
                      </Typography>
                    }
                  />
                )}
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                align="right"
              >
                {" "}
                ${parseFloat(subtotal).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default InvoiceTemplate;
