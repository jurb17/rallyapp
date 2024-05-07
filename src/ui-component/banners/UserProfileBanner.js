import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Typography, Grid } from "@material-ui/core";
import { IconUser, IconUserExclamation } from "@tabler/icons";
import { checkValidURL } from "utils/Validation";

// style constant
const useStyles = makeStyles((theme) => ({
  bannerStyle: {
    display: "flex",
    color: theme.palette.text.primary,
    justifyContent: "start",
    alignItems: "center",
  },
  boxImage: {
    height: "80px",
  },
  imageStatusText: {
    paddingLeft: "12px",
    width: "80px",
    height: "80px",
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    flexGrow: 0,
  },
}));

// ============================================================
/* PROPS MAP
image = string (optional)
name = string (optional)
children = string (required)
*/

const UserProfileBanner = (props, { children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { attributes } = useSelector((state) => state.auth);

  // set states
  const [currentImageURL, setCurrentImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [noImage, setNoImage] = useState(false);

  // handle display of image from a link
  const showImageFromLink = (image) => {
    setCurrentImageURL(image);
  };
  // // handle display of image from a data string
  const showImageFromString = () => {
    // update current image on display
    let file = props.image;
    let reader = new FileReader();
    if (file && file.type.match("image.*")) {
      // setWrongFileType(false);
      reader.readAsDataURL(file);
    } else {
      // setWrongFileType(true);
      // setIsUploading(false);
      // setIsSelected(false);
    }
    reader.onloadend = () => {
      setCurrentImageURL(reader.result);
    };
  };
  // evaluate data passed to image display
  useEffect(() => {
    // if props.image exists
    if (props.image) {
      setIsLoading(true);
      // if the image is a link
      if (checkValidURL(props.image)) {
        showImageFromLink(props.image);
        setNoImage(false);
      } else if (typeof props.image === "object") {
        showImageFromString(props.image);
        setNoImage(false);
      }
      setIsLoading(false);
    } else {
      setNoImage(true);
    }
  }, [props.image]);

  // define image display style
  const imageStyle = {
    width: "80px",
    height: "80px",
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: "50%",
    margin: "auto",
    backgroundImage: `url(${currentImageURL})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <Grid
      item
      xs={12}
      className={classes.bannerStyle}
      style={{ maxWidth: props.maxwidth ? props.maxwidth : "100%" }}
    >
      {noImage ? (
        <Box className={classes.imageStatusText}>
          <Typography variant="h6">
            <em>No image found.</em>
          </Typography>
        </Box>
      ) : (
        <Box className={classes.boxImage}>
          <Box style={imageStyle} />
        </Box>
      )}
      <Box display="flex" flexDirection="column" flexGrow={1}>
        {!!props.name ? (
          <Box sx={{ flexShrink: 0, paddingLeft: 2, width: "100%" }}>
            <Typography variant="h4">{props.name}</Typography>
          </Box>
        ) : null}
        {!!props.location ? (
          <Box sx={{ flexShrink: 0, paddingLeft: 2, mt: 0.5, width: "100%" }}>
            <Typography variant="h5" sx={{ color: theme.palette.grey[700] }}>
              {props.location}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Grid>
  );
};

export default UserProfileBanner;
