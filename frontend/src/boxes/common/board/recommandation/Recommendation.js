import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Card, Spinner, Button } from "react-bootstrap";
import "./Recommendation.css";
import { StoreSearchContext } from "../../../../context/StoreSearchContext";
import { useHistory } from "react-router-dom";
import { Stars } from "../map/FindByMap";

function Recommendation() {
  const [accountDetail] = useState(
    JSON.parse(sessionStorage.getItem("accountDetail") || "{}")
  );
  const [latLng] = useState(
    JSON.parse(sessionStorage.getItem("userLocation") || "{}")
  );
  const [id, setId] = useState("");

  const [userBased, setUserBased] = useState(null);
  const [itemBased, setItemBased] = useState(null);
  const [itemBasedStore, setItemBasedStore] = useState("");

  const [mainRecommend, setMainRecommend] = useState({
    best: [],
    favorite: [],
    rated: [],
    userFavorite: null,
    userFavStore: "",
    noFavMsg: "",
  });

  const [userWarningMsg, setUserWarningMsg] = useState("");
  const [itemWarningMsg, setItemWarningMsg] = useState("");

  const [mainIndustry, setMainIndustry] = useState({
    hospital: [],
    restaurant: [],
    drinks: [],
  });
  const { setStore } = useContext(StoreSearchContext);
  const history = useHistory();

  useEffect(() => {
    setId(accountDetail.id);
  }, [accountDetail]);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://3.34.251.151:8080/recommends/userBased/${id}`)
        .then((res) => {
          if (res.data.userBased) {
            setUserBased(res.data.userBased);
          } else if (res.data.noUserBased) {
            setUserWarningMsg(res.data.noUserBased);
          }
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://3.34.251.151:8080/recommends/itemBased/${id}`)
        .then((res) => {
          if (res.data.itemBased) {
            setItemBased(res.data.itemBased);
            setItemBasedStore(res.data.itemBasedStore);
          } else if (res.data.noItemBased) {
            setItemWarningMsg(res.data.noItemBased);
          }
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      axios
        .post(`http://3.34.251.151:8080/recommends/all/${id}`, latLng)
        .then((res) => {
          setMainRecommend({
            ...mainRecommend,
            best: res.data.bestStore,
            favorite: res.data.mostFavorites,
            rated: res.data.bestRated,
            userFavorite: res.data.userFavBased,
            userFavStore: res.data.userFavStore,
            noFavMsg: res.data.noFavorite,
          });

          setMainIndustry({
            ...mainIndustry,
            hospital: res.data.hospital,
            restaurant: res.data.restaurant,
            drinks: res.data.drinks,
          });
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [id]);

  const pageScroll = () => {
    window.scrollBy(1, 0);
    setTimeout(pageScroll, 10);
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

  const clickStore = (store) => {
    setStore(store);
    history.push("/storeDetail");
  };

  return (
    <>
      <h2 className="mt-4" style={{ textAlign: "center" }}>
        <span style={{ color: "#7C05F2" }}>{accountDetail.name} 님</span>을 위한
        우리 동네 추천 가맹점
      </h2>
      <br />
      <h3>&#128077; 내 주변 인기 가맹점</h3>
      <div className="scrollContainer">
        {mainRecommend.best.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <h4>인근에 해당하는 가맹점이 없습니다. </h4>
          </div>
        )}
        {mainRecommend.best.map((store) => (
          <Card className="cardItem" key={store.id}>
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
                  <span style={{ color: "gray" }}>아직 별점이 없습니다.</span>
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

      <h3>&#127775; 내 주변 별점 높은 가맹점</h3>
      <div className="scrollContainer">
        {mainRecommend.rated.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <h4>인근에 해당하는 가맹점이 없습니다.</h4>
          </div>
        )}
        {mainRecommend.rated.map((store) => (
          <Card className="cardItem" key={store.id}>
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
                  <span></span>
                )}
                <br />
                {store.address}
              </Card.Text>
            </Card.Body>
            <Card.Footer id="card-footer">
              <store className="text-muted">
                {store.mainCode}/{store.storeType}
              </store>
            </Card.Footer>
          </Card>
        ))}
      </div>
      <br />
      <br />

      <h3>&#128152; 즐겨찾은 사람이 많은 가맹점</h3>
      <div className="scrollContainer">
        {mainRecommend.favorite.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <h4>인근에 해당하는 가맹점이 없습니다. </h4>
          </div>
        )}
        {mainRecommend.favorite.map((store) => (
          <Card className="cardItem" key={store.id}>
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
                  <span style={{ color: "gray" }}>아직 별점이 없습니다.</span>
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

      <h3>&#127973; 인기 #병원 가맹점</h3>
      <div className="scrollContainer">
        {mainIndustry.hospital.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <h4>인근에 해당하는 가맹점이 없습니다. </h4>
          </div>
        )}
        {mainIndustry.hospital.map((store) => (
          <Card className="cardItem" key={store.id}>
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
                  <span style={{ color: "gray" }}>아직 별점이 없습니다.</span>
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

      <h3>&#129368; 인기 #음식점 가맹점</h3>
      <div className="scrollContainer">
        {mainIndustry.restaurant.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <h4>인근에 해당하는 가맹점이 없습니다. </h4>
          </div>
        )}
        {mainIndustry.restaurant.map((store) => (
          <Card className="cardItem" key={store.id}>
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
                  <span style={{ color: "gray" }}>아직 별점이 없습니다.</span>
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

      <h3>&#127846; 인기 #음료식품 가맹점</h3>
      <div className="scrollContainer">
        {mainIndustry.drinks.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <h4>인근에 해당하는 가맹점이 없습니다. </h4>
          </div>
        )}
        {mainIndustry.drinks.map((store) => (
          <Card className="cardItem" key={store.id}>
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
                  <span style={{ color: "gray" }}>아직 별점이 없습니다.</span>
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

      {mainRecommend.userFavorite && (
        <div>
          <h3>
            &#127879; 즐겨찾기한{" "}
            <span style={{ color: "#7C05F2" }}>
              {mainRecommend.userFavStore}
            </span>{" "}
            가맹점과 동일 업종 추천 가맹점
          </h3>
          <div className="scrollContainer">
            {mainRecommend.userFavorite.map((store) => (
              <Card className="cardItem" key={store.id}>
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
        </div>
      )}

      {mainRecommend.noFavMsg && (
        <div>
          <h3>&#127879; 즐겨찾기한 가맹점과 동일 업종 추천 가맹점</h3>
          <div id="msg">
            <h4 style={{ textAlign: "center" }}>
              {mainRecommend.noFavMsg}
              <br />
              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => {
                  history.push("/find-by-map");
                }}
              >
                즐겨찾기 추가하기
              </Button>
            </h4>
          </div>
        </div>
      )}
      <br />
      <br />

      <h3>&#128109; 회원님과 유사한 회원들이 좋아하는 가맹점</h3>
      {!userWarningMsg && !userBased && (
        <div id="msg">
          <h4>찾 는 중 &#8987; </h4>
          <br />
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="light" />
          <Spinner animation="grow" variant="dark" />
        </div>
      )}

      {userBased && (
        <div className="scrollContainer">
          {userBased.map((store) => (
            <Card className="cardItem" key={store.id}>
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
                    <span style={{ color: "gray" }}>아직 별점이 없습니다.</span>
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
      )}
      {userWarningMsg && (
        <div id="msg">
          <h4>
            {userWarningMsg}
            <br />
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => {
                history.push("/find-by-map");
              }}
            >
              별점 추가하기
            </Button>
          </h4>
        </div>
      )}
      <br />
      <br />

      <h3>
        &#128525; 리뷰한{" "}
        <span style={{ color: "#7C05F2" }}>{itemBasedStore}</span> 가맹점과
        유사한 추천 가맹점
      </h3>
      {!itemWarningMsg && !itemBased && (
        <div id="msg">
          <h4>찾 는 중 &#8987;</h4>
          <br />
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="light" />
          <Spinner animation="grow" variant="dark" />
          <br />
          <br />
        </div>
      )}

      {itemBased && (
        <div>
          <div className="scrollContainer">
            {itemBased.map((store) => (
              <Card className="cardItem" key={store.id}>
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
        </div>
      )}
      {itemWarningMsg && (
        <div id="msg">
          <h4>
            {itemWarningMsg}
            <br />
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => {
                history.push("/find-by-map");
              }}
            >
              별점 추가하기
            </Button>
          </h4>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default Recommendation;
