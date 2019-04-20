import React from "react";
import { shallow } from "enzyme";
import ErrorBar from "./ErrorBar";

describe("<ErrorBar />", () => {
  const list = [
    { key: "a0", text: "a" },
    { key: "b1", text: "b" },
    { key: "c2", text: "c" }
  ];
  const emptyFunc = () => {};

  it("renders wrapper", () => {
    const bar = shallow(<ErrorBar errors={[]} clearErrors={emptyFunc} />);
    expect(bar.find(".error-bar").length).toEqual(1);
  });

  it("display all errors from the props", () => {
    const bar = shallow(<ErrorBar errors={list} clearErrors={emptyFunc} />);
    expect(bar.find(".error-bar__item").length).toEqual(list.length);
  });
});
