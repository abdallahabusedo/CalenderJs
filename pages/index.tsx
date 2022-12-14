import Head from "next/head";
import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { differenceInDays, endOfMonth, format, startOfMonth } from "date-fns";
export default function Home() {
  const [selectedDay, setSelectedDay] = React.useState<number>(null);
  const [selectedEndDay, setSelectedEndDay] = React.useState<number>(null);
  const [clickNum, setClickNum] = React.useState(1);
  const [selectedReq, setSelectedReq] = React.useState<
    "Yesterday" | "Last 7 days" | "Last 30 days" | "Last 6 Months"
  >(null); // state for type of the Request on the Top
  const days = React.useMemo(
    () => ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"],
    []
  ); //? Days nsetEndDateames
  //? Set the Static Requests
  const staticRequests = React.useMemo(
    () => [
      {
        subtractType: "D",
        numOfSubtract: 1,
        buttonType: "Yesterday",
      },
      {
        subtractType: "D",
        numOfSubtract: 7,
        buttonType: "Last 7 days",
      },
      {
        subtractType: "M",
        numOfSubtract: 1,
        buttonType: "Last 30 days",
      },
      {
        subtractType: "M",
        numOfSubtract: 6,
        buttonType: "Last 6 Months",
      },
    ],
    []
  );
  //? start Date to input
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  //? end Date to input
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  //? Start of the month
  const [startMonth, setStartMonth] = React.useState<Date>(
    startOfMonth(new Date())
  );
  //? End of the month
  const [endMonth, setEndMonth] = React.useState<Date>(endOfMonth(new Date()));
  //? Number of days in the current month
  const [numDays, setNumDays] = React.useState(
    differenceInDays(endMonth, startMonth) + 1
  );
  //? Number of Prefix Days in the last month
  const prefixDays = startMonth.getDay();
  //? Number of Suffix Days in the last month
  const suffixDays = 6 - endMonth.getDay();
  //? Month / Year Selection
  const [my, setMY] = React.useState(format(new Date(), "MMMM / yyyy"));
  //? Calculate num of days in the last month
  let x = new Date();
  x.setDate(1);
  x.setMonth(x.getMonth() - 1);
  const [numOfDaysInLastMonth, setNumOfDaysInLastMonth] = React.useState(
    differenceInDays(endOfMonth(x), startOfMonth(x))
  );

  /**
   * @param num number of days to subtract
   * @description Calculate the date last by days
   */
  const lastButtonDays = (num: number) => {
    const today = new Date();
    const Last = new Date();
    Last.setDate(today.getDate() - num);
    setStartDate(Last);
    setEndDate(today);
  };
  /**
   * @param num number of months to subtract
   * @description Calculate the date last by months
   */
  const lastButtonMonths = (num: number) => {
    const today = new Date();
    const Last = new Date();
    Last.setMonth(today.getMonth() - num);
    setStartDate(Last);
    setEndDate(today);
  };
  /**
   * @param num 1: for forward , -1: for Backward
   * @description Forward and Backward in Month / Year Selector
   */
  const lastBackOrForwardOneMonth = (num: number) => {
    let newMonth = new Date(my);
    let a = newMonth.setMonth(newMonth.getMonth() + num);
    const today = new Date(a);
    const Last = new Date(a);
    Last.setMonth(today.getMonth() - 1);
    let newMonthFormatted = format(a, "MMMM / yyyy");
    setMY(newMonthFormatted);
    setStartMonth(new Date(a));
    setEndMonth(endOfMonth(new Date(a)));
    setNumDays(
      differenceInDays(endOfMonth(new Date(a)), startOfMonth(new Date(a))) + 1
    );
    setNumOfDaysInLastMonth(differenceInDays(today, Last) - 1);
    setSelectedDay(null);
    setSelectedEndDay(null);
  };
  /**
   * @param DM type of subtraction D: Days , M: Months
   * @param num number to subtract
   * @param type type of the Button
   */
  const handleStaticRequest = (DM: string, num: number, type) => {
    switch (DM) {
      case "D":
        lastButtonDays(num);
        break;
      case "M":
        lastButtonMonths(num);
        break;
      default:
        break;
    }
    setSelectedReq(type);
    setSelectedDay(null);
    setSelectedEndDay(null);
  };
  const handleDateSelection = (date) => {
    let newDate = new Date(my);
    newDate.setDate(date);
    setStartDate(newDate);
    setSelectedDay(date);
    setEndDate(newDate);
    setSelectedEndDay(date);
    setClickNum(2);
  };
  const handleEndDateSelection = (date) => {
    let newDate = new Date(my);
    newDate.setDate(date);
    setEndDate(newDate);
    setSelectedEndDay(date);
    setClickNum(1);
  };

  const handleRange = (date) => {
    switch (clickNum) {
      case 1:
        handleDateSelection(date);
        break;
      case 2:
        handleEndDateSelection(date);
        break;
      default:
        break;
    }
  };
  return (
    <div className="flex items-center justify-center h-screen border-2 rounded-md ">
      <Head>
        <title>Calender</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white border w-[700px] rounded-xl">
        <div>
          <div className="flex justify-center gap-3 mt-8 px-10 pb-6">
            {staticRequests.map((request) => {
              return (
                <button
                  onClick={() =>
                    handleStaticRequest(
                      request.subtractType,
                      request.numOfSubtract,
                      request.buttonType
                    )
                  }
                  className={`${
                    selectedReq === request.buttonType
                      ? " bg-[#E07400] text-white"
                      : " bg-white text-black border border-gray-200"
                  } p-3 px-4 rounded-xl shadow-md font-bold`}
                >
                  {request.buttonType}
                </button>
              );
            })}
          </div>
          <hr className="h-[1px] bg-gray-200 rounded border-0 dark:bg-gray-200" />
          <div className="flex justify-evenly items-center w-full my-6">
            <button>
              <BsArrowLeft
                className="text-3xl text-[#E07400]"
                onClick={() => {
                  lastBackOrForwardOneMonth(-1);
                }}
              />
            </button>
            <h1 className="font-bold text-xl">{my}</h1>
            <button>
              <BsArrowRight
                className="text-3xl text-[#E07400]"
                onClick={() => {
                  lastBackOrForwardOneMonth(1);
                }}
              />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-3 my-8 mx-10 items-center justify-items-center">
          {days.map((day, indx) => {
            return (
              <label
                key={indx}
                className="bg-[#FFF3E3] py-3 px-5 rounded-xl font-bold"
              >
                {day}
              </label>
            );
          })}

          {Array.from({ length: prefixDays }).map((__, indx) => {
            const date = indx + 1;
            return (
              <button
                disabled
                key={date}
                className="bg-[#ffffff] py-2 px-3  rounded-md font-bold text-[#707070]"
              >
                {numOfDaysInLastMonth + 2 - prefixDays + indx}
              </button>
            );
          })}
          {Array.from({ length: numDays }).map((__, indx) => {
            const date = indx + 1;
            return (
              <button
                onClick={() => handleRange(date)}
                key={date}
                className={`bg-[#ffffff] py-2 px-3 w-fit rounded-md font-bold hover:bg-[#e07400b2] hover:rounded-full hover:text-white
                ${
                  selectedDay === indx + 1
                    ? "bg-[#e07400] rounded-full text-white"
                    : "bg-[#ffffff]"
                }
                ${
                  selectedEndDay === indx + 1
                    ? "bg-[#e07400] rounded-full text-white"
                    : "bg-[#ffffff]"
                }
                ${
                  selectedEndDay > indx + 1 && selectedDay < indx + 1
                    ? "bg-[#e07400aa] rounded-full text-white"
                    : "bg-[#ffffff]"
                }
                
                `}
              >
                {date.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
              </button>
            );
          })}
          {Array.from({ length: suffixDays }).map((__, indx) => {
            const date = indx + 1;
            return (
              <button
                disabled
                key={date}
                className="bg-[#ffffff] py-2 px-3 w-fit rounded-md font-bold text-[#707070]"
              >
                {date.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
              </button>
            );
          })}
        </div>
        <hr className="h-[1px] bg-gray-200 rounded border-0 dark:bg-gray-200" />
        <div className="flex gap-6 justify-end mr-8 my-4 text-xl">
          <button className="font-bold" onClick={() => alert("Cancel")}>
            Cancel
          </button>
          <button
            className="font-bold text-[#E07400]"
            onClick={() =>
              alert([
                "startDate ",
                startDate.toISOString(),
                " || ",
                "endDate ",
                endDate.toISOString(),
              ])
            }
          >
            Apply
          </button>
        </div>
      </div>
      {/*! this section must be Deleted */}
      <div className="flex flex-col justify-center items-center">
        <label htmlFor="startDate">this section must be Deleted</label>
        <label htmlFor="startDate">startDate</label>
        <div>
          <label id="startDate">{startDate.toDateString()}</label>
        </div>
        <label htmlFor="endDate">endDate</label>
        <div>
          <label id="endDate">{endDate.toDateString()}</label>
        </div>
      </div>
      {/* till here */}
    </div>
  );
}
