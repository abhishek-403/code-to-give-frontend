type Props = {};
import { Oval } from "react-loader-spinner";
export default function Loader({}: Props) {
  return (
    <div>
      <Oval
        visible={true}
        height="40"
        width="40"
        color={"#000000"}
        secondaryColor={"#A0A0A0"}
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        strokeWidth={2}
        wrapperClass=""
        strokeWidthSecondary={2}
      />
    </div>
  );
}
