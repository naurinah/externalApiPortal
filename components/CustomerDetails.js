import { Card, CardContent } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import { useState } from "react";
import CustomerTableData from "./CustomerTableData";

const CustomerDetails = () => {
  const [reloadApis, setReloadApis] = useState(false);
  return (
    <Card className="m-[2rem] mt-0 p-[1rem] border-b-4 border-[#4191ff]">
      <CardContent className="border-b flex justify-between items-center">
        <h2 className="font-bold text-lg">All CUSTOMER DETAILS</h2>
        <button
          onClick={() => setReloadApis(true)}
          className="bg-[#4191ff] w-3rem h-3rem flex justify-center items-center p-[.5rem] rounded-full"
        >
          <CachedIcon className="text-white" />
        </button>
      </CardContent>
      <CardContent>
        <CustomerTableData reload={reloadApis} setReload={setReloadApis} />
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;
