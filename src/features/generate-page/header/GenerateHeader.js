import React from "react";
import { Title } from "../../../components/Title";
import { Selectors } from "../../../components/Selectors";
import { Burger } from "../../../components/Burger";
import AuthButtons from "../../../components/AuthButtons";
import useWindowSize from "../../../utils/WindowSize";

const GenerateHeader = ({ typeResponse, setTypeResponse }) => {
  const { width } = useWindowSize();
  return (
    <div className="titleContainer">
      <div className="subTitleContainer">
        <Title />
        <div>
            {/* {width > 768 && (
          <Selectors
            className="selectors"
            typeResponse={typeResponse}
            setTypeResponse={setTypeResponse}
          />
          )} */}
        </div>
      </div>
      {width > 1300 ? <AuthButtons /> : <Burger />}
    </div>
  );
};

export default GenerateHeader;
