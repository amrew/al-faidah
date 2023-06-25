import { useNavigate } from "react-router-dom";

import { BiArrowBack } from "react-icons/bi";

export function BackButton() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <button type="button" className="btn-ghost btn" onClick={() => goBack()}>
      <BiArrowBack size={20} /> Kembali
    </button>
  );
}
