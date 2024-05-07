import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Typography, Box } from "@material-ui/core";

// project imports
import { IconCircleDashed, IconCircleCheck } from "@tabler/icons";

// assets
import GeneralWrapper from "ui-component/wrappers/GeneralWrapper";
import SecondaryActionButton from "ui-component/buttons/SecondaryActionButton";
import CancelButton from "ui-component/buttons/CancelButton";
import VariableInputCodeForm from "ui-component/forms/VariableInputCodeForm";
import ReviewInfoForm from "ui-component/forms/ReviewInfoForm";
import { attributesNavigation } from "utils/navigation";
import tokenService from "services/token.service";
import { onboard } from "actions/auth";
import { SET_MENU } from "actions/types";

// style constant
const useStyles = makeStyles((theme) => ({
  surveyCard: {
    marginLeft: "20%",
    marginRight: "20%",
    marginTop: "2%",
    border: `2px solid ${theme.palette.primary.main}`,
    "@media (max-width: 600px)": {
      marginLeft: "0",
      marginRight: "0",
    },
  },
  title: {
    fontWeight: "bold",
    marginBottom: "24px",
    lineHeight: "1.5",
  },
  subtitle: {
    fontWeight: "normal",
    marginTop: "24px",
    marginBottom: "24px",
  },
  icon: {
    marginRight: "8px",
  },
  indexInfoText: {
    marginLeft: "8px",
  },
}));

// ==============================================================

const Survey = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const surveyRef = useRef({});
  const customization = useSelector((state) => state.customization);
  let survey = tokenService.getSessionSurvey();

  // defining initial state for responses and getting all questions from the survey into a list
  // [ { sectionid: { questionId: response , questionId: response } } , { sectionid: { questionId: response , questionId: response } } ]
  const sectionQuestionDictList = [];
  const sectionList = []; // list of sections

  if (!!survey) {
    survey.survey.forEach((section, index) => {
      sectionList.push(section.sectionid);
      let sectionQuestionsDict = {};
      section["questions"].forEach((question, index) => {
        if (question.dtype >= 403 && question.dtype < 500) {
          sectionQuestionsDict[question.id] = [];
        } else {
          sectionQuestionsDict[question.id] = "";
        }
      });
      sectionQuestionDictList.push({ ...sectionQuestionsDict });
    });
  } else {
    survey = { survey: [] };
  }

  useEffect(() => {
    // handle null or empty survey
    if (
      !survey ||
      !survey.survey ||
      Object.entries(survey.survey).length === 0
    ) {
      attributesNavigation(navigate, location);
    }
  }, [survey]);

  // define user response list of objects of objects
  const [userResponses, setUserResponses] = useState({
    ...sectionQuestionDictList,
  });
  const [surveySectionControl, setSurveySectionControl] = useState(0);
  const [modes, setModes] = useState({
    canGoNext: true,
    canGoBack: false,
  });

  // #region --- handle next and back button clicks (multiple functions) ---
  // update next and back button states
  useEffect(() => {
    if (surveySectionControl === 0) {
      setModes({
        ...modes,
        canGoNext: true,
        canGoBack: false,
      });
    } else if (
      surveySectionControl <= survey.survey.length &&
      surveySectionControl > 0
    ) {
      setModes({
        ...modes,
        canGoNext: true,
        canGoBack: true,
      });
    } else if (surveySectionControl > survey.survey.length) {
      setModes({
        ...modes,
        canGoNext: false,
        canGoBack: true,
      });
    }
    if (!!customization.opened) {
      dispatch({ type: SET_MENU, opened: false });
    }
  }, [surveySectionControl]);
  // go to next section
  const onNextHandler = () => {
    setSurveySectionControl(surveySectionControl + 1);
  };
  // go to previous section
  const onBackHandler = () => {
    setSurveySectionControl(surveySectionControl - 1);
  };
  // #endregion

  // update user responses on change
  const updateUserResponses = (name, value) => {
    setUserResponses((prevState) => {
      return {
        ...prevState,
        [surveySectionControl]: {
          ...prevState[surveySectionControl],
          [name]: value,
        },
      };
    });
  };
  // handle submit of survey
  const onSubmitHandler = async () => {
    let mainObj = {};
    sectionList.forEach((sectionid, index) => {
      if (mainObj[sectionid] === undefined) {
        mainObj[sectionid] = {};
      }
      mainObj[sectionid] = {
        ...mainObj[sectionid],
        ...userResponses[index],
      };
    });
    await dispatch(onboard(survey.submit, { survey: { ...mainObj } }))
      .then((response) => {
        attributesNavigation(navigate, location);
      })
      .catch((error) => {
        console.log("uncaught error", error.message);
        // general 404 page! (includes "go back to home")
      });
  };
  // calculating icons for display on survey section
  const iconList = [];
  for (let i = 0; i < survey.survey.length; i++) {
    if (i < surveySectionControl) {
      iconList.push(
        <IconCircleCheck className={classes.icon} color="green" key={i} />
      );
    } else {
      iconList.push(<IconCircleDashed className={classes.icon} key={i} />);
    }
  }

  return (
    <GeneralWrapper className={classes.surveyCard}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <h1 className={classes.title}>{survey.title}</h1>
      </Box>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {iconList}
        <Typography variant="body1" className={classes.indexInfoText}>
          {surveySectionControl >= survey.survey.length
            ? "Complete"
            : `Step ${surveySectionControl + 1} out of ${survey.survey.length}`}
        </Typography>
      </Box>
      {surveySectionControl < survey.survey.length ? (
        <>
          <Typography variant="h3" className={classes.subtitle}>
            {survey.survey[surveySectionControl].subtitle}
          </Typography>
          <VariableInputCodeForm
            forwardedFormRef={surveyRef}
            formObj={survey.survey[surveySectionControl]}
            userResponses={userResponses[surveySectionControl]}
            handleInputChange={updateUserResponses}
            // the following are only required for a multipage form
            multiPage={true}
            canGoNext={modes.canGoNext}
            canGoBack={modes.canGoBack}
            handleNext={onNextHandler}
            handleBack={onBackHandler}
          />
        </>
      ) : surveySectionControl === survey.survey.length ? (
        <>
          <Typography variant="h3" className={classes.subtitle}>
            Review your responses
          </Typography>
          <ReviewInfoForm
            inputbase={true}
            form={survey.survey}
            userInput={userResponses}
            multisection={true}
            canGoNext={modes.canGoNext}
            canGoBack={modes.canGoBack}
            handleNext={onNextHandler}
            handleBack={onBackHandler}
          />
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Typography variant="h2" className={classes.subtitle}>
            Welcome to Rally!
          </Typography>
          <Typography variant="h4">Thank you for signing up.</Typography> <br />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
            sx={{ marginTop: "16px" }}
          >
            <CancelButton onClick={onBackHandler} name="Back" />
            <SecondaryActionButton onClick={onSubmitHandler} name="Continue" />
          </Box>
        </Box>
      )}
    </GeneralWrapper>
  );
};

export default Survey;
