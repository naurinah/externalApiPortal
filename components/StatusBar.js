import EqualizerIcon from "@material-ui/icons/Equalizer";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CurrencyFormat from "react-currency-format";
import { useState, useEffect } from "react";

const StatusBar = () => {
  const [newCustomers, setNewCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [dangerApi, setDangerApi] = useState(null);
  const [sales, setSales] = useState(0);

  const fetchTotalOrders = async () => {
    const response = await fetch(
      "https://bigazure.com/api/json_v4/dashboard/API_PORTAL_API/api_totalOrders.php"
    ).then((res) => res.json());
        setTotalOrders(response[0].TotalOrders);
    
   
  };

   const fetchNewCustomers = async () => {
  
   const response = await fetch(
     "https://bigazure.com/api/json_v4/dashboard/API_PORTAL_API/api_newCustomerCount.php"
   ).then(response => response.json());
    setNewCustomers(response[0].NewCustomers);
}
  
  
  
  const fetchDangerApi = async () => {
    const response = await fetch(
      "https://bigazure.com/api/json_v4/dashboard/API_PORTAL_API/api_tophits.php"
    ).then((res) => res.json());
    setDangerApi(response);
  };

  const MINUTE_MS = 30000;

  useEffect(async () => {
    
    fetchTotalOrders();
    fetchNewCustomers();
    fetchDangerApi();
    const interval = setInterval(async () => {
     
      await fetchTotalOrders();
      await fetchNewCustomers();
      await fetchDangerApi();
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-6 p-[2rem]">
        {/* Shipment */}
        <div className="bg-white min-h-[7rem] w-[18rem] flex flex-1 items-center rounded-md shadow-md border-b-4 border-[#1bc943]  p-2">
          <div className="bg-[#1bc943] h-12 w-12 rounded-full flex items-center justify-center mx-4 ">
            <EqualizerIcon className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">SHIPMENTS TODAY</p>
            <h2 className="text-[#1bc943] font-bold text-4xl">
              <CurrencyFormat
                value={totalOrders}
                displayType={"text"}
                thousandSeparator={true}
              />
            </h2>
          </div>
        </div>
        {/* New Customers */}
        <div className="bg-white min-h-[7rem] w-[18rem] flex flex-1 items-center rounded-md shadow-md border-b-4 border-[#4191ff]  p-4">
          <div className="bg-[#4191ff] h-12 w-12 rounded-full flex items-center justify-center mx-4 ">
            <PermIdentityIcon className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1 flex">NEW CUSTOMERS
            <p className="text-[#1bc943]">(This Week)</p>
            </p>
            <h2 className="text-[#4191ff] font-bold text-4xl">
              <CurrencyFormat
                value={newCustomers}
                displayType={"text"}
                thousandSeparator={true}
              />
            </h2>
          </div>
        </div>
        {/* Danger Apis */}
        <div className="bg-white min-h-[7rem] w-[18rem] flex flex-1 items-center rounded-md shadow-md border-b-4 border-[#f83245]  p-2">
          <div className="bg-[#f83245] h-12 w-12 rounded-full flex items-center justify-center mx-4 ">
            <ReportProblemIcon className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">DANGER APIS</p>
            {dangerApi &&
              dangerApi.map((d) => (
                <h2
                  key={d.api_no}
                  className="text-[#f83245] font-semibold text-sm"
                >
                  {d.api_name} (
                  <CurrencyFormat
                    value={d.Total_hits}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                  ) Hits
                </h2>
              ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default StatusBar;
