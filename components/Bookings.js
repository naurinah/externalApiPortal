import { Card, CardContent } from "@material-ui/core";
import { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import CurrencyFormat from "react-currency-format";

const Bookings = () => {
  const [data, setData] = useState([
    { Platform: "OpenAPi", Orders: 0 },
    { Platform: "Shopify", Orders: 0 },
    { Platform: "WordPress", Orders: 0 },
  ]);
  const [openApi, setOpenApi] = useState(0);
  const [shopify, setShopify] = useState(0);
  const [wordpress, setWordpress] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchBookings = async () => {
    const response = await fetch(
      "https://bigazure.com/api/json_v4/dashboard/API_PORTAL_API/api_platformWiseOrder.php"
    ).then((res) => res.json());
    if (response !== data) {
      setData(response);
    }
  };

  const MINUTE_MS = 30000;

  useEffect(async () => {
    await fetchBookings();
    const interval = setInterval(async () => {
      await fetchBookings();
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data) {
      let t = 0;
      for (let i = 0; i < data.length; i++) {
        t += +data[i].Orders;
        if (i === 0) setOpenApi(+data[i].Orders);
        else if (i === 1) setShopify(+data[i].Orders);
        else if (i === 2) setWordpress(+data[i].Orders);
      }
      setTotal(t);
    }
  }, [data]);
  return (
    <Card className="m-[2rem] mt-0 p-[1rem] border-b-4 border-[#1bc943]">
      <CardContent className="border-b ">
        <h2 className="font-bold text-lg">
          BOOKINGS{" "}
          <span className="font-normal text-sm">
            (Last 7 days) (
            <CurrencyFormat
              value={total}
              displayType={"text"}
              thousandSeparator={true}
            />
            )
          </span>
        </h2>
      </CardContent>
      <CardContent className="border-b flex items-center gap-6">
        <ProgressBar
          variant="success"
          now={(openApi * 100) / total}
          label={Math.round(parseFloat((openApi * 100) / total)) + "%"}
          className="flex-1"
        />
        <div className="flex flex-col items-center justify-center  w-[6rem]">
          <p className="text-sm text-gray-600 mb-1">OPEN APIS</p>
          <h2 className="text-[#1bc943] font-semibold text-xl">
            <CurrencyFormat
              value={openApi}
              displayType={"text"}
              thousandSeparator={true}
            />
          </h2>
        </div>
      </CardContent>
      <CardContent className="border-b flex items-center gap-6">
        <ProgressBar
          variant="info"
          now={(wordpress * 100) / total}
          label={Math.round(parseFloat((wordpress * 100) / total)) + "%"}
          className="flex-1"
         
        />
        <div className="flex flex-col items-center justify-center  w-[6rem]">
          <p className="text-sm text-gray-600 mb-1">WORDPRESS</p>
          <h2 className="text-[#4191ff] font-semibold text-xl">
            <CurrencyFormat
              value={wordpress}
              displayType={"text"}
              thousandSeparator={true}
            />
          </h2>
        </div>
      </CardContent>
      <CardContent className="flex items-center gap-6">
        <ProgressBar
          variant="danger"
          now={(shopify * 100) / total}
          label={Math.round(parseFloat((shopify * 100) / total)) + "%"}
          className="flex-1"
        />
        <div className="flex flex-col items-center justify-center w-[6rem]">
          <p className="text-sm text-gray-600 mb-1">Shopify</p>
          <h2 className="text-[#f83245] font-semibold text-xl">
            <CurrencyFormat
              value={shopify}
              displayType={"text"}
              thousandSeparator={true}
            />
          </h2>
        </div>
      </CardContent>
    </Card>
  );
};

export default Bookings;
