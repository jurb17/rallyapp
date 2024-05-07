import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Grid } from "@material-ui/core";

// custom imports
import ProfileImageForm from "ui-component/forms/ProfileImageForm";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import QuillContainer from "ui-component/forms/QuillContainer";
import VariableInputTypeForm from "ui-component/forms/VariableInputTypeForm";
import GenericPage from "ui-component/pages/GenericPage";
import adviceService from "services/advice.service";
import { IconMessage } from "@tabler/icons";

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
// NO PROPS, ONLY LOCATION.STATE
// this page can be accessed from the advisor list page, the messages page, and the invoice page.

const ProfileManagement = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { attributes } = useSelector((state) => state.auth);
  const quillEditor = useRef({});

  // #region --- STATES, DATA
  // set profile data states
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState({}); // pretending it's a string for now
  const [profileData, setProfileData] = useState({});

  // set mode states
  const [isLoading, setIsLoading] = useState(true);
  const [noProfileMode, setNoProfileMode] = useState(false);

  // handle data from server
  const handleProfileData = (profile) => {
    if (!profile) {
      setProfileImage("not a url");
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
        setProfileImage("not a url");
      } else {
        setProfileImage(data.image);
      }
      if (profile.bio) {
        const parsedDelta = JSON.parse(profile.bio);
        setBio(parsedDelta);
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
      setIsLoading(false);
    }
  };
  // get profile data from server
  const getProfileData = async () => {
    await adviceService
      .getAdvisor(
        {
          firmslug: location.state.firmslug,
        },
        {
          advisor: location.state.advisorslug,
        }
      ) // replace string with variable that holds the first message a client would send to the advisor.
      .then((response) => {
        if (!!response.data.payload.success) {
          handleProfileData(response.data.payload);
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log(response.data.details.text);
          navigate(-1);
          // or show error-related page
        }
      })
      .catch((error) => {
        console.log("error", error);
        navigate(-1);
        // or show error-related page
      });
  };

  // get current data from the server
  useEffect(async () => {
    getProfileData();
  }, []);

  // #endregion --- Functions to organize initial data

  return (
    <>
      <GenericPage
        title="Advisor Profile"
        buttonlist={[
          {
            name: "View Chat",
            color: "primary",
            variant: "contained",
            startIcon: <IconMessage stroke={1.25} />,
            onClick: () => navigate(`/client/messages/?id=${adviceid}`),
          },
        ]}
      >
        <SubsectionWrapper
          title="Profile"
          tipBody="Each advisor's information is reviewed to ensure that they are licesnsed to provide financial advice and uphold a fiduciary standard of service. To contact this advisor directly, use the chat messages by selecting the Messages button."
        >
          {noProfileMode ? (
            <PagePlaceholderText text="You do not have a profile of this type. Your access may be pending. Please try again later." />
          ) : isLoading ? (
            <PagePlaceholderText text="Loading..." />
          ) : (
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                maxWidth="100%"
                className={classes.detailsSection}
                mt={-2}
              >
                <Grid
                  item
                  md={6}
                  sm={12}
                  paddingRight="24px"
                  marginBottom="24px"
                >
                  <ProfileImageForm
                    advisorId={attributes.advisorId}
                    image={profileImage}
                    editMode={false}
                  />
                </Grid>
                {/* form next to the image form. */}
                <Grid item md={6} sm={12} marginBottom="24px"></Grid>
                <Box sx={{ width: 1, flexGrow: 1, mb: 1 }}>
                  {/* Form for the Advisor Profile Details */}
                  <VariableInputTypeForm
                    key={"profile-form"}
                    sectionName={"Advisor Profile"}
                    formObj={profileData}
                    // configObj={ticketConfig[key] || {}}
                    readOnly={true}
                  />
                </Box>
              </Grid>
              <SubsectionWrapper title="Advisor Bio" border={false} mt={-4}>
                <QuillContainer
                  forwardedQuillEditor={quillEditor}
                  content={bio}
                  readOnly={true}
                  placeholder="Enter more details here... "
                />
              </SubsectionWrapper>
            </Grid>
          )}
        </SubsectionWrapper>
      </GenericPage>
    </>
  );
};

export default ProfileManagement;
