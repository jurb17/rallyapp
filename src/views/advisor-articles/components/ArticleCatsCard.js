import PropTypes from "prop-types";
import React from "react";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Typography, Grid, Box } from "@material-ui/core";
import { IconEyeOff, IconWriting } from "@tabler/icons";

// project imports
import MainCard from "ui-component/cards/MainCard";
import TotalIncomeCard from "ui-component/cards/Skeleton/TotalIncomeCard";
import CatsHeader from "ui-component/extended/CatsHeader";
import CatHeader from "ui-component/extended/CatHeader";

// style constant
const useStyles = makeStyles((theme) => ({
  card: {
    color: theme.palette.text.main,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    position: "relative",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.secondary.light,
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
  body: {
    fontSize: "1rem",
    fontWeight: 500,
    color: theme.palette.secondary[100],
    overflow: "hidden",
    whiteSpace: "wrap",
  },
}));

// =======================================================

const ArticleCatsCard = (props, { isLoading }) => {
  const classes = useStyles();
  const theme = useTheme();

  const cardClickHandler = () => {
    props.onClick(props.article);
  };

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <MainCard
          className={classes.card}
          onClick={cardClickHandler}
          style={{
            border: props.deleted
              ? `2px solid ${theme.palette.error.main}`
              : "",
          }}
        >
          <Grid container direction="row">
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ position: "absolute", bottom: "12px", right: "12px" }}>
                <IconWriting color={theme.palette.grey[400]} size={"28px"} />
              </Box>
              <CatsHeader
                category={props.article.category}
                subcategory={props.article.subcategory}
              />
              {props.deleted && (
                <Box sx={{ ml: 1 }}>
                  <IconEyeOff color={theme.palette.error.main} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.cardHeading}>
                {props.article.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.body}>
                {!!props.article.description &&
                props.article.description.length < 180
                  ? props.article.description.split("...")[0]
                  : props.article.description}
              </Typography>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

ArticleCatsCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default ArticleCatsCard;
