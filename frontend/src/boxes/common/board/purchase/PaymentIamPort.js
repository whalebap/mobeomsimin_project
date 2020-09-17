import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";

const PaymentIamPort = (props) => {
  const [accountDetail] = useState(
    JSON.parse(sessionStorage.getItem("accountDetail") || `{}`)
  );
  const [id, setId] = useState("");
  const history = useHistory();

  useEffect(() => {
    setId(accountDetail.id);
  }, [accountDetail]);

  const onClickPayment = (props) => {
    const { IMP } = window;
    IMP.init();

    const data = {
      pg: "kakao",
      pay_method: "card",
      merchant_uid: `mid_${new Date().getTime()}`,
      amount: props.unitPrice,
      name: `${props.localName} 지역화폐 구매`,
      buyer_name: accountDetail.name,
    };
    IMP.request_pay(data, callback);
  };

  function callback(res) {
    const { success, error_msg } = res;

    if (success) {
      axios
        .post(`http://3.34.251.151:8080/sales/create-sales/${id}`, {
          unitPrice: res.paid_amount,
          paymentName: res.pay_method,
          localName: props.localName,
        })
        .then(() => {
          history.push("/mypage/purchase-history/notice");
        })
        .catch((err) => {
          throw err;
        });
      let msg = `${res.name} ${res.paid_amount}원 결제가 완료되었습니다.`;
      alert(msg);
    } else {
      alert(`결제에 실패했습니다: ${error_msg}`);
    }
  }

  return (
    <>
      <Button onClick={() => onClickPayment(props)}>결제하기</Button>
    </>
  );
};
export default PaymentIamPort;
