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
import { useSelector } from "react-redux";

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
  platformfee,
  platformfeerate,
  refundamount,
  totalpaid,
  totalpayout,
  createdate,
  canceldate,
  completedate,
  refunddate,
}) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  // auth data from storage and global state
  const auth = useSelector((state) => state.auth);

  console.log(
    "something",
    adviceid,
    billto,
    billfrom,
    lineitems,
    subtotal,
    platformfee,
    platformfeerate,
    createdate,
    canceldate,
    completedate,
    refunddate
  );

  let taxesText = "";
  if (createdate && !canceldate && !completedate)
    taxesText = "Taxes added at checkout.";
  else taxesText = "Tax information not currently not available.";

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
      {/* INVOICE DATES SECTION */}
      <Divider sx={{ borderColor: theme.palette.grey[300], mt: 1 }} />
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Timeline
        </Typography>
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
          <Typography variant="body1">Date of Refund: {refunddate}</Typography>
        )}
      </Box>
      <Divider sx={{ borderColor: theme.palette.grey[300], mt: 1, mb: 1 }} />
      <TableContainer component={Paper} sx={{ borderRadius: "0px", mb: 2 }}>
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
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
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
          mb: 1,
        }}
      >
        <Table size="small" aria-label="a dense table">
          <TableBody>
            <TableRow
              key={1}
              sx={{
                "&:last-child td, &:last-child th, &:first-of-type td, &:first-of-type th":
                  { border: 0 },
              }}
            >
              <TableCell
                sx={{
                  display: "flex",
                  fontWeight:
                    createdate && !canceldate && !completedate ? "bold" : "",
                  fontSize: "1rem",
                  alignItems: "center",
                }}
                scope="row"
              >
                Subtotal (USD)
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
                sx={{
                  fontWeight:
                    createdate && !canceldate && !completedate ? "bold" : "",
                  fontSize: "1rem",
                }}
                align="right"
              >
                {" "}
                ${parseFloat(subtotal).toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow
              key={2}
              sx={{
                "&:last-child td, &:last-child th, &:first-of-type td, &:first-of-type th":
                  { border: 0 },
              }}
            >
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "-8px",
                }}
                scope="row"
              >
                {taxesText}
              </TableCell>
              <TableCell scope="row"></TableCell>
            </TableRow>
            {refunddate && (
              <TableRow
                key={0}
                sx={{
                  "&:last-child td, &:last-child th, &:first-of-type td, &:first-of-type th":
                    { border: 0 },
                }}
              >
                <TableCell sx={{ color: theme.palette.error.main }} scope="row">
                  Amount Refunded (USD)
                </TableCell>
                <TableCell
                  sx={{ color: theme.palette.error.main }}
                  scope="row"
                  align="right"
                >
                  ${parseFloat(refundamount).toFixed(2)}
                </TableCell>
              </TableRow>
            )}
            {completedate && (
              <TableRow
                key={0}
                sx={{
                  "&:last-child td, &:last-child th, &:first-of-type td, &:first-of-type th":
                    { border: 0 },
                }}
              >
                <TableCell
                  sx={{ fontSize: "1rem", fontWeight: "bold" }}
                  scope="row"
                >
                  Total Paid (USD)
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1rem", fontWeight: "bold" }}
                  scope="row"
                  align="right"
                >
                  ${parseFloat(totalpaid).toFixed(2)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* ADVISOR PAYOUT SECTION */}
      {auth.attributes.ADVISOR && (
        <Grid container spacing={2} sx={{ display: "flex" }}>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              overflowWrap: "break-word",
            }}
          >
            <Box className="detailsbox-grey" sx={{ width: "100%" }}>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                Advisor Payout
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: "0px",
                  backgroundColor: "#eeeeee",
                }}
              >
                <Table size="small" aria-label="a dense table">
                  <TableBody>
                    <TableRow
                      key={0}
                      sx={{
                        "&:last-child td, &:last-child th, &:first-of-type td, &:first-of-type th":
                          { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          display: "flex",
                          fontSize: "1rem",
                          alignItems: "center",
                        }}
                        component="th"
                        scope="row"
                      >
                        Subtotal (USD)
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem" }} align="right">
                        {" "}
                        ${parseFloat(subtotal).toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={1}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "-8px",
                        }}
                        component="th"
                        scope="row"
                      >
                        Platform Fee ({platformfeerate}%)
                        {!matchDownSM ? (
                          <HtmlTip
                            body={
                              <Typography>
                                The standard platform fee is 15%. Fees are
                                subject to vary based on platform rules and
                                incentives. Please review our{" "}
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
                                The amount listed here represents the payment
                                value before fees are added. Please review our{" "}
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
                      <TableCell sx={{ marginTop: "-8px" }} align="right">
                        {" "}
                        ${parseFloat(platformfee).toFixed(2)}
                      </TableCell>
                    </TableRow>
                    {refunddate && (
                      <TableRow
                        key={0}
                        sx={{
                          "&:last-child td, &:last-child th, &:first-of-type td, &:first-of-type th":
                            { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{ color: theme.palette.error.main }}
                          scope="row"
                        >
                          Amount Refunded (USD)
                        </TableCell>
                        <TableCell
                          sx={{ color: theme.palette.error.main }}
                          scope="row"
                          align="right"
                        >
                          ${parseFloat(refundamount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow
                      key={2}
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
                        Total Payout (USD)
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", fontSize: "1rem" }}
                        align="right"
                      >
                        ${parseFloat(totalpayout).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default InvoiceTemplate;
