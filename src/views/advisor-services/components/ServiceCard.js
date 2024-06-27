import PropTypes from "prop-types";
import React from "react";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Typography, Grid, Box } from "@material-ui/core";
import { IconPackage } from "@tabler/icons";

// project imports
import MainCard from "ui-component/cards/MainCard";
import TotalIncomeCard from "ui-component/cards/Skeleton/TotalIncomeCard";
import CatsHeader from "ui-component/extended/CatsHeader";
import CatHeader from "ui-component/extended/CatHeader";

// data and functions
import { demoMapCategoryDisplayNames } from "utils/DataMapFunctions";

// style constant
const useStyles = makeStyles((theme) => ({
  card: {
    color: theme.palette.text.main,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    position: "relative",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.primary.light,
    },
    height: "240px",
    display: "flex",
    alignItems: "top",
    marginBottom: theme.spacing(2),
  },
  cardHeading: {
    fontSize: "1.375rem",
    fontWeight: 800,
    marginRight: "8px",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  cardHeading2: {
    fontSize: "1rem",
    fontWeight: 800,
    marginRight: "8px",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  price: {
    fontSize: "1.25rem",
    fontWeight: 800,
    color: theme.palette.secondary.dark,
    marginBottom: "8px",
  },
  body: {
    fontSize: "1rem",
    fontWeight: 500,
    color: theme.palette.secondary[100],
    overflow: "hidden",
    whiteSpace: "wrap",
  },
}));

// ========================================================

const ServiceCard = (props, { isLoading }) => {
  const classes = useStyles();
  const theme = useTheme();

  // get tags together in a list
  const tags = [props.service.category, props.service.subcategory];
  // create wording after price
  let priceWording = "";
  if (props.service.pricetype === "hourly") priceWording = " per hour";
  else if (props.service.pricetype === "one-time") priceWording = " (flat fee)";
  else if (props.service.pricetype === "monthly subscription")
    priceWording = " per month";
  else if (props.service.pricetype === "annual subscription")
    priceWording = " per year";
  else priceWording = "";

  const cardClickHandler = () => {
    props.onClick(props.service);
  };

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <MainCard className={classes.card} onClick={cardClickHandler}>
          <Grid container direction="row">
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ position: "absolute", bottom: "12px", right: "12px" }}>
                <IconPackage color={theme.palette.grey[400]} size={"28px"} />
              </Box>
              {props.service.subcategory ? (
                <CatsHeader
                  category={
                    demoMapCategoryDisplayNames(
                      props.service.category,
                      props.service.subcategory
                    ).categoryDisplayName
                  }
                  subcategory={
                    demoMapCategoryDisplayNames(
                      props.service.category,
                      props.service.subcategory
                    ).subcategoryDisplayName
                  }
                />
              ) : (
                <CatHeader category={props.service.category} />
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography
                className={
                  props.service.title.length < 40
                    ? classes.cardHeading
                    : classes.cardHeading2
                }
              >
                {props.service.title}
              </Typography>
            </Grid>
            {props.service.price && (
              <Grid item xs={12}>
                <Typography className={classes.price}>
                  ${parseFloat(props.service.price).toFixed(2)}
                  {/* {priceWording} $$$ remove this for now. No need for it yet */}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography className={classes.body}>
                {props.service.description.length < 180
                  ? props.service.description.split("...")[0]
                  : props.service.description}
              </Typography>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

ServiceCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default ServiceCard;
