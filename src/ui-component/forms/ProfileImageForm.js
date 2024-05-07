import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import CancelButton from "ui-component/buttons/CancelButton";
import PrimaryActionButton from "ui-component/buttons/PrimaryActionButton";
import SecondaryActionButton from "ui-component/buttons/SecondaryActionButton";
import { checkValidURL } from "utils/Validation";
import advisoryService from "services/advisory.service";
import { showSnackbar } from "actions/main";
import DynamicButton from "ui-component/buttons/DynamicButton";
import { IconCamera } from "@tabler/icons";

// style constant
const useStyles = makeStyles((theme) => ({
  boxImage: {
    width: "224px",
    height: "224px",
    margin: "0 24px",
  },
  uploadImageButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "8px",
  },
  imageStatusText: {
    width: "200px",
    height: "200px",
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: "50%",
    margin: "12px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

//= ==============================|| SURVEY - SURVEYSECTION ||===============================//

// include the date that the contact was created. (if you have time. Might not be necessary)

const ProfileImageForm = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const submitInputRef = useRef(null);
  const formRef = useRef(null);
  const { attributes } = useSelector((state) => state.auth);

  // set states
  const [currentImageURL, setCurrentImageURL] = useState("");
  const [wrongFileType, setWrongFileType] = useState(false);
  const [noImage, setNoImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setWrongFileType(false);
      reader.readAsDataURL(file);
    } else {
      setWrongFileType(true);
      setIsUploading(false);
      setIsSelected(false);
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
      } else {
        setNoImage(true);
      }
      setIsLoading(false);
    } else {
      setNoImage(true);
    }
  }, [props.image]);

  // define image display style
  const imageStyle = {
    width: "200px",
    height: "200px",
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: "50%",
    margin: "12px auto",
    backgroundImage: `url(${currentImageURL})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  // handle the upload image button
  const handleUploadImage = () => {
    setIsUploading(true);
    props.handleUploadImage();
    fileInputRef.current.click();
  };
  // handle input change and update unsaved Image in parent
  const processImage = async (e) => {
    setIsUploading(false);
    setIsSelected(true);
    props.handleUploadImageSelection(e.target.files[0]);
  };
  // handle cancel button
  const handleCancel = () => {
    setIsUploading(false);
    setIsSelected(false);
    setWrongFileType(false);
    formRef.current[0].value = "";
    props.handleUploadImageCancel();
  };

  // handle event listener set up
  const sendFormData = (link) => {
    const myForm = document.getElementById("myForm");
    myForm.addEventListener("submit", (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      dispatch(showSnackbar("Saving your image. Please wait...", true, "info"));

      const request = new XMLHttpRequest();
      request.open("POST", link);
      request.onload = () => {
        setIsSubmitting(false);
      };
      request.send(new FormData(myForm));
    });
    return myForm;
  };
  // handle the image upload save button
  const handleSave = async (e) => {
    setIsSubmitting(true);
    setIsSelected(false);
    // execute different actions based on the profile type
    if (props.profileType === 1) {
      await advisoryService
        .putAdvisorProfileImage({})
        .then(async (response) => {
          sendFormData(response.data.payload.advisory.image);
          submitInputRef.current.click();
          props.handleUploadFromForm(fileInputRef.current.files[0]);
        })
        .catch((error) => {
          setIsSubmitting(false);
          console.log("error", error);
          dispatch(showSnackbar("Error saving image", true, "error"));
          props.handleUploadImageCancel();
        });
    } else if (props.profileType === 2) {
      await advisoryService
        .putFirmProfileImage({})
        .then(async (response) => {
          sendFormData(response.data.payload.advisory.image);
          submitInputRef.current.click();
          props.handleUploadFromForm(fileInputRef.current.files[0]);
        })
        .catch((error) => {
          setIsSubmitting(false);
          console.log("error", error);
          dispatch(showSnackbar("Error saving image", true, "error"));
          props.handleUploadImageCancel();
        });
    }
  };

  return (
    <>
      {/* form that is used to upload a new image */}
      <form
        id="myForm"
        ref={formRef}
        hidden={true}
        method="POST"
        action=""
        enctype="multipart/form-data"
      >
        <input
          ref={fileInputRef}
          onChange={processImage}
          type="file"
          id="file"
          name="file"
        />
        <input ref={submitInputRef} type="submit" />
      </form>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Box className={classes.boxImage}>
          {isLoading ? (
            <Box className={classes.imageStatusText}>
              <Typography variant="h6">
                <em>Loading...</em>
              </Typography>
            </Box>
          ) : noImage ? (
            <Box className={classes.imageStatusText}>
              <Typography variant="h6">
                <em>No image found.</em>
              </Typography>
            </Box>
          ) : wrongFileType ? (
            <Box className={classes.imageStatusText}>
              <Typography variant="h6" color="error">
                Please upload a valid image file.
              </Typography>
            </Box>
          ) : (
            <Box style={imageStyle} />
          )}
        </Box>
        <Box className={classes.uploadImageButton} flexDirection="column">
          {!isSelected && !wrongFileType && !isSubmitting ? (
            <DynamicButton
              name="Upload Image"
              color="primary"
              variant="contained"
              mb={0}
              disabled={props.editMode}
              startIcon={<IconCamera stroke={1.25} />}
              onClick={
                (props.profileType === 1 && attributes.ADVISOR !== 1) ||
                (props.profileType === 2 && attributes.RIA !== 1)
                  ? () =>
                      alert(
                        "This action is not available yet. Your account profile is still under evaluation."
                      )
                  : handleUploadImage
              }
            />
          ) : (
            <>
              <SecondaryActionButton
                name={isSubmitting ? "Submitting Image..." : "Save Image"}
                size="medium"
                disabled={isUploading || isSubmitting}
                onClick={handleSave}
                mb={0}
              />
              <CancelButton
                size="medium"
                disabled={isSubmitting}
                onClick={handleCancel}
              />
            </>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default ProfileImageForm;
