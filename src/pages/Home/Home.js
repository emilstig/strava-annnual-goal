import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { fromUnixTime } from "date-fns";
import isEmpty from "lodash.isempty";
import Section from "../../components/UI/Layout/Section";
import Flex from "../../components/UI/Layout/Flex";

import Header from "../../components/Header/Header";
import ContentTabs from "../../components/ContentTabs/ContentTabs";
import Pace from "../../components/Pace/Pace";
import Progress from "../../components/Progress/Progress";
import Stats from "../../components/Stats/Stats";

import fonts from "../../assets/fonts/fonts";
import getStats from "../../helpers/getStats";
import getAthleteData from "../../helpers/getAthleteData";
import { getAuthToken, getRefreshToken } from "../../helpers/stravaApi";
import { currentYear } from "../../helpers/getDates";

// Strava API
const stravaApi = {
  clientId: process.env.REACT_APP_STRAVA_CLIENT_ID,
  clientSecret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
  redirectUri: process.env.REACT_APP_STRAVA_REDIRECT_URI,
  metaTitle: process.env.REACT_APP_META_TITLE,
  metaDescription: process.env.REACT_APP_META_DESCRIPTION,
};

const scopes = ["read", "activity:read_all"];

const stravaAuthEndpoint = `http://www.strava.com/oauth/authorize?client_id=${
  stravaApi.clientId
}&response_type=code&redirect_uri=${
  stravaApi.redirectUri
}&approval_prompt=force&scope=${scopes.join(",")}`;

const Wrapper = styled(Flex)`
  ${fonts}

  overflow: hidden;
  min-height: 100vh;
  min-height: -webkit-fill-available;

  color: ${({ theme }) => theme.colors.black};
  font-size: 18px;

  @media (min-width: ${(props) => props.theme.breakpoints[2]}) {
    font-size: 26px;
  }

  * {
    box-sizing: border-box;
  }
`;

const Content = styled(Section)`
  flex: 1;
`;

function PageHome() {
  const [store, setStore] = useState({
    token: {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    },
    athlete: { activities: [], stats: {}, profile: {} },
    goal: 1000,
    activity: "Run",
    tab: "progress",
    menu: { open: false, active: false, option: "user" },
  });

  useEffect(() => {
    // Check if token is available
    const localToken = JSON.parse(localStorage.getItem("token"));
    const localSettings = JSON.parse(localStorage.getItem("settings"));

    if (localToken && localToken.accessToken) {
      const { accessToken, refreshToken, expiresAt } = localToken;
      const nowDate = new Date();
      const expireDate = expiresAt ? fromUnixTime(expiresAt) : null;

      if (expireDate && nowDate < expireDate) {
        getAthleteData(
          accessToken,
          refreshToken,
          expiresAt,
          setStore,
          localSettings
        );
      } else {
        getRefreshToken(
          stravaApi.clientId,
          stravaApi.clientSecret,
          refreshToken
        ).then((data) => {
          if (data) {
            const { access_token, refresh_token, expires_at } = data;
            getAthleteData(
              access_token,
              refresh_token,
              expires_at,
              setStore,
              localSettings
            );
          }
        });
      }
    } else {
      // Get window location
      const location = window && window.location ? window.location : null;

      // Get find search code parameter
      const urlParameters = location
        ? new URLSearchParams(window.location.search)
        : null;
      const authCode = urlParameters ? urlParameters.get("code") : null;

      // Clear window url
      // clearWindowUrl();

      // If has code
      if (authCode) {
        // Get oath
        getAuthToken(stravaApi.clientId, stravaApi.clientSecret, authCode).then(
          (data) => {
            const { access_token, refresh_token, expires_at } = data;
            if (access_token && refresh_token && expires_at) {
              // Get data
              getAthleteData(
                access_token,
                refresh_token,
                expires_at,
                setStore,
                localSettings
              );
            }
          }
        );
      }
    }
  }, []);

  const { athlete, goal, tab, activity } = store;

  // Set and filter activity data
  const hasStats = isEmpty(athlete.stats) ? false : true;
  const activityStats = {
    run: hasStats ? athlete.stats.ytd_run_totals : 0,
    ride: hasStats ? athlete.stats.ytd_ride_totals : 0,
    swim: hasStats ? athlete.stats.ytd_swim_totals : 0,
  };
  const statsYear =
    activity === "Run"
      ? activityStats.run
      : activity === "Ride"
      ? activityStats.ride
      : activityStats.swim;

  // Current activities
  const yearActivities =
    athlete && athlete.activities && athlete.activities.length > 0
      ? athlete.activities.filter(
          (activity) => activity.type === store.activity
        )
      : [];

  return (
    <Wrapper
      flexDirection="column"
      justifyContent={["flex-start", null, null, "flex-start"]}
      bg="background"
    >
      <Helmet>
        <title>{`${stravaApi.metaTitle} — ${currentYear}`}</title>
        <meta charSet="utf-8" />
        <meta name="description" content={stravaApi.metaDescription} />
      </Helmet>
      <Header
        store={store}
        setStore={setStore}
        stravaAuthEndpoint={stravaAuthEndpoint}
      />

      <Content className="Content" flexDirection="column">
        <ContentTabs store={store} setStore={setStore} />
        {tab === "pace" && (
          <Pace
            stats={getStats({
              goal,
              statsYear,
              yearActivities,
            })}
          />
        )}
        {tab === "progress" && (
          <Progress
            stats={getStats({
              goal,
              statsYear,
              yearActivities,
            })}
          />
        )}
        {tab === "stats" && (
          <Stats
            stats={getStats({
              goal,
              statsYear,
              yearActivities,
            })}
          />
        )}
      </Content>
    </Wrapper>
  );
}

export default PageHome;
