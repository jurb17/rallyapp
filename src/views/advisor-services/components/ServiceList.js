import React from "react";
import { useNavigate } from "react-router-dom";

// material ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// third party imports
import Masonry from "react-masonry-css";

// local imports
import ServiceCard from "./ServiceCard";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ====================================================
/* PROPS MAP
services = array of services
*/

const ServiceList = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // STATE OBJECT MUST HAVE AN "ID" KEY!
  const handleCardClick = (card) => {
    navigate(`/adv/services/${card.id}`, { state: { serviceExists: true } });
  };

  // generate list of articles
  const children = [];
  if (!!props.services && Object.keys(props.services).length > 0) {
    props.services.map((service, index) => {
      children.push(
        <ServiceCard key={index} service={service} onClick={handleCardClick} />
      );
    });
  } else children.push(<p></p>);

  const breakpointColumnsObj = {
    default: 3,
    1450: 2,
    1050: 1,
    960: 2,
    700: 1,
  };

  return (
    <>
      <Box flex={true} flexGrow={1}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {children}
        </Masonry>
      </Box>
    </>
  );
};

export default ServiceList;
