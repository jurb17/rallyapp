import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Grid, useMediaQuery } from "@material-ui/core";

// custom imports
import OfficialAdvisorProfileForm from "./forms/OfficialAdvisorProfileForm";
import OfficialFirmProfileForm from "./forms/OfficialFirmProfileForm";
import ProfileHighlightForm from "./forms/ProfileHighlightForm";
import ProfileImageForm from "ui-component/forms/ProfileImageForm";
import advisoryService from "services/advisory.service";
import FormInputErrorModal from "ui-component/modals/FormInputErrorModal";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import QuillContainer from "ui-component/forms/QuillContainer";
import GenericPage from "ui-component/pages/GenericPage";
import { IconDeviceFloppy, IconPencil, IconSettings } from "@tabler/icons";
import { showSnackbar, showEditBanner } from "actions/main";

// style constant
const useStyles = makeStyles((theme) => ({
  detailsSection: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center",
  },
}));

// =============================================================

// include the date that the contact was created. (if you have time. Might not be necessary)

const ProfileManagement = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { attributes } = useSelector((state) => state.auth);
  const highlightProfileFormRef = useRef({});
  const quillEditor = useRef({});

  // profile type: 1 - advisor, 2 - firm
  let profileType = "";
  if (location.pathname.includes("/profile/advisor")) {
    profileType = 1;
  } else if (location.pathname.includes("/profile/firm")) {
    profileType = 2;
  }

  // #region --- STATES, DATA
  // set profile data states
  const [profileImage, setProfileImage] = useState(null);
  const [unsavedProfileImage, setUnsavedProfileImage] = useState(null);
  const [bio, setBio] = useState({}); // pretending it's a string for now
  const [unsavedBio, setUnsavedBio] = useState({}); // pretending it's a string for now
  const [officialProfile, setOfficialProfile] = useState({});
  const [highlightProfile, setHighlightProfile] = useState({});

  // set mode states
  const [isLoading, setIsLoading] = useState(true);
  const [noProfileMode, setNoProfileMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [disableSave, setDisableSave] = useState(false);
  const [uploadImageMode, setUploadImageMode] = useState(false);
  const [formErrorModalOpen, setFormErrorModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // handle data from server
  const handleProfileData = (profile) => {
    if (!profile) {
      setUnsavedProfileImage("not a url");
      setNoProfileMode(true);
    } else {
      setNoProfileMode(false);
      let data = {};
      if (profile.advisor) {
        data = profile.advisor;
      } else if (profile.firm) {
        data = profile.firm;
      }
      if (data.image === undefined) {
        setUnsavedProfileImage("not a url");
      } else {
        setProfileImage(data.image);
        setUnsavedProfileImage(data.image);
      }
      if (profile.bio) {
        const parsedDelta = JSON.parse(profile.bio);
        setBio(parsedDelta);
        setUnsavedBio(parsedDelta);
      }

      const highlights = {
        name: data.name,
        slug: data.slug,
      };
      let official = { ...data };
      delete official.name;
      delete official.slug;
      if (official.image) {
        delete official.image;
      }
      setOfficialProfile((prevState) => {
        return {
          ...prevState,
          ...official,
          ...highlights,
        };
      });
      setHighlightProfile((prevState) => {
        return {
          ...prevState,
          ...highlights,
        };
      });
      setIsLoading(false);
    }
  };

  // get profile data from server
  const getProfileData = async () => {
    if (profileType === 1) {
      await advisoryService
        .getProfileAdvisor()
        .then((response) => {
          handleProfileData(response.data.payload.advisory);
        })
        .catch((error) => {
          console.log("error getting advisor profile", error);
          handleProfileData(null);
        });
    } else if (profileType === 2) {
      await advisoryService
        .getFirmProfile({})
        .then((response) => {
          handleProfileData(response.data.payload.advisory);
        })
        .catch((error) => {
          console.log("error getting firm profile", error);
          handleProfileData(null);
        });
    } else {
      handleProfileData(null);
    }
  };

  // get current data from the server
  useEffect(async () => {
    getProfileData();
  }, []);

  useEffect(() => {
    if (!!editMode || !!uploadImageMode) {
      dispatch(showEditBanner(true, "Editing profile..."));
    } else {
      dispatch(showEditBanner(false, ""));
    }
  }, [editMode]);

  // #endregion --- Functions to organize initial data

  // #region --- Functions for user interaction
  const handleEdit = () => {
    if (profileType === 1 && attributes.ADVISOR !== 1) {
      alert(
        "This action is not available yet. Your account profile is still under evaluation."
      );
    } else if (profileType === 2 && attributes.RIA !== 1) {
      alert(
        "This action is not available yet. Your account profile is still under evaluation."
      );
    } else {
      setEditMode(true);
      setUploadImageMode(false);
    }
  };
  // handle content changes
  const handleContentChange = (content, quillText) => {
    if (quillText.trim()) {
      setUnsavedBio(content);
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  };
  // cancel changes
  const handleEditCancel = () => {
    setEditMode(false);
    setUploadImageMode(false);
    setUnsavedProfileImage(profileImage);
    setUnsavedBio(bio);
  };
  // save changes
  const handleEditSave = async () => {
    setEditMode(false);
    setUploadImageMode(false);
    // check if any changes were made to the bio.
    if (JSON.stringify(unsavedBio) !== JSON.stringify(bio)) {
      // send api request
      if (profileType === 1) {
        await advisoryService
          .postAdvisorProfile({
            bio: unsavedBio.ops,
          })
          .then((response) => {
            setBio(unsavedBio);
          })
          .catch((error) => {
            setUnsavedBio(bio);
            console.log("error", error);
            showSnackbar(true, "Error saving bio", "error");
          });
      } else if (profileType === 2) {
        await advisoryService
          .postFirmProfile({
            bio: unsavedBio.ops,
          })
          .then((response) => {
            setBio(unsavedBio);
          })
          .catch((error) => {
            setUnsavedBio(bio);
            console.log("error", error);
            showSnackbar(true, "Error saving bio", "error");
          });
      }
    }
  };
  // handle image upload state
  const handleUploadImage = () => {
    setEditMode(false);
    setUploadImageMode(true);
  };
  // handle image upload cancel
  const handleUploadImageCancel = () => {
    setEditMode(false);
    setUploadImageMode(false);
    setUnsavedProfileImage(profileImage);
    setIsLoading(false);
  };
  // handle upload of new image by the user.
  const handleUploadImageSelection = (image) => {
    setUnsavedProfileImage(image);
    setUploadImageMode(true);
  };
  // handle image upload save
  const handleUploadFromForm = (image) => {
    setProfileImage(image);
    dispatch(showSnackbar("Image uploaded successfully", true, "success"));
    setUploadImageMode(false);
  };
  // when user confirms that they have seen the error modal.
  const handleErrorConfirmation = () => {
    setFormErrors({});
    setFormErrorModalOpen(false);
    setEditMode(true);
  };
  // #endregion --- Functions for user interaction

  return (
    <>
      <FormInputErrorModal
        open={formErrorModalOpen}
        errorInfo={formErrors}
        handleErrorConfirmation={handleErrorConfirmation}
      />
      <GenericPage
        pageHeader={
          profileType === 1
            ? "Advisor Profile"
            : profileType === 2
            ? "Firm Profile"
            : null
        }
      >
        {noProfileMode ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="You do not have a profile of this type. Your access may be pending. Please try again later." />
          </Box>
        ) : isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading..." />
          </Box>
        ) : (
          <>
            <SubsectionWrapper
              title="Profile Information"
              tipBody="Information about your profile is displayed on your public profile page. The Profile Bio can be edited at any time. All other information is updated by request only. Contact support from the Settings page in order to submit a request."
              buttonlist={
                !matchDownSM
                  ? [
                      {
                        name: "Go to Account Settings",
                        color: "primary",
                        variant: "text",
                        startIcon: <IconSettings stroke={1.25} />,
                        onClick: () => navigate("/adv/settings"),
                      },
                    ]
                  : []
              }
            >
              <Grid
                container
                direction="row"
                maxWidth="100%"
                className={classes.detailsSection}
              >
                <Grid
                  item
                  md={6}
                  sm={12}
                  paddingRight={theme.spacing(2)}
                  marginBottom={theme.spacing(2)}
                >
                  <ProfileImageForm
                    advisorId={attributes.advisorId}
                    image={unsavedProfileImage}
                    editMode={editMode}
                    handleUploadImage={handleUploadImage}
                    handleUploadImageCancel={handleUploadImageCancel}
                    handleUploadImageSelection={handleUploadImageSelection}
                    handleUploadFromForm={handleUploadFromForm}
                    profileType={profileType}
                  />
                </Grid>
                <Grid item md={6} sm={12} marginBottom={theme.spacing(2)}>
                  {profileType === 1 ? (
                    <OfficialAdvisorProfileForm
                      profile={officialProfile}
                      disabled={editMode}
                    />
                  ) : profileType === 2 ? (
                    <OfficialFirmProfileForm
                      profile={officialProfile}
                      disabled={editMode}
                    />
                  ) : null}
                </Grid>
                <Grid item md={12} sm={12}>
                  <Box sx={{ flexGrow: 1, mt: 1 }}>
                    <ProfileHighlightForm
                      forwardedProfileHighlightFormRef={highlightProfileFormRef}
                      profile={highlightProfile}
                      readOnly={true}
                      disabled={editMode}
                      highlight={editMode}
                      nameLabel={
                        profileType === 1
                          ? "Advisor Name"
                          : profileType === 2
                          ? "Firm Name"
                          : null
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </SubsectionWrapper>
            <SubsectionWrapper
              mb={1}
              pt={1}
              title="Profile Bio"
              tipBody="Use this area to provide a more detailed description of your profile."
              border={false}
              buttonlist={
                !editMode
                  ? [
                      {
                        name: "Edit Bio",
                        color: "primary",
                        variant: "contained",
                        startIcon: <IconPencil stroke={1.25} />,
                        onClick: handleEdit,
                      },
                    ]
                  : [
                      {
                        name: "Cancel",
                        color: "primary",
                        variant: "text",
                        onClick: handleEditCancel,
                      },
                      {
                        name: "Save",
                        color: "secondary",
                        variant: "contained",
                        startIcon: <IconDeviceFloppy stroke={1.25} />,
                        onClick: handleEditSave,
                      },
                    ]
              }
            >
              <QuillContainer
                forwardedQuillEditor={quillEditor}
                content={unsavedBio}
                handleContentChange={handleContentChange}
                readOnly={!editMode}
                placeholder="Enter more details here... "
              />
            </SubsectionWrapper>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default ProfileManagement;
