import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightsText from "./HighlightsText";
import CourseCard from "./CourseCard";
const tabName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const Explore = () => {
  const [currentTab, setCurrentTab] = useState(tabName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );
  const setCards = (value) => {
    setCurrentTab(value);
    const filterCard = HomePageExplore.filter((course) => course.tag === value);
    setCourses(filterCard[0].courses);
    setCurrentCard(filterCard[0].courses[0].heading);
  };
  return (
    <div>
      <div className="text-4xl font-semibold text-center">
        Unlock the
        <HighlightsText text={"Power of code"} />
      </div>
      <p className="text-center text-richblack-300 text-sm text-[16px] mt-3 mb-4">
        Learn to build any you can imagine
      </p>

      <div className="flex flex-row gap-7 rounded-full bg-richblack-800 mb-8 px-2 py-2">
        {tabName.map((item, index) => {
          return (
            <div
              className={`text-[16px] flex flex-row items-center gap-2 ${
                currentTab === item
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } rounded-full transition-all duration-200 cursor-pointer px-4 py-2 `}
              key={index}
              onClick={() => setCards(item)}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div className="hidden lg:block lg:h-[200px]"></div>

      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((ele, index) => {
          return (
            <CourseCard
              key={index}
              cardData={ele}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
