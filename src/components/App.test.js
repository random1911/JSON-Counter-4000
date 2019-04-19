import React from "react";
import { shallow, mount } from "enzyme";
import App from "./App";

describe("<App />", () => {
  const result = [{ name: "1", body: [{}, {}, []] }];
  const errors = [{ key: "0", text: "a" }];

  it("Initial state will display header and dropbox", () => {
    const app = mount(<App />);
    expect(app.find(".app-header").length).toEqual(1);
    expect(app.find(".error-bar").length).toEqual(0);
    expect(app.find(".drop-box").length).toEqual(1);
    expect(app.find(".result-view").length).toEqual(0);
  });

  it("If have errors, will show error bar", () => {
    const app = mount(<App />);
    app.setState({ errors });
    expect(app.find(".app-header").length).toEqual(1);
    expect(app.find(".error-bar").length).toEqual(1);
    expect(app.find(".drop-box").length).toEqual(1);
  });

  it("If have result, will show result view and not show dropbox", () => {
    const app = mount(<App />);
    app.setState({ result });
    expect(app.find(".app-header").length).toEqual(1);
    expect(app.find(".error-bar").length).toEqual(0);
    expect(app.find(".drop-box").length).toEqual(0);
    expect(app.find(".result-view").length).toEqual(1);
  });
});
