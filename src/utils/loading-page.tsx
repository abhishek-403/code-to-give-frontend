import Loader from "./loader";

type Props = {};

export default function LoadingPage({}: Props) {
  return (
    <div className="h-screen flex items-center justify-center bg-black bg-opacity-10 center text-white">
      <Loader />
    </div>
  );
}
