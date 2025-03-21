import { useAuth } from "@/lib/hooks/useAuth";
import googleIcon from "../assets/googleicon.png";
import { useSignUpWithGoogleMutation } from "@/services/auth";
import { auth } from "@/lib/firebaseConfig";
type Props = {};

export default function Navbar({}: Props) {
  const { mutate: signIn, isPending, error } = useSignUpWithGoogleMutation();
  const user = useAuth();
  console.log(user);
  if (user.isLoading) {
    return <div>Loading..</div>;
  }
  return (
    <div>
      {user.user ? (
        <div className="cursor-pointer" onClick={async () => await auth.signOut()}>Sign out </div>
      ) : (
        <button
          onClick={() => signIn()}
          disabled={isPending}
          className=" mx-auto rounded-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-80 hover:bg-neutral-75 text-black transition"
        >
          <img src={googleIcon} alt="Google Logo" className="w-[24px]" />
          <span className="text-base">Sign up</span>
        </button>
      )}
    </div>
  );
}
