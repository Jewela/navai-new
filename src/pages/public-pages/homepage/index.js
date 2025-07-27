import { useEffect } from "react";
import "./css/index.css";

import Hero from "../../../components/HomePage/hero";
import SpecialHighlights from "../../../components/HomePage/SpecialHighlights";
import GetStarted from "../../../components/HomePage/GetStarted";
import CreateAvtar from "../../../components/UI/Cards/CreateAvtar";
import Videos from "../../../components/HomePage/Videos";
import FAQ from "../../../components/UI/FAQ";
import Howworks from "../../../components/HomePage/Works";
import RecentVisit from "../../../components/HomePage/RecentVisit";
import { useSelector } from "react-redux";
import Products from "../products";

function homepage(props) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const avaterId = useSelector((state) => state.avater_id.avatarId);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);
  return (
    <>
      <Hero />
      {/* <Howworks /> */}
      <Products />
      {/* <GetStarted /> */}
      <SpecialHighlights />

      {/* <CreateAvtar /> */}
      {/* <Videos /> */}
      {/* {isAuthenticated && <RecentVisit />} */}
      <FAQ />
    </>
  );
}
export default homepage;
