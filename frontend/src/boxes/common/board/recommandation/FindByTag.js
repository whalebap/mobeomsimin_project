import React, { useEffect, useState, useContext } from "react";
import {
  CardDeck,
  Card,
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  ButtonGroup,
  ToggleButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import "./Recommendation.css";
import { StoreSearchContext } from "../../../../context/StoreSearchContext";
import { useHistory } from "react-router-dom";
import {Stars} from "../map/FindByMap";

function FindByTag() {
  const [accountDetail] = useState(
    JSON.parse(sessionStorage.getItem("accountDetail") || `{}`)
  );
  const [latLng] = useState(
    JSON.parse(sessionStorage.getItem("userLocation") || "{}")
  );

  const [userInfo, setUserInfo] = useState({
    userGender: "",
    birthYear: 0,
    userGenderName: "",
    userAgeGroup: 0,
  });

  const [industryList, setIndustryList] = useState({
    total: [],
    user: [],
    search: [],
  });

  const [tag, setTag] = useState({
    ageGroup: 0,
    gender: "null",
    ageName: "연령",
    genderName: "성별",
    option: 0,
  });

  const [id, setId] = useState("");
  const [industryName, setIndustryName] = useState([]);
  const [resultStores, setResultStores] = useState([]);
  const { setStore } = useContext(StoreSearchContext);
  const history = useHistory();

  const radiosGender = [
    { name: "남성", value: "M" },
    { name: "여성", value: "F" },
    { name: "성별무관", value: "none" },
  ];

  const radiosAgeGroup = [
    { name: "10대", value: "10" },
    { name: "20대", value: "20" },
    { name: "30대", value: "30" },
    { name: "40대", value: "40" },
    { name: "50대", value: "50" },
    { name: "60대", value: "60" },
    { name: "연령무관", value: "100" },
  ];

  const radiosOption = [
    { name: "#인기많은", value: "1" },
    { name: "#즐겨찾기 많은", value: "2" },
    { name: "#별점 높은", value: "3" },
  ];

  useEffect(() => {
    setId(accountDetail.id);
    setUserInfo({
      ...userInfo,
      userGender: accountDetail.gender,
      birthday: accountDetail.birthDate.split("-")[0],
    });
  }, []);

  useEffect(() => {
    fixGenderKor(tag.gender);
    handleIndustry();
  }, [tag.gender]);

  useEffect(() => {
    fixAgeGroup(tag.ageGroup);
    handleIndustry();
  }, [tag.ageGroup]);

  useEffect(() => {
    if (id) {
      axios
        .get(
          `http://3.34.251.151:8080/recommends/user/${userInfo.userGender}/${userInfo.birthday}`
        )
        .then((res) => {
          setIndustryList((industryList) => ({
            ...industryList,
            total: res.data.byTotal,
            user: res.data.byGenderAge,
          }));
          setUserInfo({
            ...userInfo,
            userGenderName: res.data.userGenderKor,
            userAgeGroup: res.data.userAgeGroup,
          });
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [id]);

  const fixGenderKor = (gender) => {
    if (gender === "F") {
      setTag({ ...tag, genderName: "여성" });
    } else if (gender === "M") {
      setTag({ ...tag, genderName: "남성" });
    } else if (gender === "none") {
      setTag({ ...tag, genderName: "성별무관" });
    }
  };

  const fixAgeGroup = (ageGroup) => {
    if (ageGroup > 61) {
      setTag({ ...tag, ageName: "연령무관" });
    } else if (1 < ageGroup && ageGroup < 61) {
      setTag({ ...tag, ageName: ageGroup + "대" });
    }
  };

  const handleIndustry = () => {
    if (tag.gender !== "null" && tag.ageGroup !== 0) {
      axios
        .get(
          `http://3.34.251.151:8080/recommends/rank/${tag.gender}/${tag.ageGroup}`
        )
        .then((res) => {
          setIndustryList({ ...industryList, search: res.data.searchResult });
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  const handleGender = (e) => {
    setTag({ ...tag, gender: e.target.value });
  };

  const handleAge = (e) => {
    setTag({ ...tag, ageGroup: e.target.value });
  };

  const handleOption = (e) => {
    setTag({ ...tag, option: e.target.value });
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      해당 인근 가맹점이 없으면 인기순으로 보여집니다.
    </Tooltip>
  );

  const submitSearch = (e) => {
    e.preventDefault();
    if (tag.ageGroup === 0 || tag.gender === "null" || tag.option === 0) {
      alert("모든 사항을 선택 선택해주세요");
    } else {
      axios
        .post(
          `http://3.34.251.151:8080/recommends/result/${tag.gender}/${tag.ageGroup}/${tag.option}`,
          latLng
        )
        .then((res) => {
          const values = [];
          const keys = [];
          Object.entries(res.data).forEach(([key, value]) => {
            keys.push(key);
            values.push(value);
          });
          setIndustryName(keys);
          setResultStores(values);
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  const clickStore = (store) => {
    setStore(store);
    history.push("/storeDetail");
  };
  const showRatingStars = (numOfStars) => {
    let stars = "";
    for (let i = 0; i < numOfStars; i++) {
      stars += "★";
    }
    if (5 - numOfStars) {
      for (let i = 0; i < 5 - numOfStars; i++) {
        stars += "☆";
      }
    }
    return stars;
  };

  return (
    <>
      <h2 className="mt-4" style={{ "text-align": "center" }}>
        태그로 검색하기
        <br />
      </h2>
      <br />
      <div style={{ textAlign: "center" }}>
        <h3>&#128184; 소비자별 인기 업종 &#128184;</h3>

        <CardDeck>
          <Card style={{ width: "18rem" }}>
            <Card.Header as="h5">전체 업종 TOP 5</Card.Header>
            {industryList.total.map((industry, i) => (
              <ListGroup variant="flush">
                <ListGroup.Item key={i}>
                  {i + 1}. {industry.industryName}
                </ListGroup.Item>
              </ListGroup>
            ))}
          </Card>
          <Card>
            <Card.Header as="h5">
              나(
              <span style={{ color: "#7C05F2" }}>
                {userInfo.userAgeGroup}대
              </span>
              X
              <span style={{ color: "#7C05F2" }}>
                {userInfo.userGenderName}
              </span>
              )의 업종 TOP 5
            </Card.Header>
            {industryList.user.map((industry, i) => (
              <ListGroup variant="flush">
                <ListGroup.Item key={i}>
                  {industryList.total[i].industryName !==
                  industryList.user[i].industryName ? (
                    <span style={{ color: "#3B6FD9" }}>
                      {i + 1}. {industry.industryName}
                    </span>
                  ) : (
                    <span>
                      {i + 1}. {industry.industryName}
                    </span>
                  )}
                </ListGroup.Item>
              </ListGroup>
            ))}
          </Card>
          {
            <Card>
              <Card.Header as="h5">
                <span style={{ color: "#7C05F2" }}>{tag.ageName}</span>X
                <span style={{ color: "#7C05F2" }}>{tag.genderName}</span>의
                업종 TOP 5
              </Card.Header>
              {industryList.search.map((industry, i) => (
                <ListGroup variant="flush">
                  <ListGroup.Item key={i}>
                    {industryList.total[i].industryName !==
                    industryList.search[i].industryName ? (
                      <span style={{ color: "#3B6FD9" }}>
                        {i + 1}. {industry.industryName}
                      </span>
                    ) : (
                      <span>
                        {i + 1}. {industry.industryName}
                      </span>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              ))}
            </Card>
          }
        </CardDeck>
        <h5 style={{ textAlign: "right" }}>
          출처 : 경기지역화폐 일반발행카드의 주간 결제금액
          정보(2019.09.23~2019.09.29)
          <br />
          <a
            href={
              "https://www.bigdata-region.kr/#/dataset/9b6a1038-b8a9-404e-9008-4cc1aa5a16b2"
            }
          >
            -경기지역경제포털
          </a>
        </h5>
      </div>
      <br />
      <br />
      <br />

      <h3 style={{ textAlign: "center" }}>&#128270; 태그 검색 &#128270;</h3>
      <br />
      <Form>
        <Form.Group as={Row} controlId="formHorizontalPassword">
          <Form.Label column sm={2}>
            <h4 style={{ textAlign: "center" }}>성별</h4>
          </Form.Label>
          <Col sm={10}>
            <ButtonGroup toggle>
              {radiosGender.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="outline-dark"
                  name="genderGroup"
                  value={radio.value}
                  onChange={handleGender}
                  checked={tag.gender === radio.value}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            <h4 style={{ textAlign: "center" }}>연령대</h4>
          </Form.Label>
          <Col sm={10}>
            <ButtonGroup toggle>
              {radiosAgeGroup.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="outline-dark"
                  name="AgesGroup"
                  value={radio.value}
                  onChange={handleAge}
                  checked={tag.ageGroup === radio.value}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formHorizontalPassword">
          <Form.Label column sm={2}>
            <h4 style={{ textAlign: "center" }}>정렬 조건</h4>
          </Form.Label>
          <Col sm={10}>
            <OverlayTrigger placement="bottom" overlay={renderTooltip}>
              <ButtonGroup toggle>
                {radiosOption.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    type="radio"
                    variant="outline-dark"
                    name="optionGroup"
                    value={radio.value}
                    onChange={handleOption}
                    checked={tag.option === radio.value}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </OverlayTrigger>
            ,
          </Col>
          <br /> <br />
        </Form.Group>
        <div style={{ textAlign: "center" }}>
          <Button variant="primary" type="submit" onClick={submitSearch}>
            맞춤 가맹점 검색
          </Button>{" "}
        </div>
      </Form>

      <br />
      <br />
      <br />
      <br />
      {resultStores.map((list, i) => (
        <div>
          <h2 key={i}>{`#${industryName[i]}업`}</h2>
          <div className="scrollContainer">
            {list.map((store, j) => (
              <Card className="cardItem" key={j}>
                <Card.Img id="card-image" variant="top" src={store.imgUrl} />
                <Card.Body>
                  <Card.Title
                    style={{ cursor: "pointer" }}
                    id="card-title"
                    onClick={() => {
                      clickStore(store);
                    }}
                  >
                    {store.storeName}
                  </Card.Title>
                  <Card.Text>
                    {store.starRanking ? (
                      <span>
                        <Stars store={store}/>
                        {" "}
                        {parseFloat(store.starRanking).toFixed(1)}(
                        {store.ratingCount})
                      </span>
                    ) : (
                      <span style={{ color: "gray" }}>
                        아직 별점이 없습니다.
                      </span>
                    )}
                    <br />
                    {store.address}
                  </Card.Text>
                </Card.Body>
                <Card.Footer id="card-footer">
                  <small className="text-muted">
                    {store.mainCode}/{store.storeType}
                  </small>
                </Card.Footer>
              </Card>
            ))}
          </div>
          <br />
          <br />
          <br />
        </div>
      ))}
    </>
  );
}

export default FindByTag;
