import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, TimePicker, Form, Select, ConfigProvider, message } from "antd";
import { useSelector, Provider } from "react-redux";
import store from "../../../store";

import dayjs from "dayjs";
import jaJP from "antd/locale/ja_JP";
import "./index.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectTrip } from "../../../store/modules/trip";

library.add(fas);
const format = "HH:mm";
const locale = jaJP;
let timeOut = "00:00";
let day;

const config = {
  title: (
    <div className="modalTitle">
      <h2>定期的</h2>
    </div>
  ),
  content: (
    <Provider store={store}>
      <ConfigProvider locale={locale}>
        <Content />
      </ConfigProvider>
    </Provider>
  ),
  icon: <p />,
  okText: "設定",
  cancelText: "キャンセル",
  onCancel() {
    var postData = {
      id: store.getState().trip.userId,
    };
    axios
      .post(
        process.env.REACT_APP_API_URL + "/customer/disable-weekly-schedule",
        postData
      )
      .then((res) => {
        console.log(res);
        message.success("予約が正常にキャンセルされました。!");
      })
      .catch((error) => {
        console.log(error);
      });
  },
  onOk(close) {
    if (!day || day.length <= 0) {
      message.error("データを入力してください。");
    } else {
      var postData = {
        id: store.getState().trip.userId,
        pickup_time: timeOut,
        trip: store.getState().trip,
        day: day.map((item) => item + 1),
      };
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          process.env.REACT_APP_API_URL + "/customer/set-weekly-schedule",
          postData,
          axiosConfig
        )
        .then((res) => {
          console.log(res);
          message.success("予約が成功しました!");
          close();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
};
function Content() {
  const trip = useSelector(selectTrip);

  const [days, setDays] = useState();
  const [timeDefault, setTimeDefault] = useState();
  const [loaded, setLoaded] = useState(false);
  const selectOption = [
    {
      label: "月曜日",
      value: 0,
    },
    {
      label: "火曜日",
      value: 1,
    },
    {
      label: "水曜日",
      value: 2,
    },
    {
      label: "木曜日",
      value: 3,
    },
    {
      label: "金曜日",
      value: 4,
    },
    {
      label: "土曜日",
      value: 5,
    },
    {
      label: "日曜日",
      value: 6,
    },
  ];
  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/customer/get-weekly-schedule/" +
          store.getState().trip.userId
      )
      .then((res) => {
        console.log(res);
        day = res.data.days.map((item) => Number(item) - 1);
        timeOut = res.data.time;
        setDays(day);
        setTimeDefault(timeOut);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        day = [];
        setDays(day);
        setTimeDefault(timeOut);
        setLoaded(true);
      });
  }, []);
  const handleChange = (value) => {
    day = value;
  };
  const onTimeChange = (time, timeString) => {
    timeOut = timeString;
  };
  return (
    <div>
      {loaded && (
        <Form colon={false}>
          <h3>自分の場所</h3>
          <Form.Item
            label={<FontAwesomeIcon icon="fa-solid fa-circle-dot" size="xl" />}
          >
            <Input readOnly placeholder="Basic usage" value={trip.start.name} />
          </Form.Item>
          <h3>目的地</h3>
          <Form.Item
            label={
              <FontAwesomeIcon icon="fa-solid fa-location-dot" size="xl" />
            }
          >
            <Input readOnly placeholder="Basic usage" value={trip.end.name} />
          </Form.Item>
          <Form.Item
            label={<FontAwesomeIcon icon="fa-solid fa-stopwatch" size="xl" />}
          >
            <TimePicker
              defaultValue={dayjs(timeDefault, format)}
              format={format}
              onChange={onTimeChange}
            />
          </Form.Item>
          <h3>繰り返す</h3>
          <Form.Item
            label={
              <FontAwesomeIcon icon="fa-solid fa-calendar-week" size="xl" />
            }
          >
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="選んでください"
              defaultValue={days}
              options={selectOption}
              onChange={handleChange}
            />
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
export default config;
