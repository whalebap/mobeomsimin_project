import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Geocode from "react-geocode";

const Login = () => {
  const [userId, setUserId] = useState("user_example");
  const [password, setPassword] = useState("user_example123");
  const history = useHistory();

  const getLatLng = async (location) => {
    await Geocode.fromAddress(location).then(
      (response) => {
        const resLatLng = response.results[0].geometry.location;
        sessionStorage.setItem("userLocation", JSON.stringify(resLatLng));
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const handleLoginButton = (e) => {
    e.preventDefault();
    if (userId && password) {
      axios
        .post(`http://3.34.251.151:8080/users/login`, {
          userId: userId,
          password: password,
        })
        .then((response) => {
          sessionStorage.setItem(
            "accountDetail",
            JSON.stringify(response.data)
          );
          getLatLng(response.data.defaultAddr);
          if (response.status === 200) history.push("/");
        })
        .catch(() => {
          alert("아이디와 비밀번호를 다시 확인하세요.");
          window.location.reload();
        });
    } else {
      alert(`아이디와 비밀번호를 입력하세요.`);
    }
  };

  return (
    <div className="container account_login">
      <form>
        <div className="form-group">
          <input
            type="text"
            style = {{width : "100%"}}
            className="form-control"
            id="userId"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            style = {{width : "100%"}}
            className="form-control"
            id="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <label>
              <input type="checkbox" /> 자동로그인
            </label>
            <span id="login-link">
              <Link to="/account/find-id">아이디/비밀번호 찾기</Link>
            </span>
          </div>
        </div>
      </form>
      <button
        type="submit"
        className="btn btn-success"
        id="login-button"
        onClick={handleLoginButton}
      >
        로그인
      </button>
      <div>
        <p>아직 회원이 아니신가요?</p>
        <Link
          to="/account/term-n-condition"
          className="btn btn-primary"
          id="login-button"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default Login;
