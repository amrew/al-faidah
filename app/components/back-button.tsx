import { useNavigate } from "react-router-dom";

import { BiArrowBack } from "react-icons/bi";

type Props = {
  withText?: boolean;
};

export function BackButton(props: Props) {
  const { withText = true } = props;
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <button type="button" className="btn-ghost btn" onClick={() => goBack()}>
      <BiArrowBack size={20} /> {withText ? "Kembali" : ""}
    </button>
  );
}
